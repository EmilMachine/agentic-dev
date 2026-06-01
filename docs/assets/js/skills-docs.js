function renderSkillDocs(lang) {
  const sidebar = document.getElementById('docs-sidebar-inner');
  const content = document.getElementById('docs-content-inner');
  if (!sidebar || !content || typeof SKILLS_DATA === 'undefined') return;

  const map = {};
  if (typeof strings !== 'undefined' && strings[lang]) {
    Object.assign(map, strings[lang]);
  }
  const t = key => map[key] || key;

  // Group by plugin
  const plugins = {};
  SKILLS_DATA.forEach(s => {
    if (!plugins[s.plugin]) plugins[s.plugin] = [];
    plugins[s.plugin].push(s);
  });

  // Build sidebar
  sidebar.innerHTML = Object.entries(plugins).map(([plugin, skills]) => `
    <details class="plugin-group" open>
      <summary>
        ${plugin}
        <span class="plugin-badge">${skills.length}</span>
      </summary>
      <ul class="sidebar-skills">
        ${skills.map(s => `
          <li>
            <a href="#${s.id}" data-skill-link="${s.id}">${s.cmd}</a>
          </li>
        `).join('')}
      </ul>
    </details>
  `).join('');

  // Build content
  content.innerHTML = Object.entries(plugins).map(([plugin, skills]) => `
    <div class="plugin-heading">${plugin} v${skills[0].version}</div>
    ${skills.map(s => `
      <details class="skill-entry" id="${s.id}">
        <summary>
          <span class="skill-entry-name">${s.name}</span>
          <span class="skill-entry-cmd">${s.cmd}</span>
          <span class="skill-entry-ver">v${s.version}</span>
        </summary>
        <div class="skill-detail">
          <div class="skill-detail-section">
            <div class="detail-label" data-i18n="label_why">${t('label_why')}</div>
            <div class="detail-body">${lang === 'da' ? s.why_da : s.why_en}</div>
          </div>
          <div class="skill-detail-section">
            <div class="detail-label" data-i18n="label_how">${t('label_how')}</div>
            <div class="detail-body">${lang === 'da' ? s.how_da : s.how_en}</div>
          </div>
          <div class="skill-detail-section">
            <div class="detail-label" data-i18n="label_what">${t('label_what')}</div>
            <div class="detail-body">${lang === 'da' ? s.what_da : s.what_en}</div>
          </div>
        </div>
      </details>
    `).join('')}
  `).join('');

  // Wire sidebar links
  sidebar.querySelectorAll('[data-skill-link]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const id = a.dataset.skillLink;
      const target = document.getElementById(id);
      if (!target) return;
      target.open = true;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', '#' + id);
      updateActiveLink(id);
    });
  });

  // Handle hash on load/re-render
  const hash = location.hash.slice(1);
  if (hash) {
    const target = document.getElementById(hash);
    if (target) {
      target.open = true;
      setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
    updateActiveLink(hash);
  }
}

function updateActiveLink(id) {
  document.querySelectorAll('[data-skill-link]').forEach(a => {
    a.classList.toggle('active', a.dataset.skillLink === id);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderSkillDocs(typeof currentLang !== 'undefined' ? currentLang : 'en');

  // Update hash on skill open
  document.addEventListener('toggle', e => {
    const el = e.target;
    if (el.classList.contains('skill-entry') && el.open && el.id) {
      history.replaceState(null, '', '#' + el.id);
      updateActiveLink(el.id);
    }
  }, true);
});
