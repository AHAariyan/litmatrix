/**
 * Matrix window: one row per item of the current collection / search /
 * library, one column per field, editable in place.
 */
import { config } from "../../package.json";
import { isWindowAlive } from "../utils/window";
import { compareValues, createControl, h } from "./controls";
import { Field, loadSchema } from "./schema";
import { getAllValues, setValue } from "./store";

interface Scope {
  kind: "collection" | "search" | "library";
  id: number; // collectionID / searchID / libraryID
  name: string;
}

interface Row {
  item: Zotero.Item;
  title: string;
  author: string;
  year: string;
  values: Record<string, string>;
}

interface State {
  scope: Scope;
  rows: Row[];
  sortKey: string; // "title" | "author" | "year" | field.key
  sortDir: 1 | -1;
  filter: string;
}

const FIXED: { key: string; label: string; cls?: string }[] = [
  { key: "title", label: "Title", cls: "lm-c-title" },
  { key: "author", label: "First author" },
  { key: "year", label: "Year", cls: "lm-num" },
];

function currentScope(win: _ZoteroTypes.MainWindow): Scope {
  const pane = win.ZoteroPane;
  const collection = pane.getSelectedCollection();
  if (collection) return { kind: "collection", id: collection.id, name: collection.name };
  const search = pane.getSelectedSavedSearch();
  if (search) return { kind: "search", id: search.id, name: search.name };
  const libraryID = pane.getSelectedLibraryID();
  const lib = Zotero.Libraries.get(libraryID);
  return { kind: "library", id: libraryID, name: lib ? lib.name : "Library" };
}

export function openMatrix(win?: _ZoteroTypes.MainWindow): void {
  const mainWin = win || Zotero.getMainWindow();
  const scope = currentScope(mainWin);
  const existing = addon.data.matrixWindow;
  if (isWindowAlive(existing)) {
    existing!.close();
  }
  const w = mainWin.openDialog(
    `chrome://${config.addonRef}/content/matrix.xhtml`,
    "litmatrix-matrix",
    "chrome,resizable,centerscreen,dialog=no,width=1280,height=760",
    scope,
  ) as Window;
  addon.data.matrixWindow = w;
}

async function loadRows(scope: Scope): Promise<Row[]> {
  let items: Zotero.Item[] = [];
  if (scope.kind === "collection") {
    const c = Zotero.Collections.get(scope.id) as Zotero.Collection;
    items = c ? (c.getChildItems(false, false) as Zotero.Item[]) : [];
  } else if (scope.kind === "search") {
    const s = Zotero.Searches.get(scope.id) as Zotero.Search;
    const ids = s ? await s.search() : [];
    items = Zotero.Items.get(ids) as Zotero.Item[];
  } else {
    items = (await Zotero.Items.getAll(scope.id, true, false)) as Zotero.Item[];
  }
  return items
    .filter((i) => i.isRegularItem())
    .map((item) => ({
      item,
      title: (item.getField("title") as string) || "(untitled)",
      author: item.firstCreator || "",
      year: String(item.getField("year") || ""),
      values: getAllValues(item),
    }));
}

/** Called from matrix.xhtml once the window has loaded. */
export async function onMatrixLoad(mwin: Window): Promise<void> {
  const scope = (mwin as any).arguments?.[0] as Scope;
  const doc = mwin.document;
  doc.title = `LitMatrix — ${scope.name}`;
  const state: State = {
    scope,
    rows: [],
    sortKey: "title",
    sortDir: 1,
    filter: "",
  };
  (mwin as any).__lmState = state;
  const status = doc.getElementById("lm-status")!;
  status.textContent = "Loading…";
  state.rows = await loadRows(scope);
  wireToolbar(mwin, state);
  render(mwin, state);

  // Re-render when the schema changes while the window is open.
  const off = addon.hooks.onSchemaChanged(() => {
    if (!isWindowAlive(mwin)) {
      off();
      return;
    }
    render(mwin, state);
  });
  mwin.addEventListener("unload", off);
}

function wireToolbar(mwin: Window, state: State) {
  const doc = mwin.document;
  (doc.getElementById("lm-scope") as HTMLElement).textContent = state.scope.name;
  const filter = doc.getElementById("lm-filter") as HTMLInputElement;
  filter.addEventListener("input", () => {
    state.filter = filter.value.trim().toLowerCase();
    renderBody(mwin, state);
  });
  doc.getElementById("lm-fields")!.addEventListener("click", () =>
    addon.hooks.onOpenFieldsDialog(),
  );
  doc.getElementById("lm-export")!.addEventListener("click", () =>
    void exportCSV(mwin, state),
  );
  doc.getElementById("lm-reload")!.addEventListener("click", async () => {
    state.rows = await loadRows(state.scope);
    render(mwin, state);
  });
}

