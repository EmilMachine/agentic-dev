# Gotchas

## Blog cross-post links

- Blog post HTML fragments are injected as `innerHTML` into `blog.html` — cross-post links inside fragments cannot rely on full-page reload to work; they must be intercepted by the blog.js SPA click handler
- In blog.js, the `[data-post-link]` click handler must be on `document` (not a specific container) to catch clicks in dynamically injected content
- Use `a[href]` + parse `?post=` from the href as the interception pattern in blog.js — more robust than relying solely on `data-post-link` attributes surviving innerHTML injection
- Cross-post links in blog fragments must use relative `blog.html?post=<slug>` (no leading `/`) — absolute paths like `/blog.html?post=X` break if the server root is not `docs/`

## Codex CLI

- Codex exit is Ctrl+D (not Ctrl+C twice as in Claude Code); ESC interrupts the active task
- Install Codex with `npm install -g @openai/codex` — the unscoped `codex` npm package is an unrelated 2012 project

## Shell scripts

- `sed -i ''` is macOS-only; use `sed -i.bak ... && rm *.bak` for cross-platform in-place editing (already fixed in `myblogposts/publish.sh`)
- Never use `sed -i` with `\n` in the pattern — on this Linux container it inserts literal backslash-n characters instead of newlines; use Python read/replace/write for multiline or bulk string replacements
