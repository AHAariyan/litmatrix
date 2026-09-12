# Architecture

## Runtime
Zotero 7+ bootstrapped plugin (manifest.json + bootstrap.js), TypeScript, built with
`zotero-plugin-scaffold` from windingwind/zotero-plugin-template. Runs inside
Zotero's Firefox-based runtime; UI via XUL/HTML in Zotero windows.

## Key Zotero APIs
- `Zotero.ItemTreeManager.registerColumn({dataKey, label, pluginID, dataProvider})`
  — one column per user field; `unregisterColumn` on shutdown.
- `Zotero.ItemPaneManager.registerSection({paneID, pluginID, header, sidenav, onRender})`
  — "LitMatrix fields" section with editable rows.
- `Zotero.ItemPaneManager.registerInfoRow({onGetData, onSetData})` — alternative
  for single rows inside Info.
- `Zotero.Items`, `item.getField('extra')`, `item.setField('extra', ...)`,
  `item.saveTx()` — value storage.
- `Zotero.Notifier.registerObserver` — refresh grid on item changes.
- `Zotero.Prefs` — schema + UI state.

## Data model
Values: lines in Extra, namespace `lm.`:
```
lm.method: survey
lm.sample_n: 300
lm.relevance: 4
lm.verdict: include
```
Rules: keys `[a-z0-9_]+`; one line per key; preserve all non-`lm.` lines verbatim;
multi-line text encoded with `\n` escape; dates ISO-8601.

Schema (field definitions): JSON in `extensions.litmatrix.schema` pref, mirrored to
a hidden standalone note tagged `#litmatrix-schema` in the user library so it syncs.
On startup: merge pref + note; if missing, infer fields from `lm.` keys seen.

## Matrix window
Separate Zotero window (HTML) with a virtualized grid (hand-rolled or a tiny lib,
no heavy framework). Data source: items of selected collection/search via
`Zotero.Items.getAll`/collection.getChildItems; edits call the store and save.
Sort/filter in memory; 2k rows target.

## Export
CSV native; XLSX via SheetJS (bundled); DOCX via docx.js (bundled, Pro only).

## Licensing
Ed25519-signed license payload {email, plan, exp}; public key in plugin; offline
verify; trial start timestamp in prefs (and mirrored to schema note to limit resets).

## Compatibility
Test on Zotero 7.0.x, 8.x, 9.x, 10.x. Watch for API changes each major release
(Better BibTeX had to drop Zotero 7 when 8 added native citation key).

## Constraints (do not violate)
- Never create DB tables or write files outside Zotero's data dir.
- Never modify non-`lm.` Extra lines.
- No network calls in free core except update.json check (Zotero does this).
