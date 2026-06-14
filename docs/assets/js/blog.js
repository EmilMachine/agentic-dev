let activeBlogType = 'all';
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
  return {
    slug: meta.slug,
    type: meta.type,
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
    believes: map.blog_type_believes || 'Believes',
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
}

function _renderSidebar(sidebar, lang, activeSlug) {
  const map = (typeof strings !== 'undefined' && strings[lang]) ? strings[lang] : {};

  const filterBtns = ['all', 'hands_on', 'concepts', 'believes'].map(type => {
    const label = type === 'all' ? (map.blog_type_all || 'All') : _typeLabel(type, map);
    return `<button class="blog-filter-btn${activeBlogType === type ? ' active' : ''}" data-type="${type}">${label}</button>`;
  }).join('');

  const filtered = activeBlogType === 'all' ? POSTS : POSTS.filter(p => p.type === activeBlogType);

  const links = filtered.map(post => {
    const title = post.title[lang] || post.title.en;
    const isActive = post.slug === activeSlug;
    return `<li><a href="blog.html?post=${post.slug}" data-post-link="${post.slug}"${isActive ? ' class="active"' : ''}>${title}</a></li>`;
  }).join('');

  sidebar.innerHTML = `
    <div class="blog-sidebar-filters">${filterBtns}</div>
    <ul class="sidebar-skills">${links || '<li style="padding:0.5rem 1.9rem;color:var(--text-muted);font-size:0.9rem">No posts yet.</li>'}</ul>
  `;

  sidebar.querySelectorAll('.blog-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeBlogType = btn.dataset.type;
      renderBlog(currentBlogLang);
    });
  });

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
    believes: map.blog_type_believes || 'Believes',
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

  const sidebar = document.getElementById('blog-sidebar-inner');
  if (sidebar) {
    sidebar.addEventListener('click', e => {
      const a = e.target.closest('[data-post-link]');
      if (!a) return;
      e.preventDefault();
      const slug = a.dataset.postLink;
      history.pushState({ slug }, '', `blog.html?post=${slug}`);
      renderBlog(currentBlogLang);
    });
  }

  renderBlog(lang);
  window.addEventListener('popstate', () => renderBlog(currentBlogLang));
});
