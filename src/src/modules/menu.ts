/**
 * Menu entries: Tools menu + collection context menu.
 */
import { getString } from "../utils/locale";

export function registerMenus(): void {
  const icon = `chrome://${addon.data.config.addonRef}/content/icons/favicon@0.5x.png`;
  ztoolkit.Menu.register("menuTools", { tag: "menuseparator" });
  ztoolkit.Menu.register("menuTools", {
    tag: "menuitem",
    id: "litmatrix-tools-open",
    label: getString("menu-open-matrix"),
    icon,
    commandListener: () => addon.hooks.onOpenMatrix(),
  });
  ztoolkit.Menu.register("menuTools", {
    tag: "menuitem",
    id: "litmatrix-tools-fields",
    label: getString("menu-manage-fields"),
    commandListener: () => addon.hooks.onOpenFieldsDialog(),
  });
  ztoolkit.Menu.register("collection", {
    tag: "menuitem",
    id: "litmatrix-collection-open",
    label: getString("collection-open-matrix"),
    icon,
    commandListener: () => addon.hooks.onOpenMatrix(),
  });
}
