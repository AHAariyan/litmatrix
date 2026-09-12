# Tech stack
- TypeScript, zotero-plugin-toolkit, zotero-plugin-scaffold (build/hot reload)
- Grid: minimal custom virtualized table (avoid React to keep bundle small)
- Export: SheetJS (xlsx), docx (docx.js), native CSV
- Licensing: tweetnacl (ed25519 verify)
- Payments: Lemon Squeezy (webhooks → license issue) — or Gumroad license API
- Landing page: static HTML (assets/landing-page), host on GitHub Pages/Cloudflare
- Analytics: none in plugin; landing page uses privacy-friendly counter (Plausible/GoatCounter)
