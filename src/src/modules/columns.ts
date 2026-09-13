/**
 * One sortable item-tree column per field.
 */
import { config } from "../../package.json";
import { columnKey, displayValue, loadSchema } from "./schema";
import { getValue } from "./store";

let registeredKeys: string[] = [];

export async function registerFieldColumns(): Promise<void> {
  const fields = loadSchema();
  for (const field of fields) {
    const dataKey = columnKey(field);
    if (registeredKeys.includes(dataKey)) continue;
    try {
      const mgr = Zotero.ItemTreeManager as any;
      await (mgr.registerColumn || mgr.registerColumns).call(mgr, {
        pluginID: config.addonID,
        dataKey,
        label: field.label,
        dataProvider: (item: Zotero.Item) =>
          item.isRegularItem()
            ? displayValue(field, getValue(item, field.key))
            : "",
        zoteroPersist: ["width", "hidden", "sortDirection"],
      });
      registeredKeys.push(dataKey);
    } catch (e) {
      ztoolkit.log(`LitMatrix: could not register column ${dataKey}`, e);
    }
  }
}

export function unregisterFieldColumns(): void {
  for (const dataKey of registeredKeys) {
    try {
      const mgr = Zotero.ItemTreeManager as any;
      (mgr.unregisterColumn || mgr.unregisterColumns).call(mgr, dataKey);
    } catch (e) {
      ztoolkit.log(`LitMatrix: could not unregister column ${dataKey}`, e);
    }
  }
  registeredKeys = [];
}

export async function refreshFieldColumns(): Promise<void> {
  unregisterFieldColumns();
  await registerFieldColumns();
}
