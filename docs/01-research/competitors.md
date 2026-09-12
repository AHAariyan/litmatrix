# Competitors and gaps (2026-09-12)

## Inside Zotero (plugins)
| Plugin | Stars | Active | What it does | Why it doesn't solve the problem |
|---|---|---|---|---|
| Ze-Notes (frianasoa) | 106 | Yes (commits Jul 2026; Zotero 7–9) | Table per collection: rows = items, columns = tags on notes/annotations; export DOCX/XLSX/MD; AI + translate + OCR | Cannot type a value into a cell — every cell must be a note/annotation carrying a tag; no typed/numeric columns; per-collection only; settings don't sync |
| Zotero Reading List (Dominic-DallOsto) | 573 | Yes | One custom column "Read Status" stored in Extra field | Single fixed column; proves the storage pattern and demand |
| zotero-columns (treeski3) | 1 | No | "first attempt" at custom columns | Abandoned template |
| literature-review-with-LLM (kaguratart) | 9 | Yes (Zotero 9) | LLM summaries; exports a Markdown "literature matrix" report | Export file, not a live editable table |
| Better Notes (windingwind) | ~7k | Very | Notes, templates, graph, markdown | Promised Dataview-like table in Dec 2022; not shipped by v3.3.3 (Aug 2026) |
| Beaver / PapersGPT | n/a | Yes | Chat with PDFs (paid) | Not a matrix; potential partners for AI extraction |

## Zotero core
- Zotero 7 (Aug 2024): plugin APIs for custom columns/item-pane sections.
- Zotero 8 (Jan 2026): native citation-key field, annotations as items.
- Zotero 10 (Aug 2026): advanced search, batch editing (not for type/creators/tags), multi-collection select, reading mode.
- Still no custom fields, no table/matrix view. Staff: "long-term roadmap", "years".

## Outside Zotero
| Tool | Price | Gap |
|---|---|---|
| Elicit | $49/mo (20 columns) | Expensive; matrix lives outside your library; imports from Zotero one-way |
| SciSpace | $12–20/mo | Same; Zotero export paid-only |
| Covidence / Rayyan | $339/yr / free | Systematic-review pipelines; heavy; Covidence has no student discount |
| Obsidian + Zotero Integration + Dataview | Free | Second app, 3 plugins; Zotero Integration last release Aug 2024 |
| Notion + Notero | Free/$ | Manual columns; Notion is slow with 500+ rows; sync one-way |
| Excel/Google Sheets export | Free | Goes stale immediately; retyping |

## Our gap / positioning
"Custom fields and a live matrix, natively inside Zotero, sync-safe, exportable."
Nobody offers typed, free-text-editable per-paper fields in a table inside Zotero.
