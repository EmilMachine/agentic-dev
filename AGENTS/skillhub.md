# Skillhub Agent Context

## Plugin Hierarchy

```
skillhub (registry)
└── dev-essentials (plugin, v1.4.0)
│   ├── skillhub-update  (/skillhub-update)
│   ├── gitstats         (/gitstats)
│   ├── procon3          (/procon3)
│   ├── pc3              (/pc3)
│   ├── codereview       (/codereview)
│   ├── cleanup          (/cleanup)
│   ├── secure           (/secure)
│   ├── setup            (/setup)
│   └── issue            (/issue)
└── md3step (plugin, v1.1.0)
    ├── mdresearch       (/mdresearch)
    ├── mdplan           (/mdplan)
    ├── mdimplement      (/mdimplement)
    └── mdupdate         (/mdupdate)
```

Install via: `/plugin marketplace add https://github.com/EmilMachine/skillhub`

## Adding a New Skill Doc Entry

Edit `docs/assets/js/skills-data.js` — add an entry to `SKILLS_DATA`:

```js
{
  id: 'skill-name',            // anchor slug — must be unique, kebab-case
  name: 'skill-name',          // display label
  plugin: 'plugin-name',       // plugin group in sidebar/content
  version: '1.0.0',
  cmd: '/skill-name <args>',   // full command signature shown in summary
  why_en: 'Why you\'d use this skill.',
  why_da: 'Hvorfor du ville bruge denne skill.',
  how_en: 'How to invoke: <code>/skill-name arg</code>.',
  how_da: 'Sådan bruges den: <code>/skill-name arg</code>.',
  what_en: 'What it does mechanically.',
  what_da: 'Hvad den gør mekanisk.',
}
```

HTML is supported in `why_en/da`, `how_en/da`, `what_en/da` — use `<code>`, `<ul>/<li>`, `<strong>`, `<em>`.

No edits to `skills.html` needed — `renderSkillDocs()` auto-generates sidebar and content from `SKILLS_DATA`.

## Version Bump Process

Update the `version` field in the relevant entry in `skills-data.js`. The version appears in the skill summary row and in the plugin heading.

## Skill Detail Anatomy (rendered HTML)

```html
<details class="skill-entry" id="{id}">
  <summary>
    <span class="skill-entry-name">{name}</span>
    <span class="skill-entry-cmd">{cmd}</span>
    <span class="skill-entry-ver">v{version}</span>
  </summary>
  <div class="skill-detail">
    <div class="skill-detail-section">
      <div class="detail-label">Why</div>
      <div class="detail-body">{why_en|why_da}</div>
    </div>
    <div class="skill-detail-section">
      <div class="detail-label">How to use</div>
      <div class="detail-body">{how_en|how_da}</div>
    </div>
    <div class="skill-detail-section">
      <div class="detail-label">What it does</div>
      <div class="detail-body">{what_en|what_da}</div>
    </div>
  </div>
</details>
```

## i18n in Skill Detail

Skill detail body content (`why_*`, `how_*`, `what_*`) is rendered directly by `renderSkillDocs(lang)` called from `applyLang()` in `i18n.js`. Section labels (`Why`, `How to use`, `What it does`) use `data-i18n` keys `label_why`, `label_how`, `label_what` defined in `i18n.js`.

## Anchor Routing

Direct links to a skill: `skills.html#gitstats`. The page opens the matching `<details>` and scrolls to it on load. Hash updates when a skill is opened in the sidebar or via toggle.

## Files

| Purpose | File |
|---|---|
| Skill data (all 13 skills) | `docs/assets/js/skills-data.js` |
| Render + routing logic | `docs/assets/js/skills-docs.js` |
| Doc page HTML shell | `docs/skills.html` |
| i18n strings (label_why etc.) | `docs/assets/js/i18n.js` |
| CSS (two-panel layout, collapsibles) | `docs/assets/css/main.css` → `/* Skills Doc Page */` |
