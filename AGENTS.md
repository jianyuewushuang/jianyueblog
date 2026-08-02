# AGENTS.md — Root (Blog Site)

This repo is a **Hexo v8** static blog site using the **Redefine** theme. It is
not the theme itself — the theme lives at `themes/redefine/` (see its own
`AGENTS.md` for theme development).

## Site Identity

- **Site title:** jianyueblog（简约博客）
- **Author:** 简约无双 / jianyuewushuang
- **URL:** <https://blog.jianyuewushuang.top>
- **Language:** zh-CN (`Asia/Shanghai`)

## Commands

| Action | Command |
|--------|---------|
| New post | `npx hexo new "Post Title"` |
| New draft | `npx hexo new draft "Draft Title"` |
| Build site | `npm run build` (runs `hexo generate`) |
| Dev server | `npm run server` (runs `hexo server`, default `http://localhost:4000`) |
| Clean build | `npm run clean` then `npm run build` |
| Deploy | `npm run deploy` (requires `_config.yml` deploy config) |

Run all commands from the repo root. No lockfile is committed at root —
`npm install` resolves from `package.json` and `node_modules/` is gitignored.

> `nodejieba` is a native dependency (used for article recommendation). It needs
> a working C++ toolchain at install time; if `npm install` fails on it, install
> `build-essential` / Xcode CLT first. Article recommendation is currently
> disabled in `_config.redefine.yml`, but the package must still install.

## Key Files

- `_config.yml` — site-wide Hexo config (theme, URL, plugins, live2d)
- `_config.redefine.yml` — Redefine theme options (the bulk of site behavior)
- `source/_data/bookmarks.yml` — data for the `/bookmarks` page
  (template: `bookmarks`). Rendered in 2 columns (`page_templates.bookmarks_column`).
- `source/js/effects-init.js` — custom particle & cursor-effects initializer
  (see "Custom Effects" below).
- `source/about/index.md`, `source/bookmarks/index.md` — custom pages
- `scaffolds/` — templates for `hexo new` (post, page, draft)
- `themes/redefine/` — the active theme (git submodule or vendored)
- `extras/` — supporting docs (`effects.md`, `bookmarks/`); **gitignored**, not
  part of the distributed source
- `LICENSE/` — full text of the three licenses used in this repo
  (`GPL-3.0.txt`, `CC-BY-NC-SA-4.0.txt`, `PolyForm-Noncommercial-1.0.0.md`)
- `.github/dependabot.yml` — daily npm dependency PRs
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

`post_asset_folder` is **off** (`_config.yml`); images are referenced by
absolute path (e.g. `/images/foo.png`) under `source/`.

## Configuration Highlights (`_config.redefine.yml`)

- **Theme mode:** defaults to `dark` (`colors.default_mode`), follows
  `prefer-color-scheme`.
- **Primary color:** `#7509B6` (purple), secondary `#0153E5`.
- **Single-page experience:** `global.single_page: true` (uses swup —
  re-runs injected scripts on navigation; `effects-init.js` guards against
  double-init).
- **Search:** local search enabled via `hexo-generator-searchdb`
  (`navbar.search.enable: true`, `preload: true`).
- **Comments:** Giscus, repo `jianyuewushuang/jianyueblog-comments`,
  category `General`, `mapping: pathname`. Do **not** use `og:title` mapping
  with swup/single-page enabled.
- **Mermaid:** enabled (`plugins.mermaid`), v11.4.1.
- **Word count / min2read:** enabled via `hexo-wordcount`.
- **Open Graph:** enabled, default image `/images/bg.avif`.
- **CDN:** `cdn.enable: false` — theme assets are served locally.
- **Footer:** runtime counter on, start `2026/7/5 10:10:10`; ICP disabled.

`_config.yml` additionally enables **Live2D** (`hexo-helper-live2d` + model
`live2d-widget-model-hijiki`, left side, 150×300, shown on mobile).

## Custom Effects (particles + cursor)

Defined under the `effects:` key of `_config.redefine.yml`:

```yaml
effects:
  particles: true      # snow-like falling particles
  cursoreffects: true  # emoji (❄️) cursor trail
```

**Important architecture note:** the theme's `config-export.js` uses a fixed
whitelist that does **not** include the `effects` field, so
`window.theme.effects` is `undefined` at runtime. To make the effects config
reachable without modifying theme source, it is re-injected via `inject.head`:

```yaml
inject:
  enable: true
  head:
    - '<script>window.__effectsConfig = { particles: true, cursoreffects: true };</script>'
  footer:
    - <script src="/js/effects-init.js"></script>
```

`source/js/effects-init.js` reads config with the priority
`window.__effectsConfig` → `window.theme.effects` → defaults (both on), and
uses a `window.__effectsInitialized` swup guard so it does not re-init on every
page navigation. The two runtime libraries are loaded from CDN:

- particles.js — `https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js`
- cursor-effects — `https://unpkg.com/cursor-effects@latest/dist/browser.js`

If effects stop appearing, suspect CDN reachability first (jsdelivr/unpkg can
be unstable in some regions); consider switching to a domestic mirror. Full
design notes live in `extras/effects.md` (gitignored).

## Analytics

Baidu Tongji is injected via `inject.head` (HM script `hm.baidu.com`). Google
Analytics is present in the config but disabled.

## Build Output

`hexo generate` writes the full static site to `public/`. That directory is
gitignored and never committed.

## Licensing — Read Before Editing

This repo layers three independent licenses by directory. Agents must respect
these boundaries when proposing changes:

1. `themes/redefine/` — **GPLv3** (upstream, © EvanNotFound).
   **Do not modify source inside this directory.** If a fix must touch the
   theme, the change is GPLv3 and cannot be re-licensed to PolyForm. Prefer the
   `inject:` mechanism or a script under `source/js/` instead.
2. `source/_posts/` and original images — **CC BY-NC-SA 4.0** (© jianyuewushuang).
3. Everything else authored here (configs, custom layouts, `source/js/`,
   custom pages) — **PolyForm Noncommercial 1.0.0** (© jianyuewushuang).

Static build output (`public/`) is not source distribution and is not committed.

## Notes

- No test runner, no linter, no TypeScript — this is a content site.
- The Redefine theme has its own build pipeline (Tailwind, JS minification).
  See `themes/redefine/AGENTS.md` for theme development.
- `_config.redefine.yml` follows the theme's documentation at
  <https://redefine-docs.ohevan.com>
