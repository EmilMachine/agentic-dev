# Webpage Agent Context

## Design Tokens (`docs/assets/css/main.css`)

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#0a1628` | Page background |
| `--accent` | `#4a9eff` | Links, highlights, borders |
| `--text` | `#ffffff` | Primary text |
| `--text-muted` | `#a0b4cc` | Secondary text, descriptions |
| `--grid` | `rgba(74,158,255,0.12)` | Blueprint grid lines |
| `--surface` | `rgba(255,255,255,0.04)` | Card backgrounds |
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
| Change landing-page skill cards | `docs/assets/js/skills.js` (`SKILLS` array) |
| Change skill docs (why/how/what) | `docs/assets/js/skills-data.js` (`SKILLS_DATA` array) |
| Change plugin install commands | `docs/assets/js/skills-data.js` (`PLUGINS` array) |
| Change skillhub marketplace commands | `docs/assets/js/skills-data.js` (`INSTALL_SKILLHUB`) |
| Change visual design | `docs/assets/css/main.css` |
| Change nav/scroll/tab behavior | `docs/assets/js/nav.js` |

## Script Load Order

**index.html:** `i18n.js` → `skills.js` → `nav.js`

**skills.html:** `i18n.js` → `skills-data.js` → `skills-docs.js` → `nav.js`

`skills-data.js` must precede `skills-docs.js` (defines `SKILLS_DATA`, `PLUGINS`, `INSTALL_SKILLHUB`). `nav.js` must be last on both pages.
