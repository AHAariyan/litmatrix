# Decision log

| Date | Decision | Why | Alternatives rejected |
|---|---|---|---|
| 2026-09-11 | Pick "Zotero literature matrix plugin" over "AI-accusation writing-provenance kit" | User preference; smaller but clearer demand, lower build risk, explicit price signals ($20–30/yr) | Provenance kit (bigger market, user disliked); LMS deadline planner (9+ competitors); flashcard apps (Knowt/Anki) |
| 2026-09-12 | Validate for 1 week before full build, but build the free core skeleton in parallel | Waiting is wasted time; a demo makes validation posts credible | Build 6 weeks blind; validate only |
| 2026-09-12 | Store all custom values in the item's Extra field as `key: value` lines | Only sync-safe storage per Zotero staff guidance (May 2024); Reading List plugin (573 stars) proves it works | Separate SQLite table (breaks sync), notes (unstructured) |
| 2026-09-12 | Free core + paid Pro (~$25/yr or $49 lifetime); AI extraction as credits later | Matches ecosystem norms (Beaver, PapersGPT); stated student WTP $20–30/yr | Fully free (no revenue); subscription-only (open-source backlash) |
| 2026-09-12 | Working name "LitMatrix for Zotero" | Descriptive, searchable; revisit before launch | ZotMatrix, Matrix Notes |
