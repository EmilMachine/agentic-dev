# Gotchas

## Blog cross-post links

- Blog post HTML fragments are injected as `innerHTML` into `blog.html` — cross-post links inside fragments cannot rely on full-page reload to work; they must be intercepted by the blog.js SPA click handler
- In blog.js, the `[data-post-link]` click handler must be on `document` (not a specific container) to catch clicks in dynamically injected content
- Use `a[href]` + parse `?post=` from the href as the interception pattern in blog.js — more robust than relying solely on `data-post-link` attributes surviving innerHTML injection
- Cross-post links in blog fragments must use relative `blog.html?post=<slug>` (no leading `/`) — absolute paths like `/blog.html?post=X` break if the server root is not `docs/`

## Shell scripts

- `sed -i ''` is macOS-only; use `sed -i.bak ... && rm *.bak` for cross-platform in-place editing (already fixed in `myblogposts/publish.sh`)
