#!/usr/bin/env node
// Renders a blog post markdown file to HTML, turning :::spoiler / :::spoiler-closed
// blocks into <details>. Emits final HTML — do NOT pipe the output through marked
// again: a second pass re-parses the rendered <details> as markdown, because a raw
// HTML block ends at the first blank line (e.g. blank lines inside a <pre>).
const { marked } = require('marked');
const fs = require('fs');

const file = process.argv[2];
const input = file ? fs.readFileSync(file, 'utf8') : fs.readFileSync('/dev/stdin', 'utf8');

const SPOILER_RE = /^:::spoiler(-closed)? (.+)\n([\s\S]*?)^:::/gm;
const PLACEHOLDER = i => `<!--spoiler-${i}-->`;

// Render each spoiler up front, leaving a placeholder in the markdown so the
// document itself is parsed exactly once.
const spoilers = [];
const staged = input.replace(SPOILER_RE, (_, closed, title, content) => {
  const innerHtml = marked.parse(content.trim());
  const openAttr = closed ? '' : ' open';
  spoilers.push(`<details class="blog-spoiler"${openAttr}>\n<summary>${title.trim()}</summary>\n${innerHtml}\n</details>`);
  return PLACEHOLDER(spoilers.length - 1);
});

const output = marked.parse(staged).replace(
  /(?:<p>\s*)?<!--spoiler-(\d+)-->(?:\s*<\/p>)?/g,
  (_, i) => spoilers[i]
);

process.stdout.write(output);
