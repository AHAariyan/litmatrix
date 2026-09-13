/**
 * "LitMatrix fields" section in the item pane.
 */
import { config } from "../../package.json";
import { getLocaleID, getString } from "../utils/locale";
import { createControl, h } from "./controls";
import { loadSchema } from "./schema";
import { getAllValues, setValue } from "./store";

const PANE_ID = "litmatrix-fields";
const CSS = `
.lm-section { font-size: inherit; }
.lm-grid { display: grid; grid-template-columns: max-content 1fr; gap: 6px 10px; align-items: center; padding: 4px 0; }
.lm-grid .lm-label { text-align: right; color: var(--fill-secondary, #666); white-space: nowrap; }
.lm-control { box-sizing: border-box; width: 100%; font: inherit; }
.lm-textarea { min-height: 2.6em; resize: vertical; }
.lm-input { min-height: 1.8em; }
.lm-select { min-height: 1.8em; }
.lm-rating { cursor: pointer; letter-spacing: 2px; user-select: none; }
.lm-star.on { color: #d99a12; }
.lm-checkbox { width: auto; }
.lm-links { display: flex; gap: 14px; padding: 8px 0 2px; }
.lm-links a { color: var(--accent-blue, #2f6fed); cursor: pointer; text-decoration: none; }
.lm-links a:hover { text-decoration: underline; }
.lm-muted { color: var(--fill-secondary, #666); padding: 6px 0; }
`;

export function registerItemPaneSection(): void {
  Zotero.ItemPaneManager.registerSection({
    paneID: PANE_ID,
    pluginID: config.addonID,
    header: {
      l10nID: getLocaleID("section-head"),
      icon: "chrome://zotero/skin/16/universal/note.svg",
    },
    sidenav: {
      l10nID: getLocaleID("section-sidenav"),
      icon: "chrome://zotero/skin/20/universal/note.svg",
    },
    onRender: ({ body, item, editable }) => {
      render(body as HTMLElement, item, editable);
    },
  });
}

export function unregisterItemPaneSection(): void {
  try {
    Zotero.ItemPaneManager.unregisterSection(PANE_ID);
  } catch (e) {
    ztoolkit.log("LitMatrix: unregisterSection failed", e);
  }
}

function ensureStyle(doc: Document) {
  if (doc.getElementById("litmatrix-style")) return;
  const style = h(doc, "style", { id: "litmatrix-style", textContent: CSS });
  (doc.head || doc.documentElement)?.appendChild(style);
}

function render(body: HTMLElement, item: Zotero.Item | undefined, editable: boolean) {
  const doc = body.ownerDocument as Document;
  ensureStyle(doc);
  body.replaceChildren();

  const root = h(doc, "div", { className: "lm-section" });
  body.appendChild(root);

  if (!item || !item.isRegularItem()) {
    root.appendChild(
      h(doc, "div", { className: "lm-muted", textContent: "Select a regular item." }),
    );
    return;
  }

  const fields = loadSchema();
  const values = getAllValues(item);
  const grid = h(doc, "div", { className: "lm-grid" });
  for (const field of fields) {
    grid.appendChild(h(doc, "div", { className: "lm-label", textContent: field.label }));
    const control = createControl(
      doc,
      field,
      values[field.key] ?? "",
      async (v) => {
        setValue(item, field.key, v);
        await item.saveTx();
        if (field.type === "rating") render(body, item, editable); // re-draw stars
      },
      { editable },
    );
    grid.appendChild(control);
  }
  root.appendChild(grid);

  const links = h(doc, "div", { className: "lm-links" });
  const manage = h(doc, "a", { textContent: getString("menu-manage-fields").replace(/^LitMatrix:\s*/, "") });
  manage.addEventListener("click", () => addon.hooks.onOpenFieldsDialog());
  const open = h(doc, "a", { textContent: "Open matrix" });
  open.addEventListener("click", () => addon.hooks.onOpenMatrix());
  links.append(manage, open);
  root.appendChild(links);
}
