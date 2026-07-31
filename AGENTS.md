# AGENTS.md — Root (Blog Site)

This repo is a **Hexo v8** static blog site using the **Redefine** theme. It is
not the theme itself — the theme lives at `themes/redefine/` (see its own
`AGENTS.md` for theme development).

## Commands

| Action | Command |
|--------|---------|
| New post | `npx hexo new "Post Title"` |
| New draft | `npx hexo new draft "Draft Title"` |
| Build site | `npm run build` (runs `hexo generate`) |
| Dev server | `npm run server` (runs `hexo server`, default http://localhost:4000) |
| Clean build | `npm run clean` then `npm run build` |
| Deploy | `npm run deploy` (requires `_config.yml` deploy config) |

Run all commands from the repo root. No lockfile is committed at root —
`npm install` resolves from `package.json` and `node_modules/` is gitignored.

## Key Files

- `_config.yml` — site-wide Hexo config (theme, URL, plugins)
- `_config.redefine.yml` — Redefine theme options
- `source/_posts/` — blog post Markdown files (front-matter + content)
- `scaffolds/` — templates for `hexo new` (post, page, draft)
- `themes/redefine/` — the active theme (git submodule or vendored)
- `db.json` — Hexo cache; never edit manually, always gitignored
- `public/` — build output; gitignored

## Content

Posts are Markdown files with YAML front-matter:
```yaml
---
title: My Post
date: 2025-01-01
tags: [tag1, tag2]
categories: [cat1]
---
```

## Build Output

`hexo generate` writes the full static site to `public/`. That directory is
gitignored and never committed.

## Notes

- No test runner, no linter, no TypeScript — this is a content site.
- The Redefine theme has its own build pipeline (Tailwind, JS minification).
  See `themes/redefine/AGENTS.md` for theme development.
- `_config.redefine.yml` follows the theme's documentation at
  https://redefine-docs.ohevan.com