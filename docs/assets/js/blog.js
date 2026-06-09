let activeBlogType = 'all';
let currentBlogLang = 'en';

function renderBlog(lang) {
  const root = document.getElementById('blog-root');
  if (!root) return;
  currentBlogLang = lang;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('post');
  const urlLang = params.get('lang');
  const displayLang = urlLang || lang;

  if (slug) {
    renderPost(root, slug, displayLang);
  } else {
    renderList(root, displayLang);
  }
}

function renderList(root, lang) {
  const map = (typeof strings !== 'undefined' && strings[lang]) ? strings[lang] : {};

  const filtered = activeBlogType === 'all'
    ? POSTS
    : POSTS.filter(p => p.type === activeBlogType);

  const typeLabel = t => ({
    hands_on: map.blog_type_hands_on || 'Hands-on',
    concepts: map.blog_type_concepts || 'Concepts',
    believes: map.blog_type_believes || 'Believes',
  }[t] || t);

  const filterBar = `<div class="blog-filter-bar">
    ${['all', 'hands_on', 'concepts', 'believes'].map(type => {
      const label = type === 'all'
        ? (map.blog_type_all || 'All')
        : typeLabel(type);
      return `<button class="blog-filter-btn${activeBlogType === type ? ' active' : ''}" data-type="${type}">${label}</button>`;
    }).join('')}
  </div>`;

  const cards = filtered.length
    ? filtered.map(post => {
        const title = post.title[lang] || post.title.en;
        const badge = typeLabel(post.type);
        const date = post.created;
        return `<a class="blog-card" href="blog.html?post=${post.slug}" data-slug="${post.slug}">
          <div class="blog-card-top">
            <span class="blog-type-badge ${post.type}">${badge}</span>
          </div>
          <div class="blog-card-title">${title}</div>
          <div class="blog-card-meta">${map.blog_label_created || 'Published'} ${date}</div>
        </a>`;
      }).join('')
    : `<p style="color:var(--text-muted);grid-column:1/-1">No posts yet.</p>`;

  root.innerHTML = `${filterBar}<div class="blog-list">${cards}</div>`;

  root.querySelectorAll('.blog-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeBlogType = btn.dataset.type;
      renderList(root, currentBlogLang);
    });
  });
}

function renderPost(root, slug, lang) {
  const post = POSTS.find(p => p.slug === slug);
  const map = (typeof strings !== 'undefined' && strings[lang]) ? strings[lang] : {};

  if (!post) {
    root.innerHTML = `<div class="blog-post-wrap"><a class="blog-post-back" href="blog.html">${map.blog_back || '← All posts'}</a><p>Post not found.</p></div>`;
    return;
  }

  const hasLang = post.langs.includes(lang);
  const bodyLang = hasLang ? lang : 'en';
  const body = post.body[bodyLang] || post.body.en || '';

  const typeLabels = {
    hands_on: map.blog_type_hands_on || 'Hands-on',
    concepts: map.blog_type_concepts || 'Concepts',
    believes: map.blog_type_believes || 'Believes',
  };

  const title = post.title[lang] || post.title.en;
  const fallbackBanner = (!hasLang && lang !== 'en')
    ? `<div class="blog-no-translation">${map.blog_no_translation || 'Not yet available in this language — showing English.'}</div>`
    : '';

  root.innerHTML = `<div class="blog-post-wrap">
    <a class="blog-post-back" href="blog.html">${map.blog_back || '← All posts'}</a>
    <div class="blog-post-header">
      <span class="blog-type-badge ${post.type}">${typeLabels[post.type] || post.type}</span>
      <h1>${title}</h1>
      <div class="blog-post-meta">
        <span>${map.blog_label_created || 'Published'}: ${post.created}</span>
        <span>${map.blog_label_updated || 'Updated'}: ${post.last_updated}</span>
      </div>
    </div>
    ${fallbackBanner}
    <div class="blog-post-body">${body}</div>
  </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  const lang = (typeof currentLang !== 'undefined') ? currentLang : 'en';
  renderBlog(lang);
});
