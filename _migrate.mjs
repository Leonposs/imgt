// Migration helper for landing pages (LPs).
// Usage: node _migrate.mjs <source.html> [--update-lp-css]
//
// Without --update-lp-css: emits <name>.astro using LpLayout (uses existing lp.css).
// With --update-lp-css: also appends any new CSS rules to src/styles/lp.css.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcFile = process.argv[2];
const updateCss = process.argv.includes('--update-lp-css');
if (!srcFile) {
  console.error('Usage: node _migrate.mjs <source.html> [--update-lp-css]');
  process.exit(1);
}

const src = readFileSync(join(__dirname, srcFile), 'utf8');

const titleMatch = src.match(/<title>([^<]+)<\/title>/);
const descMatch = src.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/);
const styleMatch = src.match(/<style>([\s\S]*?)<\/style>/);
const bodyMatch = src.match(/<body[^>]*>([\s\S]*?)<\/body>/);

if (!styleMatch || !bodyMatch) {
  console.error('Missing <style> or <body>');
  process.exit(1);
}

let css = styleMatch[1];
let body = bodyMatch[1];

// 1. CSS: drop duplicate @font-face (already in global.css)
css = css.replace(/@font-face\s*\{[^}]*\}\s*/g, '');

// 2. Extract per-page body palette block
const bodyPaletteMatch = css.match(
  /\/\*\s*Page-specific palette[^*]*\*\/\s*body\s*\{[\s\S]*?\n\s*\}/
);
let pageBodyTokens = '';
if (bodyPaletteMatch) {
  pageBodyTokens = bodyPaletteMatch[0];
  css = css.replace(bodyPaletteMatch[0], '');
}

// 3. CSS asset paths
css = css.replace(/url\((['"])(?!https?:|\/|data:)([^'")]+)\1\)/g, "url($1/$2$1)");
css = css.replace(/url\((?!['"]|https?:|\/|data:)([^)]+)\)/g, "url(/$1)");

// 4. Body asset paths
body = body.replace(/(src|href)=(['"])(?!https?:|\/|#|mailto:|tel:|data:)([^'"]+)\2/g, "$1=$2/$3$2");

// 5. Strip <script> blocks from body (we serve them via LpLayout → /scripts/lp.js)
body = body.replace(/<script[\s\S]*?<\/script>/g, '');

// 6. If --update-lp-css: append the full CSS verbatim to lp.css.
//    Duplicate rules are harmless (cascade collapses identical declarations);
//    new selectors (e.g. .sobre-curso, .aprender) get added automatically.
//    Smart-merging top-level rules is fragile (keyframes/media-query nesting),
//    so we just concat with a marker comment.
const lpCssPath = join(__dirname, 'src/styles/lp.css');
if (updateCss && existsSync(lpCssPath)) {
  const existingCss = readFileSync(lpCssPath, 'utf8');
  const marker = `/* === Merged from ${basename(srcFile)} === */`;
  if (!existingCss.includes(marker)) {
    writeFileSync(lpCssPath, existingCss + `\n\n${marker}\n` + css.trim() + '\n');
    console.log(`Appended ${css.length} bytes of CSS from ${srcFile}`);
  } else {
    console.log(`Already merged ${srcFile}`);
  }
}

// 7. Compose .astro page
const pageName = basename(srcFile, '.html');
const title = (titleMatch?.[1] || pageName).replace(/"/g, '\\"');
const description = (descMatch?.[1] || '').replace(/"/g, '\\"');

mkdirSync(join(__dirname, 'src/pages'), { recursive: true });

const astroPage = `---
import LpLayout from '../layouts/LpLayout.astro';
---

<LpLayout
  title="${title}"${description ? `\n  description="${description}"` : ''}
>
  <style is:global>
    ${pageBodyTokens.trim().split('\n').join('\n    ')}
  </style>

  ${body.trim().split('\n').join('\n  ')}
</LpLayout>
`;

writeFileSync(join(__dirname, `src/pages/${pageName}.astro`), astroPage);

console.log(`${pageName}.astro:`, astroPage.length, 'bytes');
