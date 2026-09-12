# PRD — LitMatrix for Zotero

Version 0.1 · 2026-09-12 · Owner: edutech · Status: Draft (pre-validation)

## 1. Problem
Researchers cannot store their own structured per-paper data in Zotero (no custom
fields) and cannot view a collection as an editable comparison table. They export to
Excel/Notion/Obsidian and the copy goes stale. Requested since 2019; Zotero staff say
custom fields are years away.

## 2. Goals
- G1: Add user-defined, typed fields to any Zotero item, stored sync-safely.
- G2: Show a collection (or saved search) as an editable matrix inside Zotero.
- G3: Export the matrix to XLSX/CSV/DOCX for the thesis or paper.
- G4: Free core drives adoption; Pro converts at ~$25/yr.

Non-goals (v1): AI auto-fill (v2), group-library permissions UI, storage/sync service,
mobile apps, replacing notes/annotations.

## 3. Users and jobs
- PhD student, literature review chapter: "I need Method / Sample / Finding / Quality
  / Verdict per paper, sortable, so I can see the field's shape and write."
- Master's student, systematic review: "I need a PRISMA-style extraction sheet with
  include/exclude and reason, exported to Excel for my supervisor."
- Postdoc: "I want to tag papers by numeric effect size and filter > 0.3."

## 4. Functional requirements

### 4.1 Fields (free)
- F1 Create/rename/delete a field schema: name, type (text, long text, number,
  select [options], multi-select, checkbox, date, rating 1–5, URL).
- F2 Field values stored in the item's Extra field as lines `lm.<key>: <value>`
  (namespace `lm.`); parsing tolerant of other Extra content (Better BibTeX, etc.).
- F3 Values editable in the item pane (custom section with one row per field).
- F4 Each field can be shown as a column in the main item tree
  (`Zotero.ItemTreeManager.registerColumn`), sortable.
- F5 Free tier limit: 5 fields.

### 4.2 Matrix window (free basic, Pro advanced)
- M1 Open "Matrix" for the selected collection / saved search / library.
- M2 Grid: one row per regular item; fixed columns (Title, First author, Year,
  Item type) + user fields; inline editing writes back to Extra immediately.
- M3 Sort by any column; text filter; per-column filter (Pro).
- M4 Show/hide columns, reorder, column width persistence.
- M5 Saved views per collection (Pro).
- M6 Row click opens the item; double-click opens PDF.
- M7 Performance: 2,000 rows usable (virtualized grid).

### 4.3 Export (Pro; free = CSV with watermark row)
- E1 CSV, XLSX, DOCX table (for thesis appendix), Markdown.
- E2 Include/exclude columns; respect current sort/filter.

### 4.4 Templates (Pro)
- T1 One-click field sets: Literature review (Method, Sample, Findings, Limitations,
  Relevance 1–5, Verdict), Systematic review (Screening decision, Reason, Design,
  Population, Outcome, Risk of bias), Empty.

### 4.5 Licensing
- L1 License key (email-bound) validated offline with signed payload; 14-day trial
  of Pro on first install.
- L2 Payment via Lemon Squeezy or Gumroad; $25/yr or $49 lifetime (test both).

### 4.6 Sync and safety
- S1 Never write outside Extra field / plugin prefs. Never modify other Extra lines.
- S2 Schema (field definitions) stored in plugin prefs AND mirrored to a hidden
  note in the library root so it syncs across devices (fallback: re-derive from
  values found in Extra).
- S3 Undo for cell edits (leverage Zotero 10 undo where available).

## 5. Non-functional
- Zotero 7, 8, 9, 10 support (test matrix); macOS/Windows/Linux.
- Startup cost < 50 ms; no network calls in free core.
- Accessible grid (keyboard navigation, screen-reader labels).

## 6. Metrics
- Installs (GitHub release downloads), stars, forum thread replies.
- Activation: % of installs that create ≥1 field within 7 days.
- Conversion: Pro trial → paid; target 10% of trial starters, 2% of installs.
- Retention: weekly active matrix opens.

## 7. Risks
- Zotero/Better Notes ships native tables → fall back to AI extraction + templates
  as differentiator.
- Extra-field pollution conflicts with other plugins → strict namespace, tests.
- Free-software backlash on pricing → generous free tier, source available.

## 8. Open questions
- Lifetime vs annual: run both on landing page pre-order.
- Should the schema live in a group library for shared reviews? (v1.1)
- Name: LitMatrix vs ZotMatrix — check trademark/npm/GitHub availability.
