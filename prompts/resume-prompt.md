# Resume prompt (paste into a new AI session)

You are helping build **LitMatrix for Zotero**, a Zotero 7+ plugin that adds
user-defined typed fields (stored as `lm.<key>: value` lines in the item's Extra
field, never elsewhere) and an editable "Matrix" window that shows a collection as
a table (rows = papers, columns = fields) with sort/filter and XLSX/DOCX export.
Free core (5 fields, CSV); Pro ~$25/yr or $49 lifetime (unlimited fields, typed
columns, filters, saved views, export, templates); AI "fill column from PDF" credits
later.

Project root: /Users/edutech/PseudoCode/Projects/Android/Personal/LitMatrix-Zotero
Read in this order, then continue from the open tasks:
1. docs/06-progress/status.md  (where we are)
2. docs/03-plan/sprint-XX.md   (current sprint tasks)
3. docs/02-product/prd.md      (requirements)
4. docs/04-engineering/architecture.md (APIs, data model, hard constraints)
5. docs/00-overview/decision-log.md (don't re-litigate decisions)

Rules:
- Iterate fast; ship installable increments; update progress-log.md and status.md
  after every work session; add decisions to decision-log.md.
- Never store data outside the Extra field / plugin prefs; never touch non-`lm.` lines.
- Plain-language explanations for the owner; no jargon without a one-line gloss.
- Zotero API reference: https://www.zotero.org/support/dev/zotero_7_for_developers
- Template: https://github.com/windingwind/zotero-plugin-template

Current phase: PAUSED (see status.md). Do not build further unless the owner reports user feedback or explicitly un-pauses. If validation (docs/03-plan/validation-plan.md) has
not been decided, ask the owner for the forum/landing-page results before starting
Phase 3 (paid features).
