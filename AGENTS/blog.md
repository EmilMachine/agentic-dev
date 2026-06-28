# Blog

## blog-data.js generation

- Do NOT manually edit `docs/assets/js/blog-data.js` — run `scripts/generate-blog-data.js` to regenerate it from the HTML files in `docs/blog/`

## Link behaviour gotchas

See `AGENTS/gotchas.md` — blog cross-post links have SPA interception requirements that are easy to get wrong.

## Publishing posts

- To publish blog posts (convert `.md` → `.html` and register in `blog-data.js`), run `myblogposts/publish.sh` — do not run conversion commands or the generate script manually
- Link to `docs/misc/` files from blog posts using the relative path `../../../misc/<file>` written directly as raw HTML in the markdown source (same depth pattern as `../../../assets/`)
- Do NOT add a sed rewrite to `publish.sh` for `misc/` links — write the relative path directly in the markdown instead