function visibleRows(state: State): Row[] {
  const fields = loadSchema();
  let rows = state.rows;
  if (state.filter) {
    const f = state.filter;
    rows = rows.filter((r) => {
      if (r.title.toLowerCase().includes(f)) return true;
      if (r.author.toLowerCase().includes(f)) return true;
      if (r.year.includes(f)) return true;
      return fields.some((fd) => (r.values[fd.key] || "").toLowerCase().includes(f));
    });
  }
  const key = state.sortKey;
  const field = fields.find((fd) => fd.key === key);
  const dir = state.sortDir;
  rows = rows.slice().sort((a, b) => {
    if (field) return compareValues(field, a.values[key] || "", b.values[key] || "") * dir;
    if (key === "year") return ((parseInt(a.year) || 0) - (parseInt(b.year) || 0)) * dir;
    const av = (a as any)[key] as string;
    const bv = (b as any)[key] as string;
    return av.localeCompare(bv, undefined, { sensitivity: "base", numeric: true }) * dir;
  });
  return rows;
}

function render(mwin: Window, state: State) {
  const doc = mwin.document;
  const fields = loadSchema();
  const thead = doc.getElementById("lm-thead")!;
  thead.replaceChildren();
  const tr = h(doc, "tr");
  tr.appendChild(h(doc, "th", { className: "lm-c-idx", textContent: "#" }));
  const header = (key: string, label: string, cls?: string, user?: boolean) => {
    const th = h(doc, "th", {
      className: [cls || "", user ? "lm-user" : "", state.sortKey === key ? "lm-sorted" : ""]
        .filter(Boolean)
        .join(" "),
      textContent: label + (state.sortKey === key ? (state.sortDir === 1 ? " ▾" : " ▴") : ""),
      title: "Click to sort",
    });
    th.addEventListener("click", () => {
      if (state.sortKey === key) state.sortDir = state.sortDir === 1 ? -1 : 1;
      else {
        state.sortKey = key;
        state.sortDir = 1;
      }
      render(mwin, state);
    });
    return th;
  };
  for (const f of FIXED) tr.appendChild(header(f.key, f.label, f.cls));
  for (const f of fields) tr.appendChild(header(f.key, f.label, `lm-t-${f.type}`, true));
  thead.appendChild(tr);
  renderBody(mwin, state);
}

function renderBody(mwin: Window, state: State) {
  const doc = mwin.document;
  const fields = loadSchema();
  const tbody = doc.getElementById("lm-tbody")!;
  tbody.replaceChildren();
  const rows = visibleRows(state);
  const frag = doc.createDocumentFragment();
  rows.forEach((row, i) => {
    const tr = h(doc, "tr");
    tr.appendChild(h(doc, "td", { className: "lm-c-idx lm-num", textContent: String(i + 1) }));
    const titleCell = h(doc, "td", { className: "lm-c-title", textContent: row.title, title: row.title });
    titleCell.addEventListener("dblclick", () => {
      const main = Zotero.getMainWindow();
      main.ZoteroPane.selectItem(row.item.id);
      main.focus();
    });
    tr.appendChild(titleCell);
    tr.appendChild(h(doc, "td", { textContent: row.author }));
    tr.appendChild(h(doc, "td", { className: "lm-num", textContent: row.year }));
    for (const field of fields) {
      const td = h(doc, "td", { className: `lm-cell lm-t-${field.type}` });
      td.appendChild(
        createControl(
          doc,
          field,
          row.values[field.key] || "",
          async (v) => {
            row.values[field.key] = v;
            setValue(row.item, field.key, v);
            await row.item.saveTx();
            if (field.type === "rating" || field.type === "checkbox") renderBody(mwin, state);
            setStatus(mwin, "Saved to Zotero");
          },
          { compact: true },
        ),
      );
      tr.appendChild(td);
    }
    frag.appendChild(tr);
  });
  tbody.appendChild(frag);
  setStatus(
    mwin,
    `${rows.length} of ${state.rows.length} items · ${fields.length} fields · values live in the Extra field`,
  );
}

function setStatus(mwin: Window, text: string) {
  const el = mwin.document.getElementById("lm-status");
  if (el) el.textContent = text;
}

function csvEscape(v: string): string {
  if (/[",\n\r]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

async function exportCSV(mwin: Window, state: State) {
  const fields = loadSchema();
  const rows = visibleRows(state);
  const head = [...FIXED.map((f) => f.label), ...fields.map((f) => f.label), "Item key"];
  const lines = [head.map(csvEscape).join(",")];
  for (const r of rows) {
    const cells = [
      r.title,
      r.author,
      r.year,
      ...fields.map((f) => r.values[f.key] || ""),
      r.item.key,
    ];
    lines.push(cells.map(csvEscape).join(","));
  }
  const csv = "﻿" + lines.join("\r\n");
  const safeName = state.scope.name.replace(/[^\w\- ]+/g, "").trim() || "matrix";
  const picker = new ztoolkit.FilePicker(
    "Export matrix as CSV",
    "save",
    [["CSV file", "*.csv"]],
    `${safeName}.csv`,
    mwin,
  );
  const path = await picker.open();
  if (!path) return;
  await Zotero.File.putContentsAsync(path, csv);
  setStatus(mwin, `Exported ${rows.length} rows to ${path}`);
}

export type { Field };
