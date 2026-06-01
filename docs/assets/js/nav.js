document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('nav');

  // Install tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      btn.closest('.install-tabs').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.closest('.install-tabs').querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      btn.closest('.install-tabs').querySelector(`[data-panel="${tab}"]`).classList.add('active');
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
