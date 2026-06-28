function autoDetectPage() {
  const path = window.location.pathname;
  if (path.includes('/blog/') || /\/blog(\.html)?$/.test(path)) return 'blog';
  if (/\/skillhub(\.html)?$/.test(path)) return 'skills';
  if (path.includes('contact')) return 'contact';
  return 'index';
}

function buildNav(activePage) {
  const isIndex = activePage === 'index';
  const logoHref = isIndex ? '#' : 'index.html';
  const aboutHref = isIndex ? '#about' : 'index.html#about';
  const contactHref = 'contact.html';
  const cls = page => activePage === page ? ' class="nav-active"' : '';
  return `<nav>
  <a class="nav-logo" href="${logoHref}">EmilMachine</a>
  <ul class="nav-links">
    <li><a href="blog.html?post=0_beliefs"${cls('blog')} data-i18n="nav_blog">Blog</a></li>
    <li><a href="skillhub.html"${cls('skills')} data-i18n="nav_docs">Skillhub</a></li>
    <li><a href="${aboutHref}" data-i18n="nav_about">About</a></li>
    <li><a href="${contactHref}"${cls('contact')} data-i18n="nav_contact">Contact</a></li>
    <li>
      <button id="lang-toggle" class="btn-lang" aria-label="Switch to Danish">🇩🇰</button>
    </li>
  </ul>
</nav>`;
}

function buildFooter() {
  return `<footer>
  <p>&copy; 2026 Emil "Machine" · <a href="https://github.com/EmilMachine/skillhub" style="color:inherit;">GitHub</a></p>
</footer>`;
}

function buildWatermark() {
  return `<img class="vit-watermark" src="assets/vitruvian.jpg" alt="" aria-hidden="true">`;
}

(function () {
  const page = autoDetectPage();
  document.body.insertAdjacentHTML('afterbegin', buildWatermark() + buildNav(page));
  document.body.insertAdjacentHTML('beforeend', buildFooter());
})();

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

  const blogNavLink = document.querySelector('.nav-links a[href^="blog.html"]');
  if (blogNavLink) {
    blogNavLink.addEventListener('click', () => {
      const lang = typeof currentLang !== 'undefined' ? currentLang : 'en';
      // Update href so blog.js SPA handler picks up the right slug+lang,
      // and so plain browser navigation (non-blog pages) carries the params too.
      blogNavLink.setAttribute('href', `blog.html?post=0_beliefs&lang=${lang}`);
    });
  }
});
