# Spotykach manual

An interactive, mobile-first web manual for Spotykach, built as a static
site (no build step, no framework, no dependencies).

## Layout

- **`web/`** — the site itself. This is what gets deployed. See
  [`web/README.md`](web/README.md) for how the content is structured
  (topics, controls, modes, concepts, pages) and how to extend it.
- **`source_manual/`** — the original Notion export the content was
  written from (PDFs, images, source markdown). Not published; kept for
  reference when the manual needs updating.
- **`.github/workflows/deploy.yml`** — publishes `web/` to GitHub Pages
  automatically on every push to `main`.

## Run it locally

No build step. From `web/`:

```sh
cd web
python3 -m http.server 8000
```

Then visit `http://localhost:8000`. (Opening `index.html` directly with
`file://` also mostly works, but a local server avoids any `fetch`/CORS
quirks and is closer to how GitHub Pages actually serves it.)

## Deploy to GitHub Pages

This repo includes a GitHub Actions workflow
(`.github/workflows/deploy.yml`) that deploys the contents of `web/` on
every push to `main`. To turn it on for the first time:

1. Push this folder to a GitHub repository (if it isn't one yet: `git
   init`, `git add`, `git commit`, then create a repo on GitHub and `git
   push`).
2. In the repo's **Settings → Pages**, set **Source** to **GitHub
   Actions** (not "Deploy from a branch").
3. Push to `main` — the workflow builds and publishes automatically.
   Check the **Actions** tab for progress and the resulting URL.

No further configuration is needed — the workflow only ever touches the
`web/` folder, so `source_manual/` and everything else stays out of the
published site.

## Design notes

- **Mobile-first.** The base styles in `web/styles.css` target a
  phone-width viewport (roughly the size of an iPhone 12, 390px); wider
  layouts are layered on with `min-width` media queries, not the other
  way around.
- **No framework, no build.** Plain HTML/CSS/JS on purpose — it keeps
  the site trivial to host anywhere static files are served, GitHub
  Pages included.
