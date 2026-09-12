# Dev setup

1. Install Zotero 7+ (and a second profile for Zotero 10 beta if available).
2. `git clone https://github.com/windingwind/zotero-plugin-template src` then rename.
3. `npm install`; copy `.env.example` → `.env` with Zotero binary and profile paths.
4. `npm start` — launches Zotero with the plugin hot-reloading.
5. `npm run build` — produces `.xpi` in `build/`.
6. Release: tag → GitHub Release with `.xpi` + `update.json` for auto-update.

Test library: create a collection "LitMatrix Test" with 30 items incl. some with
Better BibTeX `Citation Key:` lines in Extra to verify namespace safety.
