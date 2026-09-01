# Best Works — Hermann

The project index I'd point a hiring team to. This repo is now a small static
site that runs entirely in the browser — no backend, no API keys, no sign-up.
Every demo is self-contained with hardcoded data, so it keeps working even when
the production deployments are down.

## See it

GitHub Pages (branch `main`, folder `/`):
`https://hermannpr.github.io/best-works/`

## Run locally

```bash
git clone https://github.com/HermannPR/best-works
cd best-works
python3 -m http.server 5173
```

Then open http://localhost:5173/.

## What's in here

- `index.html` — the page
- `assets/styles.css` — styling
- `assets/data.js` — the showcase data (projects, stacks, mock demo data)
- `assets/app.js` — rendering + the interactive browser demos

## Notes

This is intentionally framework-free: one HTML file, a couple of assets. It can
be deployed anywhere static (GitHub Pages, Vercel, Netlify) with zero config.
