let currentBlogLang = 'en';
let _tocObserver = null;
let POSTS = [];
const _bodyCache = {};

function _parsePostMeta(text, url) {
  const match = text.match(/^<!--([\s\S]*?)-->/);
  if (!match) return null;
  const meta = {};
  match[1].trim().split('\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) return;
    meta[line.slice(0, colonIdx).trim()] = line.slice(colonIdx + 1).trim();
  });
  // Derive section from path: blog/<section>/<lang>/file.html
  const section = url.split('/')[1] || meta.type || 'other';
  return {
    slug: meta.slug,
    type: section,
    langs: meta.langs ? meta.langs.split(',').map(l => l.trim()) : ['en'],
    title: { en: meta.title_en || '', da: meta.title_da || '' },
    created: meta.created || '',
    last_updated: meta.last_updated || '',
    _enUrl: url,
  };
}

function _extractBody(text) {
  return text.replace(/^<!--[\s\S]*?-->/, '').trim();
}

async function _initPosts() {
  const results = await Promise.all(POST_FILES.map(async url => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ${url}`);
      const text = await res.text();
      _bodyCache[url] = text;
      return _parsePostMeta(text, url);
    } catch (e) {
      console.warn('Failed to load post:', url, e);
      return null;
    }
  }));
  POSTS = results.filter(Boolean);
}

async function _fetchBody(post, lang) {
  const bodyLang = post.langs.includes(lang) ? lang : 'en';
  const url = post._enUrl.replace('/en/', `/${bodyLang}/`);
  if (_bodyCache[url]) return { text: _bodyCache[url], bodyLang };
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const text = await res.text();
  _bodyCache[url] = text;
  return { text, bodyLang };
}

function _renderTOC(tocEl, contentEl) {
  if (!tocEl) return;
  if (!contentEl) { tocEl.innerHTML = ''; return; }
  const headings = Array.from(contentEl.querySelectorAll('h1, h2, h3'));
  if (headings.length < 2) { tocEl.innerHTML = ''; return; }

  headings.forEach((h, i) => {
    if (!h.id) h.id = 'toc-' + h.tagName.toLowerCase() + '-' + i + '-' + h.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  });

  const items = headings.map(h => {
    const cls = h.tagName === 'H3' ? ' class="toc-h3"' : h.tagName === 'H1' ? ' class="toc-h1"' : '';
    return `<li${cls}><a href="#${h.id}">${h.textContent.trim()}</a></li>`;
  }).join('');

  tocEl.innerHTML = `<div class="docs-toc-title">On this page</div><ul>${items}</ul>`;

  if (_tocObserver) _tocObserver.disconnect();
  _tocObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tocEl.querySelectorAll('a').forEach(a => a.classList.remove('active'));
        const active = tocEl.querySelector(`a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-64px 0px -70% 0px', threshold: 0 });
  headings.forEach(h => _tocObserver.observe(h));
}

function _typeLabel(type, map) {
  return {
    hands_on: map.blog_type_hands_on || 'Hands-on',
    concepts: map.blog_type_concepts || 'Concepts',
    beliefs: map.blog_type_beliefs || 'Beliefs',
  }[type] || type;
}

async function renderBlog(lang) {
  const sidebar = document.getElementById('blog-sidebar-inner');
  const content = document.getElementById('blog-content-inner');
  if (!sidebar || !content) return;
  currentBlogLang = lang;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('post');

  _renderSidebar(sidebar, lang, slug);
  await _renderContent(content, slug, lang);
  const toc = document.getElementById('docs-toc-inner');
  _renderTOC(toc, content.querySelector('.blog-post-body'));
  if (slug && window.innerWidth <= 1100) {
    content.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function _renderSidebar(sidebar, lang, activeSlug) {
  const map = (typeof strings !== 'undefined' && strings[lang]) ? strings[lang] : {};

  // Group posts by section (derived from folder path)
  const sections = {};
  POSTS.forEach(post => {
    if (!sections[post.type]) sections[post.type] = [];
    sections[post.type].push(post);
  });

  if (Object.keys(sections).length === 0) {
    sidebar.innerHTML = '<p style="padding:0.5rem 1.9rem;color:var(--text-muted);font-size:0.9rem">No posts yet.</p>';
    return;
  }

  const SECTION_ORDER = ['hands_on', 'concepts', 'beliefs'];
  const sortedSections = Object.entries(sections).sort(([a], [b]) => {
    const ai = SECTION_ORDER.indexOf(a), bi = SECTION_ORDER.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  sidebar.innerHTML = sortedSections.map(([section, posts]) => {
    const label = _typeLabel(section, map);
    const hasActive = posts.some(p => p.slug === activeSlug);
    const items = posts.map(post => {
      const title = post.title[lang] || post.title.en;
      const isActive = post.slug === activeSlug;
      return `<li><a href="blog.html?post=${post.slug}" data-post-link="${post.slug}"${isActive ? ' class="active"' : ''}>${title}</a></li>`;
    }).join('');
    return `
      <details class="plugin-group"${hasActive || Object.keys(sections).length === 1 ? ' open' : ''}>
        <summary>
          ${label}
          <span class="plugin-badge">${posts.length}</span>
        </summary>
        <ul class="sidebar-skills">${items}</ul>
      </details>`;
  }).join('');
}

async function _renderContent(content, slug, lang) {
  const map = (typeof strings !== 'undefined' && strings[lang]) ? strings[lang] : {};

  if (!slug) {
    content.innerHTML = `<p style="color:var(--text-muted);padding:2rem 0;font-size:1.1rem">${map.blog_select_prompt || 'Select a post from the sidebar.'}</p>`;
    return;
  }

  const post = POSTS.find(p => p.slug === slug);
  if (!post) {
    content.innerHTML = `<p style="color:var(--text-muted);padding:2rem 0">${map.blog_not_found || 'Post not found.'}</p>`;
    return;
  }

  let bodyHtml, bodyLang;
  try {
    const { text, bodyLang: bl } = await _fetchBody(post, lang);
    bodyHtml = _extractBody(text);
    bodyLang = bl;
  } catch {
    bodyHtml = `<p style="color:var(--text-muted)">${map.blog_not_found || 'Post not found.'}</p>`;
    bodyLang = 'en';
  }

  const typeLabels = {
    hands_on: map.blog_type_hands_on || 'Hands-on',
    concepts: map.blog_type_concepts || 'Concepts',
    beliefs: map.blog_type_beliefs || 'Beliefs',
  };

  const title = post.title[lang] || post.title.en;
  const fallbackBanner = (bodyLang !== lang && lang !== 'en')
    ? `<div class="blog-no-translation">${map.blog_no_translation || 'Not yet available in this language — showing English.'}</div>`
    : '';

  content.innerHTML = `<div class="blog-post-wrap" style="padding:0 0 6rem;max-width:none;margin:0">
    <div class="blog-post-header">
      <span class="blog-type-badge ${post.type}">${typeLabels[post.type] || post.type}</span>
      <h1>${title}</h1>
      <div class="blog-post-meta">
        <span>${map.blog_label_created || 'Published'}: ${post.created}</span>
        <span>${map.blog_label_updated || 'Updated'}: ${post.last_updated}</span>
      </div>
    </div>
    ${fallbackBanner}
    <div class="blog-post-body">${bodyHtml}</div>
  </div>`;
}

document.addEventListener('DOMContentLoaded', async () => {
  const lang = (typeof currentLang !== 'undefined') ? currentLang : 'en';
  await _initPosts();

  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    const slug = a.dataset.postLink ||
      new URLSearchParams(href.includes('?') ? href.split('?')[1] : '').get('post');
    if (!slug) return;
    e.preventDefault();
    history.pushState({ slug }, '', `?post=${slug}&lang=${currentBlogLang}`);
    renderBlog(currentBlogLang);
  });

  renderBlog(lang);
  window.addEventListener('popstate', () => {
    const urlLang = new URLSearchParams(window.location.search).get('lang');
    if (urlLang && typeof applyLang === 'function' && urlLang !== currentBlogLang) {
      applyLang(urlLang);
    } else {
      renderBlog(currentBlogLang);
    }
  });
});
