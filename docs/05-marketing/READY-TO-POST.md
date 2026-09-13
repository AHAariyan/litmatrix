# READY TO POST — copy exactly, paste where indicated

Links (already live):
- Website: https://ahaariyan.github.io/litmatrix/
- Interactive mockup: https://ahaariyan.github.io/litmatrix/mockup.html
- Screenshot 1: https://ahaariyan.github.io/litmatrix/mockup-1-matrix.png
- Screenshot 2: https://ahaariyan.github.io/litmatrix/mockup-2-fields.png

Zotero forum: you need to be logged in with a free Zotero account (https://www.zotero.org/user/register).
If a post says "awaiting moderation", that is normal for new accounts — it appears within a day.

---------------------------------------------------------------------
## POST 1, 2, 3 — paste this SAME reply into each of these three threads
- https://forums.zotero.org/discussion/79165/request-custom-fields
- https://forums.zotero.org/discussion/101870/comparing-sources-through-a-table-matrix
- https://forums.zotero.org/discussion/131095/feature-request-custom-user-defined-fields-for-zotero-items-in-the-ai-era

(scroll to the bottom of the thread → type in the reply box → "Post Comment")

Hi all — I'm building a plugin for exactly this: user-defined typed fields (text, number, select, 1–5 rating…) stored in the Extra field so they sync safely, plus a "Matrix" window that shows a collection as an editable table (one row per paper, your columns) with sort/filter and Excel/Word export.

Mockup: https://ahaariyan.github.io/litmatrix/mockup-1-matrix.png
Interactive version: https://ahaariyan.github.io/litmatrix/mockup.html

Two questions before I go further:
1. Which columns would you want on day one?
2. The core will be free. Would ~$25/year (or $49 one-time) be fair for unlimited fields, per-column filters, saved views and DOCX/XLSX export?

Happy to add anyone here as a beta tester.

---------------------------------------------------------------------
## POST 4 — start a NEW thread
Go to https://forums.zotero.org → click "New Discussion" → Category: "Plugins"

Title:
LitMatrix — custom fields + literature-review matrix inside Zotero (looking for testers)

Body:
Problem: Zotero has no custom fields and no table view, so for literature reviews we all export to Excel/Notion and the copy goes stale the moment we add a paper.

What LitMatrix does:
- Define your own typed fields (Method, Sample n, Key finding, Relevance 1–5, Verdict…)
- Edit them in the item pane, or show them as sortable columns in the item list
- Open any collection as an editable matrix (one row per paper) with sort/filter
- Export to XLSX / DOCX / CSV for your thesis or supervisor

Storage: values are written as `lm.key: value` lines in the Extra field (same approach as the Zotero Reading List plugin), so they sync with your account, never touch the database, and stay plain text if you uninstall. Works alongside Better BibTeX.

Screenshots: https://ahaariyan.github.io/litmatrix/
Interactive mockup: https://ahaariyan.github.io/litmatrix/mockup.html

Status: first beta in about two weeks. Free core; a Pro version (unlimited fields, filters, saved views, export) is planned at roughly $25/year or $49 one-time.

I'd love your input:
1. What fields would you add first?
2. Which Zotero version and OS are you on?
3. Do you use group libraries for shared reviews?
Reply here if you'd like to be a beta tester.

---------------------------------------------------------------------
## POST 5 — message the Ze-Notes author
Go to https://github.com/frianasoa/Ze-Notes/issues → "New issue"

Title:
Hello from a complementary project (LitMatrix) — open to a chat?

Body:
Hi — I really like Ze-Notes' idea of a table over notes and annotations. I'm building a complementary plugin, LitMatrix, for typed custom fields (values stored in Extra) with a matrix view: https://ahaariyan.github.io/litmatrix/

Would you be open to a quick chat? Ideas: cross-linking (open a Ze-Notes cell from a LitMatrix row), sharing beta testers, or even merging efforts. No pressure either way — happy to just say hello.

---------------------------------------------------------------------
## AFTER POSTING — every day for 7 days (5 minutes)
1. Open the four threads/issue and read new replies.
2. For each reply, add one line to docs/06-progress/progress-log.md:
   "- <name>: <what they asked for> · would pay? yes/no/unclear"
3. Reply to every comment within a day (short, friendly, ask a follow-up question).
4. On Sep 19: tell the AI "validation results" and it will apply the go/no-go rules.

=====================================================================
## ROUND 2 — wider net (no moderation delay). Post after the beta is smoke-tested.

Beta download: https://ahaariyan.github.io/litmatrix/litmatrix-0.1.0-beta.1.xpi

### Reddit r/Zotero (https://www.reddit.com/r/Zotero/submit) — flair: "Plugin" if available
Title: [Beta] LitMatrix — custom typed fields + literature-review matrix inside Zotero
Body:
Zotero still has no custom fields or table view (Zotero 10 didn't add them), so I built a plugin: define your own fields (Method, Sample n, Finding, Relevance 1–5, Verdict…), edit them in the item pane or as sortable columns, and open any collection as an editable matrix with CSV export. Values are stored as `lm.key: value` lines in Extra, so they sync and stay plain text if you uninstall.
Screenshots + beta .xpi: https://ahaariyan.github.io/litmatrix/
It's a free beta; I'd love to know which fields you'd add first and whether it breaks on your setup (Zotero version/OS).

### Reddit r/PhD / r/GradSchool / r/AskAcademia (same body, title below)
Title: Made a Zotero plugin that turns a collection into an editable literature-review matrix (free beta)

### Mastodon / Bluesky (academic circles; tag #Zotero #PhDchat #AcademicChatter)
Zotero has no custom fields or table view, so I built one: LitMatrix — your own typed fields + an editable literature-review matrix, inside Zotero, values stored in Extra so they sync. Free beta, feedback wanted: https://ahaariyan.github.io/litmatrix/ #Zotero #PhDchat

### Email to 5 librarians who maintain Zotero LibGuides (find via Google: "Zotero" site:libguides.com)
Subject: Free Zotero plugin for literature-review matrices — would your researchers find it useful?
Hi <name>, I saw your Zotero guide at <url>. I'm building LitMatrix, a free plugin that adds custom typed fields and an editable literature-review matrix inside Zotero (values live in the Extra field, so nothing breaks sync). Screenshots and beta: https://ahaariyan.github.io/litmatrix/ . If you think it would help students doing literature or systematic reviews, I'd be grateful for 10 minutes of feedback — or a mention in your guide once it's stable. Thanks, <your name>
