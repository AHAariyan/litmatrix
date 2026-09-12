# Vision

## One sentence
Let a grad student compare 100–500 papers side by side inside Zotero, in a table
they design themselves, without exporting to Excel ever again.

## The problem (plain language)
PhD and master's students collect hundreds of papers in Zotero (free, open source,
the most common reference manager among students). When they write a literature
review they need a matrix: one row per paper, columns like Method, Sample size,
Main finding, Quality, My verdict. Zotero has no custom fields and no table view.
People export to Excel/Notion/Obsidian, retype everything, and the copy goes stale
the moment they add a paper. This has been requested on Zotero's forum since 2019
and Zotero staff say custom fields "likely won't happen anytime soon".

## Who it is for
- Primary: PhD / master's students writing a literature review or systematic review.
- Secondary: postdocs, research assistants, librarians running review workshops.
- Geography: US, UK, Canada, Australia, Western Europe first (paying users, English UI).

## Why now
- Zotero 7+ (Aug 2024) added stable plugin APIs for custom columns and item-pane fields.
- Zotero moved to a fast release cycle (v10 in Aug 2026) but still ships no custom fields.
- LLMs make it cheap to auto-fill matrix columns from PDFs (phase 2 upsell).
- Paid Zotero plugins are now normal (Beaver $10–20/mo, PapersGPT $7/mo, $39 lifetime).

## What success looks like
- 90 days: 1,000+ installs, 300+ GitHub stars, 50 paying users.
- 12 months: 10k installs, $2–5k MRR, AI-extraction credits live.

## What we are NOT building (for now)
- A new reference manager. We live inside Zotero.
- A storage/sync service (possible phase 3 add-on only).
- A generic "chat with your PDFs" tool (crowded: Beaver, PapersGPT, SciSpace).
