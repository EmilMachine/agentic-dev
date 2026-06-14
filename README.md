# agentic-dev
github webpage to document agentic-dev tools in particular my own skillhub

## Local Preview

```bash
open docs/index.html
```

## Adding Blog Posts

Blog posts live under `docs/blog/<section>/<lang>/`, e.g.:

```
docs/blog/hands_on/en/5_my_new_post.html
docs/blog/hands_on/da/5_my_new_post.html   # optional Danish translation
```

`<section>` is the category (`hands_on`, `concepts`, `beliefs`).  
`<lang>` is the language code (`en`, `da`).  
Posts are sorted by filename, so prefix them with a number (`0_`, `1_`, …).

After adding or removing posts, regenerate the nav index:

```bash
npm run build
```

The git pre-commit hook runs this automatically — install it once with:

```bash
npm run setup
```

## GitHub Pages Setup

1. Push to `main`
2. Repo Settings → Pages → Source: `main` branch, `/docs` folder
3. Site available at `https://EmilMachine.github.io/agentic-dev`

## License

Website copy, documentation, and workshop materials are licensed under [CC BY-NC-ND 4.0](LICENSE-CONTENT) — share freely, no commercial use, no derivatives.
