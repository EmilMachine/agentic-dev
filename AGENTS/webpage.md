# Webpage Agent Context

## Design Tokens (`docs/assets/css/main.css`)

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#f0e8d4` | Page background (drafting paper cream) |
| `--accent` | `#1e4a8c` | Links, highlights, active states |
| `--text` | `#111e34` | Primary text |
| `--text-muted` | `#4a5e78` | Secondary text, descriptions |
| `--surface` | `#e4d8c4` | Card backgrounds |
| `--surface-hover` | `#d4c8b0` | Card hover state |
| `--code-bg` | `#d8ccb8` | Inline code, code block backgrounds |
| `--pre-bg` | `#ddd0bc` | Pre/install block backgrounds |
| `--install-bg` | `#ddd0bc` | Install block background |
| `--font` | `'Space Grotesk', sans-serif` | All UI text |
| `--mono` | `'Courier New', monospace` | Code snippets |
| `--max-w` | `1100px` | Content max-width |

## i18n Key Naming

Convention: `section_key` — snake_case, section prefix matches HTML section id.

| Key | Section |
|---|---|
| `nav_*` | Navigation |
| `hero_*` | `#hero` |
| `skills_*` | `#skills` |
| `about_*` | `#about` |
| `contact_*` | `#contact` |

## Adding a New i18n String

1. Add key to both `en` and `da` objects in `docs/assets/js/i18n.js`
2. Add `data-i18n="your_key"` attribute to the HTML element in `docs/index.html`
3. `applyLang()` picks it up automatically — no other changes needed

## Section Update Workflow

| Goal | File to edit |
|---|---|
| Change section layout/structure | `docs/index.html` |
| Change text content | `docs/assets/js/i18n.js` (both `en` and `da`) |
| Change skill docs (why/how/what) | `docs/assets/js/skills-data.js` (`SKILLS_DATA` array) |
| Change plugin install commands | `docs/assets/js/skills-data.js` (`PLUGINS` array) |
| Change skillhub marketplace commands | `docs/assets/js/skills-data.js` (`INSTALL_SKILLHUB`) |
| Change visual design | `docs/assets/css/main.css` |
| Change nav/scroll/tab behavior | `docs/assets/js/nav.js` |

## Script Load Order

**index.html:** `i18n.js` → `nav.js`

**skills.html:** `i18n.js` → `skills-data.js` → `skills-docs.js` → `nav.js`

**blog.html:** `i18n.js` → `blog-data.js` → `blog.js` → `nav.js`

`i18n.js` must precede `nav.js` on all pages — `nav.js` IIFE injects nav HTML synchronously, then `applyLang()` (DOMContentLoaded, registered by i18n.js first) finds those elements. `nav.js` must always be last.

## Page Chrome (nav / footer / watermark)

- Nav, footer, and vitruvian watermark are injected by a `nav.js` IIFE — **never** add `<nav>`, `<footer>`, or `<img class="vit-watermark">` inline in any HTML page
- Active-page nav highlight is auto-detected via `autoDetectPage()` in `nav.js` (pathname match); any path containing `/blog/` → blog active state — no per-page config needed
- Watermark appears on all top-level pages (index, skills, blog); blog fragment pages get neither nav nor watermark (they're loaded as partials into `blog.html`)

## New Page Template

Minimal setup for a new top-level page — nothing else needed for consistent chrome:
```html
<head>
  <!-- title, meta, font preconnects, main.css link -->
</head>
<body>
  <!-- page content -->
  <script src="assets/js/i18n.js"></script>
  <script src="assets/js/nav.js"></script>
</body>
```

## Blog Fragment Pages

`docs/blog/hands_on/en/*.html` are HTML content partials only — no `<html>/<head>/<body>`, no nav/footer. Loaded dynamically by `blog.js` into `#blog-root`. Treat as content, not standalone pages.

## Install Tabs (index.html hero)

The tabbed install block in `index.html` hero stays inline — it is index-page-specific content, not a shared component.

## Typography & Code Styling

- Content body font-size: `1.35rem` (`detail-body`, `blog-post-body`) — use this as baseline for new content sections
- Page header subtitle font-size: `1.5rem` (`docs-page-header p`, `blog-page-header p`)
- Page header `h1` uses `clamp(3rem, 7vw, 5rem)` on both docs and blog — don't add overrides that shrink blog headers below this scale; font sizes must match across pages
- All code text is bold: `code, .skill-entry-cmd { font-weight: 700 }` in the drafting paper override section — don't remove or override this
- All install/command blocks must have filled background — don't set `.tab-panel .install-block { background: none }`; use `var(--code-bg)` with `border-color: var(--border-subtle)`
