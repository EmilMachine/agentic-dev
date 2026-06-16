const SKILLS = [
  {
    name: 'skillhub-update',
    plugin: 'dev-essentials',
    cmd: '/skillhub-update',
    desc_en: 'Update all installed plugins to latest — detects tool, diffs versions, updates stale',
    desc_da: 'Opdater alle installerede plugins til nyeste version automatisk',
    version: '1.7.1'
  },
  {
    name: 'gitstats',
    plugin: 'dev-essentials',
    cmd: '/gitstats [file | contributor | LINES|FILES|LAST]',
    desc_en: 'Git contributor stats — filter by filename or contributor name',
    desc_da: 'Git-bidragyder statistik — filtrer på fil eller bidragyder',
    version: '1.7.1'
  },
  {
    name: 'procon3',
    plugin: 'dev-essentials',
    cmd: '/procon3 <question>',
    desc_en: 'Find 3 alternatives with pros/cons each',
    desc_da: 'Find 3 alternativer med fordele og ulemper',
    version: '1.7.1'
  },
  {
    name: 'learn',
    plugin: 'dev-essentials',
    cmd: '/learn [topic | file-path]',
    desc_en: 'Extract learnings from conversation, file, or freetext and save to AGENTS/ files',
    desc_da: 'Udtræk learnings fra samtale, fil eller fritekst og gem i AGENTS/-filer',
    version: '1.7.1'
  },
  {
    name: 'devcontainer',
    plugin: 'dev-essentials',
    cmd: '/devcontainer [-f] [path]',
    desc_en: 'Stamp out a .devcontainer folder with claude-slim Docker setup',
    desc_da: 'Opret en .devcontainer-mappe med claude-slim Docker-opsætning',
    version: '1.7.1'
  }
];

function renderSkills(lang) {
  const grid = document.getElementById('skills-grid');
  if (!grid) return;
  grid.innerHTML = SKILLS.map(s => `
    <div class="skill-card">
      <div class="skill-name">${s.name}</div>
      <div class="skill-cmd">${s.cmd}</div>
      <div class="skill-desc">${lang === 'da' ? s.desc_da : s.desc_en}</div>
      <span class="skill-version">v${s.version} · ${s.plugin}</span>
    </div>
  `).join('');
}
