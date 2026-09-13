/**
 * Extra-field storage.
 *
 * Every LitMatrix value is one line in the item's Extra field:
 *   lm.<key>: <value>
 * Lines that don't start with the namespace are preserved verbatim, so other
 * plugins (Better BibTeX "Citation Key: ...", etc.) are never touched.
 * Multi-line values are stored with a literal "\n" escape.
 */

export const NS = "lm.";

function encode(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n");
}

function decode(raw: string): string {
  return raw.replace(/\\n/g, "\n").replace(/\\\\/g, "\\");
}

function isOurLine(line: string, key?: string): boolean {
  if (!line.startsWith(NS)) return false;
  if (!key) return true;
  return line.startsWith(`${NS}${key}:`);
}

/** All lm.* values on an item, decoded. */
export function getAllValues(item: Zotero.Item): Record<string, string> {
  const out: Record<string, string> = {};
  const extra = (item.getField("extra") as string) || "";
  for (const line of extra.split(/\r?\n/)) {
    if (!isOurLine(line)) continue;
    const idx = line.indexOf(":");
    if (idx < 0) continue;
    const key = line.slice(NS.length, idx).trim();
    out[key] = decode(line.slice(idx + 1).trim());
  }
  return out;
}

export function getValue(item: Zotero.Item, key: string): string {
  return getAllValues(item)[key] ?? "";
}

/**
 * Set (or remove, when value is empty) one value. Modifies the item in memory
 * only; caller must `await item.saveTx()`.
 */
export function setValue(item: Zotero.Item, key: string, value: string): void {
  const extra = (item.getField("extra") as string) || "";
  const lines = extra ? extra.split(/\r?\n/) : [];
  const kept = lines.filter((l) => !isOurLine(l, key));
  const v = (value ?? "").trim();
  if (v !== "") kept.push(`${NS}${key}: ${encode(v)}`);
  // Drop trailing empty lines so Extra stays tidy.
  while (kept.length && kept[kept.length - 1].trim() === "") kept.pop();
  item.setField("extra", kept.join("\n"));
}

/** Keys currently present on an item (used to infer a schema when prefs are lost). */
export function getKeys(item: Zotero.Item): string[] {
  return Object.keys(getAllValues(item));
}
