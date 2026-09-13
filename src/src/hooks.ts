import { getString, initLocale } from "./utils/locale";
import { createZToolkit } from "./utils/ztoolkit";
import { loadSchema, onSchemaChange } from "./modules/schema";
import { refreshFieldColumns, registerFieldColumns, unregisterFieldColumns } from "./modules/columns";
import { registerItemPaneSection, unregisterItemPaneSection } from "./modules/itemPane";
import { registerMenus } from "./modules/menu";
import { onMatrixLoad as matrixLoad, openMatrix } from "./modules/matrix";
import { openFieldsDialog } from "./modules/fieldsDialog";

const schemaListeners = new Set<() => void>();
let offSchema: (() => void) | null = null;

async function onStartup() {
  await Promise.all([
    Zotero.initializationPromise,
    Zotero.unlockPromise,
    Zotero.uiReadyPromise,
  ]);
  initLocale();
  loadSchema();
  await registerFieldColumns();
  registerItemPaneSection();

  // When fields change: rebuild item-tree columns, then tell open windows.
  offSchema = onSchemaChange(() => {
    void refreshFieldColumns().then(() => {
      for (const fn of schemaListeners) fn();
      // Item pane re-renders when the selected item is re-set.
      try {
        const win = Zotero.getMainWindow();
        const pane = win.ZoteroPane;
        const items = pane.getSelectedItems();
        if (items.length === 1) (pane as any).itemPane?.render?.();
      } catch (e) {
        ztoolkit.log("LitMatrix: item pane refresh skipped", e);
      }
    });
  });

  await Promise.all(Zotero.getMainWindows().map((win) => onMainWindowLoad(win)));
  addon.data.initialized = true;
}

async function onMainWindowLoad(win: _ZoteroTypes.MainWindow): Promise<void> {
  addon.data.ztoolkit = createZToolkit();
  win.MozXULElement.insertFTLIfNeeded(`${addon.data.config.addonRef}-mainWindow.ftl`);
  registerMenus();
  if (__env__ === "development") {
    new ztoolkit.ProgressWindow(addon.data.config.addonName, { closeTime: 2500 })
      .createLine({ text: `${getString("menu-open-matrix")} is ready (dev build)`, type: "success" })
      .show();
  }
}

async function onMainWindowUnload(_win: Window): Promise<void> {
  ztoolkit.unregisterAll();
  addon.data.fieldsDialog?.window?.close();
  addon.data.matrixWindow?.close();
}

function onShutdown(): void {
  offSchema?.();
  unregisterFieldColumns();
  unregisterItemPaneSection();
  ztoolkit.unregisterAll();
  addon.data.fieldsDialog?.window?.close();
  addon.data.matrixWindow?.close();
  addon.data.alive = false;
  // @ts-expect-error - Plugin instance is not typed
  delete Zotero[addon.data.config.addonInstance];
}

function onOpenMatrix() {
  openMatrix();
}

function onOpenFieldsDialog() {
  openFieldsDialog();
}

function onMatrixLoad(win: Window) {
  void matrixLoad(win);
}

/** Subscribe to schema changes (returns an unsubscribe function). */
function onSchemaChanged(fn: () => void): () => void {
  schemaListeners.add(fn);
  return () => schemaListeners.delete(fn);
}

export default {
  onStartup,
  onShutdown,
  onMainWindowLoad,
  onMainWindowUnload,
  onOpenMatrix,
  onOpenFieldsDialog,
  onMatrixLoad,
  onSchemaChanged,
};
