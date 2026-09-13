# Sprint 01 — Sep 12 → Sep 19, 2026

Goal: validation assets live + installable skeleton.

## Tasks
- [x] Mockup HTML (assets/mockups/matrix-mockup.html) — published: https://claude.ai/code/artifact/08dcce38-56df-4b10-ac60-151c11822682
- [x] Screenshots rendered: assets/mockups/mockup-1-matrix.png, mockup-2-fields.png (also copied to site/)
- [x] GitHub Pages site folder prepared: site/ (index.html + mockup.html + PNGs)
- [ ] User: create public GitHub repo "litmatrix", upload site/ contents, enable Pages
- [ ] Landing page HTML (assets/landing-page/index.html)
- [ ] Forum copy + Ze-Notes DM copy (docs/05-marketing/)
- [ ] User: accounts (forum, GitHub org, payments, email list)
- [x] User: post + DM (D1) — done 2026-09-12, forum posts awaiting moderation
- [x] Plugin skeleton from windingwind/zotero-plugin-template (src/)
- [x] Extra-field store: parse/write `lm.<key>: value` lines, namespace-safe
- [x] Field schema in prefs (hidden-note mirror deferred to v1.1)
- [x] registerColumn for each field; registerSection with editable rows
- [x] Matrix window: grid, inline edit, sort, filter (basic)
- [x] Smoke + functional test on Zotero 10.0.2 (automated via tools/zeval.mjs): store, columns, item-pane section, matrix (collection scope, edit, sort, filter), fields dialog add/rename/remove — all pass, no console errors
- [ ] Visual check by owner (screenshots of item pane + matrix window)
- [ ] Test on Zotero 7.x (older API names) — later, via a second Zotero install
- [ ] progress-log entries daily

## Definition of done
Screenshots posted; landing page live; a .xpi that installs on Zotero 10 and lets
you add a field, edit it in the item pane, and see it in a matrix grid.
