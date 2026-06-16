---
name: docupdate-skillhub
description: Sync skills-data.js with the skillhub GitHub repo — fixes plugin versions, adds/removes skill entries, loops until check_skillhub.py is clean
argument-hint: ""
---

Run `python3 AGENTS/docupdate-skillhub/check_skillhub.py` and capture the full output + exit code.

If exit code is 0 → print "Already in sync." and stop.

---

Parse each bullet under "ISSUES FOUND" and apply the fix below. Fix all issues from one run before re-checking.

**`[plugin] plugin version out of date: local='X' gh='Y'`**
- `docs/assets/js/skills-data.js` → PLUGINS entry matching `id: 'plugin'`: change `version: 'X'` → `version: 'Y'`
- `AGENTS/skillhub.md` → plugin hierarchy line: change `(plugin, vX)` → `(plugin, vY)`
- For each skill that already exists in SKILLS_DATA for this plugin:
  - Fetch `https://raw.githubusercontent.com/EmilMachine/skillhub/main/plugins/<plugin>/skills/<skill>/SKILL.md` via WebFetch
  - Compare the fetched content against the existing SKILLS_DATA entry fields (`why_en`, `how_en`, `what_en`)
  - Always update `version: 'X'` → `version: 'Y'` in the SKILLS_DATA entry and in the matching SKILLS entry in `skills.js`
  - If content changed: also update `why_en`, `how_en`, `what_en` (and rewrite `_da` translations) from the new SKILL.md
  - If content is unchanged: bump version only — no content edits needed
- After processing all skills, print a one-line summary: `<plugin> vX→vY: N skill(s) with content changes, M unchanged`

**`[plugin] 'skill' exists on GitHub but not in SKILLS_DATA`**
- Fetch `https://raw.githubusercontent.com/EmilMachine/skillhub/main/plugins/<plugin>/skills/<skill>/SKILL.md` via WebFetch
- Derive `why_en`, `how_en`, `what_en` from its content; write concise `_da` translations
- Add entry to `SKILLS_DATA` in `skills-data.js` after the last entry for the same plugin; use the plugin's current version
- Add a short entry to `SKILLS` in `skills.js` (name, plugin, cmd, desc_en, desc_da, version)
- Add `├── <skill>  (/<skill>)` to the plugin block in `AGENTS/skillhub.md`

**`[plugin] 'skill' is in SKILLS_DATA but not found on GitHub`**
- Remove the matching entry from `SKILLS_DATA` in `skills-data.js`
- Remove the matching entry from `SKILLS` in `skills.js` if present
- Remove the `├── <skill>` line from `AGENTS/skillhub.md`

**`[plugin] 'skill' version mismatch: skill='X' vs plugin='Y'`**
- `skills-data.js` → that skill's SKILLS_DATA entry: change `version: 'X'` → `version: 'Y'`
- `skills.js` → that skill's SKILLS entry if present: change `version: 'X'` → `version: 'Y'`

**`[plugin] exists in marketplace.json but not in local PLUGINS array`**
- Fetch skill dirs via GitHub API: `https://api.github.com/repos/EmilMachine/skillhub/contents/plugins/<plugin>/skills`
- Fetch the plugin's version from the already-retrieved marketplace.json data
- Add entry to `PLUGINS` array in `skills-data.js`
- For each skill dir, fetch its SKILL.md and add a SKILLS_DATA entry
- Add plugin block to `AGENTS/skillhub.md` hierarchy

---

After all fixes are applied, run `python3 AGENTS/docupdate-skillhub/check_skillhub.py` again.
Repeat until exit code is 0.

Final output: `Sync complete. Fixed <N> issue(s) across <runs> run(s).`
