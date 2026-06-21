#!/usr/bin/env node
const { marked } = require('marked');
const fs = require('fs');

const file = process.argv[2];
const input = file ? fs.readFileSync(file, 'utf8') : fs.readFileSync('/dev/stdin', 'utf8');

const SPOILER_RE = /^:::spoiler (.+)\n([\s\S]*?)^:::/gm;

const output = input.replace(SPOILER_RE, (_, title, content) => {
  const innerHtml = marked.parse(content.trim());
  return `<details class="blog-spoiler" open>\n<summary>${title.trim()}</summary>\n${innerHtml}\n</details>`;
});

process.stdout.write(output);
