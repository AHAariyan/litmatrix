/**
 * Shared editable controls for a field value. Used by the item-pane section
 * and by the matrix window so both look and behave the same.
 */
import type { Field } from "./schema";

export const HTML_NS = "http://www.w3.org/1999/xhtml";

export function h<K extends keyof HTMLElementTagNameMap>(
  doc: Document,
  tag: K,
  props: Partial<
    Record<"className" | "textContent" | "title" | "id" | "placeholder", string>
  > & { style?: Partial<CSSStyleDeclaration>; attrs?: Record<string, string> } =
    {},
  children: (Node | string)[] = [],
): HTMLElementTagNameMap[K] {
  const el = doc.createElementNS(HTML_NS, tag) as HTMLElementTagNameMap[K];
  if (props.className) el.className = props.className;
  if (props.textContent != null) el.textContent = props.textContent;
  if (props.title) el.title = props.title;
  if (props.id) el.id = props.id;
  if (props.placeholder && "placeholder" in el)
    (el as unknown as HTMLInputElement).placeholder = props.placeholder;
  if (props.style) Object.assign(el.style, props.style);
  if (props.attrs)
    for (const [k, v] of Object.entries(props.attrs)) el.setAttribute(k, v);
  for (const c of children)
    el.appendChild(typeof c === "string" ? doc.createTextNode(c) : c);
  return el;
}

export type OnChange = (value: string) => void | Promise<void>;

/**
 * Build a control for `field` showing `value`; calls `onChange` with the new
 * raw string whenever the user commits an edit.
 */
export function createControl(
  doc: Document,
  field: Field,
  value: string,
  onChange: OnChange,
  opts: { compact?: boolean; editable?: boolean } = {},
): HTMLElement {
  const editable = opts.editable !== false;
  switch (field.type) {
    case "select": {
      const sel = h(doc, "select", { className: "lm-control lm-select" });
      sel.appendChild(h(doc, "option", { textContent: "—", attrs: { value: "" } }));
      const options = field.options?.slice() || [];
      if (value && !options.includes(value)) options.push(value);
      for (const o of options) {
        const opt = h(doc, "option", { textContent: o, attrs: { value: o } });
        if (o === value) opt.setAttribute("selected", "selected");
        sel.appendChild(opt);
      }
      sel.value = value;
      sel.disabled = !editable;
      sel.addEventListener("change", () => void onChange(sel.value));
      return sel;
    }
    case "rating": {
      const wrap = h(doc, "span", { className: "lm-control lm-rating" });
      const n = parseInt(value, 10) || 0;
      for (let i = 1; i <= 5; i++) {
        const star = h(doc, "span", {
          className: "lm-star" + (i <= n ? " on" : ""),
          textContent: i <= n ? "★" : "☆",
          title: `${i}`,
        });
        if (editable)
          star.addEventListener("click", () => {
            // Clicking the current value clears it.
            void onChange(i === n ? "" : String(i));
          });
        wrap.appendChild(star);
      }
      return wrap;
    }
    case "checkbox": {
      const cb = h(doc, "input", {
        className: "lm-control lm-checkbox",
        attrs: { type: "checkbox" },
      });
      cb.checked = value === "true";
      cb.disabled = !editable;
      cb.addEventListener("change", () => void onChange(cb.checked ? "true" : ""));
      return cb;
    }
    case "number":
    case "date":
    case "url": {
      const input = h(doc, "input", {
        className: `lm-control lm-input lm-${field.type}`,
        attrs: {
          type: field.type === "number" ? "text" : field.type,
          inputmode: field.type === "number" ? "decimal" : "text",
        },
      });
      input.value = value;
      input.readOnly = !editable;
      const commit = () => {
        if (input.value !== value) {
          value = input.value;
          void onChange(input.value);
        }
      };
      input.addEventListener("change", commit);
      input.addEventListener("blur", commit);
      input.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          e.preventDefault();
          input.blur();
        }
      });
      return input;
    }
    case "text":
    default: {
      const ta = h(doc, "textarea", {
        className: "lm-control lm-textarea" + (opts.compact ? " compact" : ""),
        attrs: { rows: opts.compact ? "1" : "2" },
      });
      ta.value = value;
      ta.readOnly = !editable;
      const commit = () => {
        if (ta.value !== value) {
          value = ta.value;
          void onChange(ta.value);
        }
      };
      ta.addEventListener("change", commit);
      ta.addEventListener("blur", commit);
      ta.addEventListener("keydown", (e: KeyboardEvent) => {
        // Enter commits; Shift+Enter inserts a newline.
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          ta.blur();
        }
      });
      return ta;
    }
  }
}

/** Sort comparator for raw values of a field. */
export function compareValues(field: Field, a: string, b: string): number {
  if (field.type === "number" || field.type === "rating") {
    const na = parseFloat(a.replace(/,/g, ""));
    const nb = parseFloat(b.replace(/,/g, ""));
    const aNaN = Number.isNaN(na);
    const bNaN = Number.isNaN(nb);
    if (aNaN && bNaN) return 0;
    if (aNaN) return 1;
    if (bNaN) return -1;
    return na - nb;
  }
  if (field.type === "checkbox") return (b === "true" ? 1 : 0) - (a === "true" ? 1 : 0);
  return a.localeCompare(b, undefined, { sensitivity: "base", numeric: true });
}
