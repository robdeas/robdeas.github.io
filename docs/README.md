# Robs Software Engineering Notebook Static Site

This folder is a self-contained static rebuild of robd.tech, collecting software engineering writing, project notes, and experiments.

- Imported page/article metadata lives in `content/index.json`.
- Imported page/article bodies live as normal HTML fragments in `content/imported/*.html`.
- Hand-written pages can live in `content/custom/*.html`.
- The page shell is `index.html`.
- Styling is in `assets/styles.css`.
- Rendering and search/filter behaviour is in `assets/app.js`.
- Media files live in `uploads/`.
- Local preview helper is `serve-local.py`.

Preview locally:

```powershell
python serve-local.py
```

Then open `http://127.0.0.1:8007/`. The script only runs on your machine; on a real web host it is just an unused file.

Regenerate from the WordPress XML by running from the export root:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\build-static-site.ps1
```

The generated app uses hash routes, so links like `#/articles` and `#/robokeytags` work on simple static hosts without rewrite rules.

To add a hand-written page, create a new HTML fragment such as `content/custom/binary-calculator.html`, then copy `content/custom-index.sample.json` to `content/custom-index.json` and add a matching entry with a unique `slug`, `title`, `type`, `excerpt`, and `contentFile`.

The generator rewrites `content/index.json` and `content/imported/`, but it leaves `content/custom/` and `content/custom-index.json` alone.
