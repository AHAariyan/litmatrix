/**
 * Field schema: which custom fields exist, their type and options.
 * Stored as JSON in a Zotero pref (per profile). A later version mirrors it to
 * a hidden note so it syncs across devices.
 */
import { config } from "../../package.json";

export type FieldType =
  | "text"
  | "number"
  | "select"
  | "rating"
  | "checkbox"
  | "date"
  | "url";

export interface Field {
  key: string; // [a-z0-9_]+
  label: string;
  type: FieldType;
  options?: string[]; // for select
}

export const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "select", label: "Select (options)" },
  { value: "rating", label: "Rating 1–5" },
  { value: "checkbox", label: "Checkbox" },
  { value: "date", label: "Date" },
  { value: "url", label: "URL" },
];

export const DEFAULT_FIELDS: Field[] = [
  {
    key: "method",
    label: "Method",
    type: "select",
    options: [
      "RCT",
      "Cohort",
      "Case-control",
      "Cross-sectional",
      "Qualitative",
      "Experiment",
      "Quasi-experimental",
      "Systematic review",
      "Meta-analysis",
      "Simulation",
      "Other",
    ],
  },
  { key: "sample_n", label: "Sample (n)", type: "number" },
  { key: "key_finding", label: "Key finding", type: "text" },
  { key: "relevance", label: "Relevance", type: "rating" },
  {
    key: "verdict",
    label: "Verdict",
    type: "select",
    options: ["Include", "Maybe", "Exclude"],
  },
  { key: "note", label: "Note to self", type: "text" },
];

const PREF = `${config.prefsPrefix}.schema`;

let cache: Field[] | null = null;
const listeners = new Set<() => void>();

export function onSchemaChange(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function loadSchema(): Field[] {
  if (cache) return cache;
  const raw = Zotero.Prefs.get(PREF, true) as string | undefined;
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Field[];
      if (Array.isArray(parsed)) {
        cache = parsed.filter((f) => f && f.key && f.label && f.type);
        return cache;
      }
    } catch (e) {
      ztoolkit.log("LitMatrix: schema pref unreadable, using defaults", e);
    }
  }
  cache = DEFAULT_FIELDS.map((f) => ({ ...f, options: f.options?.slice() }));
  Zotero.Prefs.set(PREF, JSON.stringify(cache), true);
  return cache;
}

export function saveSchema(fields: Field[]): void {
  cache = fields;
  Zotero.Prefs.set(PREF, JSON.stringify(fields), true);
  for (const fn of listeners) {
    try {
      fn();
    } catch (e) {
      ztoolkit.log("LitMatrix: schema listener failed", e);
    }
  }
}

export function getField(key: string): Field | undefined {
  return loadSchema().find((f) => f.key === key);
}

export function keyFromLabel(label: string): string {
  const base =
    label
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 40) || "field";
  const existing = new Set(loadSchema().map((f) => f.key));
  let key = base;
  let i = 2;
  while (existing.has(key)) key = `${base}_${i++}`;
  return key;
}

export function addField(field: Omit<Field, "key"> & { key?: string }): Field {
  const f: Field = {
    key: field.key || keyFromLabel(field.label),
    label: field.label.trim(),
    type: field.type,
    options:
      field.type === "select"
        ? (field.options || []).map((o) => o.trim()).filter(Boolean)
        : undefined,
  };
  saveSchema([...loadSchema(), f]);
  return f;
}

export function removeField(key: string): void {
  saveSchema(loadSchema().filter((f) => f.key !== key));
}

export function updateField(key: string, patch: Partial<Field>): void {
  saveSchema(
    loadSchema().map((f) => (f.key === key ? { ...f, ...patch, key } : f)),
  );
}

/** Column data key used in the item tree for a field. */
export function columnKey(field: Field): string {
  return `${config.addonRef}_${field.key}`;
}

/** Human display for a raw value, used in the item tree. */
export function displayValue(field: Field, raw: string): string {
  if (!raw) return "";
  switch (field.type) {
    case "rating": {
      const n = Math.max(0, Math.min(5, parseInt(raw, 10) || 0));
      return "★".repeat(n) + "☆".repeat(5 - n);
    }
    case "checkbox":
      return raw === "true" || raw === "1" || raw === "yes" ? "✓" : "";
    default:
      return raw.replace(/\n/g, " ");
  }
}
