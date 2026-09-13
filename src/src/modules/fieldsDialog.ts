/**
 * "Manage fields" dialog: list, add, remove fields.
 */
import { getString } from "../utils/locale";
import { isWindowAlive } from "../utils/window";
import { h } from "./controls";
import {
  addField,
  FIELD_TYPES,
  FieldType,
  loadSchema,
  removeField,
  updateField,
} from "./schema";

const CSS = `
body { font: 13px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 0; padding: 14px; color: #1d1d1f; }
h2 { font-size: 15px; margin: 0 0 10px; }
table { border-collapse: collapse; width: 100%; }
th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #ddd; vertical-align: top; }
th { font-weight: 600; color: #555; font-size: 12px; }
input, select { font: inherit; padding: 3px 6px; box-sizing: border-box; }
input[type=text] { width: 100%; }
button { font: inherit; padding: 4px 10px; }
.add { margin-top: 14px; padding: 10px; background: #f3f4f6; border-radius: 6px; display: grid; grid-template-columns: 1fr 160px 1fr auto; gap: 8px; align-items: end; }
.add label { display: grid; gap: 3px; font-size: 12px; color: #555; }
.hint { color: #777; font-size: 12px; margin-top: 10px; }
.danger { color: #b3362d; background: none; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; }
`;

export function openFieldsDialog(): void {
  if (isWindowAlive(addon.data.fieldsDialog?.window)) {
    addon.data.fieldsDialog!.window.focus();
    return;
  }
  const dialog = new ztoolkit.Dialog(1, 1)
    .addCell(0, 0, {
      tag: "div",
      namespace: "html",
      id: "lm-fields-root",
      styles: { minWidth: "640px" },
    })
    .addButton("Done", "done")
    .open(getString("fields-dialog-title"), {
      resizable: true,
      centerscreen: true,
      width: 700,
      height: 520,
    });
  addon.data.fieldsDialog = dialog;
  const win = dialog.window;
  const draw = () => {
    if (!isWindowAlive(win)) return;
    renderFields(win.document);
  };
  win.addEventListener("load", draw);
  // Dialog helper may already be loaded when we get here.
  if (win.document?.readyState === "complete") draw();
}

function renderFields(doc: Document) {
  let style = doc.getElementById("lm-style");
  if (!style) {
    style = h(doc, "style", { id: "lm-style", textContent: CSS });
    doc.head?.appendChild(style);
  }
  const root = doc.getElementById("lm-fields-root");
  if (!root) return;
  root.replaceChildren();

  root.appendChild(h(doc, "h2", { textContent: "Your fields" }));

  const table = h(doc, "table");
  const thead = h(doc, "thead");
  const hr = h(doc, "tr");
  for (const t of ["Label", "Type", "Options (select)", ""])
    hr.appendChild(h(doc, "th", { textContent: t }));
  thead.appendChild(hr);
  table.appendChild(thead);
  const tbody = h(doc, "tbody");
  for (const f of loadSchema()) {
    const tr = h(doc, "tr");
    const label = h(doc, "input", { attrs: { type: "text" } });
    label.value = f.label;
    label.addEventListener("change", () => {
      if (label.value.trim()) updateField(f.key, { label: label.value.trim() });
    });
    tr.appendChild(h(doc, "td", {}, [label]));
    tr.appendChild(
      h(doc, "td", {
        textContent: FIELD_TYPES.find((t) => t.value === f.type)?.label || f.type,
      }),
    );
    const optCell = h(doc, "td");
    if (f.type === "select") {
      const opts = h(doc, "input", {
        attrs: { type: "text" },
        placeholder: "Comma-separated",
      });
      opts.value = (f.options || []).join(", ");
      opts.addEventListener("change", () =>
        updateField(f.key, {
          options: opts.value.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      );
      optCell.appendChild(opts);
    } else {
      optCell.appendChild(h(doc, "span", { textContent: "—" }));
    }
    tr.appendChild(optCell);
    const del = h(doc, "button", { textContent: "Remove", className: "danger" });
    del.addEventListener("click", () => {
      const ok = doc.defaultView?.confirm(
        `Remove the field "${f.label}"?\n\nValues already stored on items are kept in the Extra field (lm.${f.key}) and will reappear if you add a field with the same key later.`,
      );
      if (ok) {
        removeField(f.key);
        renderFields(doc);
      }
    });
    tr.appendChild(h(doc, "td", {}, [del]));
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  root.appendChild(table);

  // Add form
  const add = h(doc, "div", { className: "add" });
  const labelIn = h(doc, "input", { attrs: { type: "text" }, placeholder: "e.g. Risk of bias" });
  const typeSel = h(doc, "select");
  for (const t of FIELD_TYPES)
    typeSel.appendChild(h(doc, "option", { textContent: t.label, attrs: { value: t.value } }));
  const optsIn = h(doc, "input", { attrs: { type: "text" }, placeholder: "Low, Some concerns, High" });
  const addBtn = h(doc, "button", { textContent: "Add field" });
  addBtn.addEventListener("click", () => {
    const label = labelIn.value.trim();
    if (!label) {
      labelIn.focus();
      return;
    }
    addField({
      label,
      type: typeSel.value as FieldType,
      options: optsIn.value.split(",").map((s) => s.trim()).filter(Boolean),
    });
    labelIn.value = "";
    optsIn.value = "";
    renderFields(doc);
  });
  add.append(
    h(doc, "label", { textContent: "Label" }, [labelIn]),
    h(doc, "label", { textContent: "Type" }, [typeSel]),
    h(doc, "label", { textContent: "Options (for Select)" }, [optsIn]),
    addBtn,
  );
  root.appendChild(add);
  root.appendChild(
    h(doc, "div", {
      className: "hint",
      textContent:
        "Values are stored in each item's Extra field as lm.<key>: value. They sync with your Zotero account and remain plain text if you uninstall LitMatrix.",
    }),
  );
}
