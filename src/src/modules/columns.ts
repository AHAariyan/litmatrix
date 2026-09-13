/**
 * One sortable item-tree column per field.
 *
 * Zotero prefixes custom dataKeys with the plugin id internally, and refuses a
 * duplicate registration, so we keep our own registry (dataKey → label) and
 * only register/unregister the difference when the schema changes.
 */
import { config } from "../../package.json";
import { columnKey, displayValue, loadSchema, Field } from "./schema";
import { getValue } from "./store";

const registered = new Map<string, { label: string; id: string }>(); // dataKey -> label + Zotero's internal key

function mgr(): any {
  return Zotero.ItemTreeManager as any;
}

async function register(field: Field): Promise<void> {
  const dataKey = columnKey(field);
  const m = mgr();
  const ret = await (m.registerColumn || m.registerColumns).call(m, {
    pluginID: config.addonID,
    dataKey,
    label: field.label,
    dataProvider: (item: Zotero.Item) =>
      item.isRegularItem() ? displayValue(field, getValue(item, field.key)) : "",
    zoteroPersist: ["width", "hidden", "sortDirection"],
  });
  const id: string = Array.isArray(ret) ? ret[0] : typeof ret === "string" ? ret : dataKey;
  registered.set(dataKey, { label: field.label, id });
}

async function unregister(dataKey: string): Promise<void> {
  const m = mgr();
  const id = registered.get(dataKey)?.id || dataKey;
  try {
    await (m.unregisterColumn || m.unregisterColumns).call(m, id);
  } catch (e) {
    ztoolkit.log(`LitMatrix: could not unregister column ${dataKey}`, e);
  }
  registered.delete(dataKey);
}

export async function registerFieldColumns(): Promise<void> {
  await refreshFieldColumns();
}

export async function unregisterFieldColumns(): Promise<void> {
  for (const dataKey of Array.from(registered.keys())) await unregister(dataKey);
}

/** Bring registered columns in line with the current schema. */
export async function refreshFieldColumns(): Promise<void> {
  const fields = loadSchema();
  const desired = new Map(fields.map((f) => [columnKey(f), f] as const));

  // Remove columns for deleted fields, or whose label changed (label is fixed at registration).
  for (const [dataKey, entry] of Array.from(registered.entries())) {
    const want = desired.get(dataKey);
    if (!want || want.label !== entry.label) await unregister(dataKey);
  }
  // Add missing ones.
  for (const [dataKey, field] of desired) {
    if (registered.has(dataKey)) continue;
    try {
      await register(field);
    } catch (e) {
      ztoolkit.log(`LitMatrix: could not register column ${dataKey}`, e);
    }
  }
}
