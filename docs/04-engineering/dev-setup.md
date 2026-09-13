# Dev setup

1. Install Zotero (current: 10.x) from https://www.zotero.org/download. Create a dev profile: run `/Applications/Zotero.app/Contents/MacOS/zotero -P`, create profile 'litmatrix-dev'.
2. Source already lives in `src/` (template cloned and renamed 2026-09-13).
3. `npm install`; copy `.env.example` → `.env` with Zotero binary and profile paths.
4. `npm start` — launches Zotero with the plugin hot-reloading.
5. `npm run build` — produces `.xpi` in `build/`.
6. Release: tag → GitHub Release with `.xpi` + `update.json` for auto-update.

Test library: create a collection "LitMatrix Test" with 30 items incl. some with
Better BibTeX `Citation Key:` lines in Extra to verify namespace safety.

## Automated testing inside Zotero (no screen needed)
With `npm start` running (Zotero launched with `-start-debugger-server`):
```sh
node tools/zeval.mjs 'return Zotero.version'
node tools/zeval.mjs 'return Zotero.getErrors(true).slice(-5)'   # error console
node tools/zeval.mjs -f test.js   # async code; locals: Zotero, win, ZoteroPane, document, LM (plugin), LM.api
```
Seed test items without the UI: POST JSON to `http://127.0.0.1:<httpServer.port>/connector/saveItems`
(port is in the dev profile's prefs.js, `extensions.zotero.httpServer.port`).
