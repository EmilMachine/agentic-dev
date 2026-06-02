document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('nav');

  // Install tabs — event delegation, syncs all .install-tabs groups on the page
  document.addEventListener('click', e => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    const tab = btn.dataset.tab;
    document.querySelectorAll('.install-tabs').forEach(group => {
      group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      group.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      const matchBtn = group.querySelector(`[data-tab="${tab}"]`);
      const matchPanel = group.querySelector(`[data-panel="${tab}"]`);
      if (matchBtn) matchBtn.classList.add('active');
      if (matchPanel) matchPanel.classList.add('active');
    });
  });

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      if (typeof toggleLang === 'function') toggleLang();
    });
  }
});
