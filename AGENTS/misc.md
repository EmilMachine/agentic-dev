# Misc

## Install tab syncing

All `.install-tabs` groups on a page stay in sync. `nav.js` uses event delegation on `document` — clicking any agent tab (Claude Code / Codex / OpenCode) updates every `.install-tabs` group on the page simultaneously. This covers both the header install block and per-plugin install blocks on `skills.html`.

## Plugin heading anchors

Each plugin heading in `docs-content-inner` has `id="plugin-{plugin-name}"` (e.g. `id="plugin-dev-essentials"`). Clicking the plugin name in the sidebar scrolls to it (expand/collapse still works normally).
