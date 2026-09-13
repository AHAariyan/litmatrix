# Progress log (newest first)

## 2026-09-12
- Chose the Zotero literature-matrix plugin over other candidates (see decision-log).
- Deep-dived scope: market size (EU 726k doctoral, US 3.2M postbacc), demand threads
  (2019–2026), competitors (Ze-Notes, Reading List, Elicit, SciSpace), APIs
  (registerColumn/registerSection), storage constraint (Extra field), pricing comps.
- Created project folder and docs structure.
- Next: mockup, landing page, forum copy, plugin skeleton.

## 2026-09-11
- Broad student pain-point research (7 candidates). Reddit unreachable; used HN,
  Trustpilot, App Store, The Student Room, Zotero forums, news.

## 2026-09-12 (later)
- Built interactive HTML mockup (Matrix window + main Zotero window with fields/columns/item-pane section).
  Local: assets/mockups/matrix-mockup.html · Published: https://claude.ai/code/artifact/08dcce38-56df-4b10-ac60-151c11822682
- Next: user screenshots → forum posts; AI builds landing page + plugin skeleton.

## 2026-09-12 (evening)
- Screenshots rendered with headless Chrome (light theme, 2x). Site folder for GitHub Pages ready in site/.
- gh CLI not installed; user will create repo + enable Pages via github.com.

## 2026-09-12 (validation posting)
- Forum account "ahady" created. New thread (POST 4) submitted; held for moderation ("Posts from new users are moderated"). Do NOT re-post. Check "Your Discussions" tomorrow and record the URL here.
- Remaining: replies in threads 79165, 101870, 131095; GitHub issue to Ze-Notes author.
- All 5 validation posts submitted (new thread + replies in 79165, 101870, 131095 — held for moderation; GitHub issue to Ze-Notes author — live). Waiting period: Sep 13–19. Daily: check "Your Discussions" + the GitHub issue; log every reply below.

### Replies log (one line each: name · what they want · would pay?)

## 2026-09-13 (build)
- Plugin free core written and building: src/ (store, schema, columns, item-pane section, matrix window, fields dialog, menus).
- Beta .xpi: src/.scaffold/build/lit-matrix-for-zotero.xpi, copied to site/litmatrix-0.1.0-beta.1.xpi (served by GitHub Pages).
- NOT yet run inside Zotero (not installed on this Mac). First manual test is the next task.
- Validation posts still in forum moderation; GitHub issue #34 to Ze-Notes open, no reply.
- Zotero 10.0.2 installed to /Applications by the AI; isolated dev profile at .dev/profile, data at .dev/data (gitignored). `npm start` launches Zotero with hot reload.
- Plan B shortlist written: docs/03-plan/plan-b-shortlist.md. Kill/pivot rule: <5 signals by 2026-09-24.

## 2026-09-13 (evening) — first working beta verified in Zotero 10.0.2
- Built tools/zeval.mjs: runs JavaScript inside the live dev Zotero over the remote-debugger port; gives us automated tests without a screen.
- Dev library seeded with 5 example papers through the local connector endpoint (port 23124).
- Verified: Extra-field store (foreign lines preserved, remove, multi-line), 6 columns registered and visible, item-pane section with 6 controls, matrix window (library + collection scope, 3/5 rows), in-matrix edits write to Extra, sort, filter, fields dialog add/rename/remove syncing columns and matrix headers. Console clean apart from toolkit deprecation warnings.
- Bugs fixed: Zotero 10 removed getSelectedCollection()/getSelectedSavedSearch()/getSelectedLibraryID() → plural APIs with fallback; column refresh must unregister using Zotero's returned internal key; matrix window obtains Zotero via ChromeUtils.importESModule.
- Rebuilt beta .xpi and republished to site/ (GitHub Pages).
