#!/usr/bin/env node
/**
 * Evaluate JavaScript inside the running dev Zotero (launched by `npm start`)
 * through the Firefox Remote Debugging Protocol.
 *
 * Usage:  node tools/zeval.mjs "return Zotero.version"
 *         node tools/zeval.mjs -f script.js
 * The code runs inside an async function with these locals available:
 *   Zotero, win (main window), ZoteroPane, document, LM (the plugin instance)
 * Use `return` to send a value back (JSON-serialised). Errors are reported.
 */
import net from "node:net";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

function findPort() {
  const ps = execSync("ps -axo args").toString();
  const m = ps.match(/-start-debugger-server (\d+)/);
  if (!m) throw new Error("No running Zotero with -start-debugger-server (run `npm start` in src/).");
  return Number(m[1]);
}

class RDP {
  constructor() {
    this.buf = Buffer.alloc(0);
    this.waiters = [];
    this.events = [];
  }
  connect(port) {
    return new Promise((resolve, reject) => {
      this.sock = net.createConnection({ port, host: "127.0.0.1" }, () => {});
      this.sock.on("error", reject);
      this.sock.on("data", (d) => this.onData(d));
      this.once((p) => p.from === "root").then(resolve);
    });
  }
  onData(d) {
    this.buf = Buffer.concat([this.buf, d]);
    for (;;) {
      const idx = this.buf.indexOf(":");
      if (idx < 0) return;
      const len = parseInt(this.buf.slice(0, idx).toString(), 10);
      if (Number.isNaN(len)) throw new Error("Bad RDP frame: " + this.buf.slice(0, 40));
      if (this.buf.length < idx + 1 + len) return;
      const json = this.buf.slice(idx + 1, idx + 1 + len).toString();
      this.buf = this.buf.slice(idx + 1 + len);
      const packet = JSON.parse(json);
      this.dispatch(packet);
    }
  }
  dispatch(p) {
    const i = this.waiters.findIndex((w) => w.match(p));
    if (i >= 0) {
      const [w] = this.waiters.splice(i, 1);
      w.resolve(p);
    } else this.events.push(p);
  }
  once(match, timeoutMs = 20000) {
    const j = this.events.findIndex(match);
    if (j >= 0) return Promise.resolve(this.events.splice(j, 1)[0]);
    return new Promise((resolve, reject) => {
      const w = { match, resolve };
      this.waiters.push(w);
      setTimeout(() => {
        const k = this.waiters.indexOf(w);
        if (k >= 0) {
          this.waiters.splice(k, 1);
          reject(new Error("RDP timeout waiting for packet"));
        }
      }, timeoutMs);
    });
  }
  send(obj) {
    const s = JSON.stringify(obj);
    this.sock.write(`${Buffer.byteLength(s)}:${s}`);
  }
  async request(obj) {
    this.send(obj);
    const p = await this.once((x) => x.from === obj.to && x.type !== "evaluationResult");
    if (p.error) throw new Error(`${p.error}: ${p.message}`);
    return p;
  }
  close() {
    this.sock.end();
  }
}

const PRELUDE = `
var Zotero = ChromeUtils.importESModule("chrome://zotero/content/zotero.mjs").Zotero;
var win = Zotero.getMainWindow(); var ZoteroPane = win && win.ZoteroPane; var document = win && win.document;
var LM = Zotero.LitMatrix;
function __safe(v){ try { if (v === undefined) return "undefined"; return JSON.stringify(v, (k, x) => (typeof x === "function" ? "[fn]" : x), 1); } catch (e) { try { return String(v); } catch (e2) { return "[unserialisable]"; } } }
`;

async function main() {
  const args = process.argv.slice(2);
  let code = args[0] === "-f" ? readFileSync(args[1], "utf8") : args.join(" ");
  if (!code) {
    console.error("usage: zeval.mjs '<js with return>' | -f file.js");
    process.exit(2);
  }
  const port = findPort();
  const rdp = new RDP();
  await rdp.connect(port);
  const proc = await rdp.request({ to: "root", type: "getProcess", id: 0 });
  const descriptor = proc.processDescriptor || proc.form;
  const target = await rdp.request({ to: descriptor.actor, type: "getTarget" });
  const t = target.process || target.target || target.frame;
  const consoleActor = t.consoleActor;

  const wrapped = `
${PRELUDE}
var __lm = (globalThis.__lmEval = globalThis.__lmEval || { id: 0 }); var __id = ++__lm.id; __lm[__id] = { done: false };
(async () => {
  try { var r = await (async () => { ${code}\n })(); __lm[__id] = { done: true, ok: true, value: __safe(r) }; }
  catch (e) { __lm[__id] = { done: true, ok: false, error: String(e) + " | " + String(e && e.stack || "") }; }
})();
__id;`;

  rdp.send({ to: consoleActor, type: "evaluateJSAsync", text: wrapped });
  const first = await rdp.once((p) => p.from === consoleActor && p.type === "evaluationResult");
  if (first.exception || first.exceptionMessage) {
    console.error("SYNTAX/EVAL ERROR:", first.exceptionMessage || JSON.stringify(first.exception));
    rdp.close();
    process.exit(1);
  }
  const id = first.result;
  const deadline = Date.now() + 30000;
  let out;
  while (Date.now() < deadline) {
    rdp.send({ to: consoleActor, type: "evaluateJSAsync", text: `JSON.stringify(globalThis.__lmEval && globalThis.__lmEval[${id}])` });
    const r = await rdp.once((p) => p.from === consoleActor && p.type === "evaluationResult");
    const st = typeof r.result === "string" ? JSON.parse(r.result) : null;
    if (st && st.done) { out = st; break; }
    await new Promise((res) => setTimeout(res, 150));
  }
  rdp.close();
  if (!out) { console.error("TIMEOUT: async code did not finish in 30s"); process.exit(1); }
  if (out.ok) {
    try { console.log(typeof out.value === "string" ? JSON.parse(out.value) : out.value); } catch { console.log(out.value); }
  } else { console.error("ERROR:", out.error); process.exit(1); }
}

main().catch((e) => { console.error("zeval failed:", e.message); process.exit(1); });
