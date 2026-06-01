# Agent Instructions

## Commands
- **Run**: `open docs/index.html`

## Conventions
- **i18n keys**: `section_key` snake_case — both `en` and `da` must be added to `docs/assets/js/i18n.js`
- **Skill cards**: add entries to `SKILLS` array in `docs/assets/js/skills.js` — no HTML edits needed
- **Design tokens**: all CSS variables defined in `docs/assets/css/main.css` `:root`

## Constraints
- Don't add npm/build tooling — stack is plain HTML + CSS + vanilla JS
- Don't edit `docs/index.html` for text changes — use `i18n.js` string map instead
- Don't break script load order: `i18n.js` → `skills.js` → `nav.js`
