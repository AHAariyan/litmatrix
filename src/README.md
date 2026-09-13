# LitMatrix for Zotero

Custom typed fields and an editable literature-review matrix, inside Zotero.

- Define your own fields: text, number, select, rating 1–5, checkbox, date, URL.
- Edit them in the item pane ("LitMatrix fields" section) or see them as sortable columns in the item list.
- Open any collection, saved search or library as a matrix (one row per paper, one column per field) and edit in place.
- Export the matrix as CSV.
- Values are stored as `lm.<key>: value` lines in each item's **Extra** field, so they sync with your Zotero account, never touch the database, and stay plain text if you uninstall. Other Extra lines (e.g. Better BibTeX citation keys) are preserved.

Status: **beta**. Zotero 7 – 10.

## Install (beta)

1. Download the latest `.xpi` from https://ahaariyan.github.io/litmatrix/ (or the GitHub Releases page).
2. In Zotero: **Tools → Plugins → ⚙ (gear) → Install Plugin From File…** → choose the `.xpi`.
3. Restart Zotero if asked.

## Use

- **Tools → LitMatrix: Open Matrix** (or right-click a collection → **Open in LitMatrix**).
- **Tools → LitMatrix: Manage Fields…** to add/remove fields.
- Select an item → the **LitMatrix fields** section in the right pane.
- Right-click the column header in the item list to show/hide LitMatrix columns.

## Feedback

Please open an issue at https://github.com/AHAariyan/litmatrix/issues or reply on the Zotero forum thread.

## Develop

```sh
cd src
npm install
cp .env.example .env   # set ZOTERO_PLUGIN_ZOTERO_BIN_PATH and a dev profile
npm start              # launches Zotero with hot reload
npm run build          # .scaffold/build/*.xpi
```

Built with [zotero-plugin-template](https://github.com/windingwind/zotero-plugin-template) and [zotero-plugin-toolkit](https://github.com/windingwind/zotero-plugin-toolkit).
