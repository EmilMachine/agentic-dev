# Agent Instructions

## Reference Files
- webpage context (CSS tokens, nav, templates, script order, typography): `AGENTS/webpage.md`
- skillhub/docs page (skill data, plugin install, anchor routing): `AGENTS/skillhub.md`
- misc patterns (install tab syncing, plugin heading anchors): `AGENTS/misc.md`
- known gotchas (blog SPA links, shell script portability): `AGENTS/gotchas.md`

## Commands
- **Run**: `open docs/index.html`

## Conventions
- **i18n keys**: `section_key` snake_case — both `en` and `da` must be added to `docs/assets/js/i18n.js`
- **Skill cards**: add entries to `SKILLS` array in `docs/assets/js/skills.js` — no HTML edits needed
- **Design tokens**: all CSS variables defined in `docs/assets/css/main.css` `:root`

- **Blog posts**: add entry to `POSTS` array in `docs/assets/js/blog-data.js`; see `myblogposts/README.md` for author workflow
- blog workflow details: `AGENTS/blog.md`
- **Script load order for `blog.html`**: `i18n.js` → `blog-data.js` → `blog.js` → `nav.js`

## Constraints
- Don't add npm/build tooling — stack is plain HTML + CSS + vanilla JS
- Don't edit `docs/index.html` for text changes — use `i18n.js` string map instead
- Don't break script load order — index.html: `i18n.js` → `skills.js` → `nav.js`; skills.html: `i18n.js` → `skills-data.js` → `skills-docs.js` → `nav.js`
