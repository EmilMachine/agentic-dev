#!/usr/bin/env node
// Scans docs/blog/<section>/<lang>/*.html and writes docs/assets/js/blog-data.js.
// Sections = first-level folders (e.g. hands_on, concepts, beliefs).
// Posts are discovered from the /en/ subfolder (canonical); other langs are
// resolved at runtime by blog.js via the /en/ → /<lang>/ path swap.

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '..', 'docs', 'blog');
const OUT_FILE = path.join(__dirname, '..', 'docs', 'assets', 'js', 'blog-data.js');
const CANONICAL_LANG = 'en';

function collectPosts() {
  const posts = [];

  const sections = fs.readdirSync(BLOG_DIR).filter(name => {
    const full = path.join(BLOG_DIR, name);
    return fs.statSync(full).isDirectory() && !name.startsWith('.');
  });

  for (const section of sections.sort()) {
    const langDir = path.join(BLOG_DIR, section, CANONICAL_LANG);
    if (!fs.existsSync(langDir)) continue;

    const files = fs.readdirSync(langDir)
      .filter(f => f.endsWith('.html') && !f.startsWith('.'))
      .sort();

    for (const file of files) {
      posts.push(`blog/${section}/${CANONICAL_LANG}/${file}`);
    }
  }

  return posts;
}

const posts = collectPosts();

const lines = posts.map(p => `  "${p}",`).join('\n');
const output = `const POST_FILES = [\n${lines}\n];\n`;

fs.writeFileSync(OUT_FILE, output, 'utf8');
console.log(`blog-data.js updated — ${posts.length} post(s) across ${new Set(posts.map(p => p.split('/')[1])).size} section(s)`);
