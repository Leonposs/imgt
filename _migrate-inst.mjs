// One-off migration for institutional pages (index, atendimento, etc).
// Wraps the original body in InstitutionalLayout. Custom CSS goes inline
// as <style is:global>. JS stays as <script is:inline>.
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcFile = process.argv[2];
if (!srcFile) {
  console.error('Usage: node _migrate-inst.mjs <source.html>');
  process.exit(1);
}

const src = readFileSync(join(__dirname, srcFile), 'utf8');

// Extract title and description from head
const titleMatch = src.match(/<title>([^<]+)<\/title>/);
const descMatch = src.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/);

// All <style>...</style> in head
const styleMatches = [...src.matchAll(/<style>([\s\S]*?)<\/style>/g)];
let css = styleMatches.map(m => m[1]).join('\n\n');

// Inline JS scripts (no src=, no type or type=text/javascript) — concat as one block.
// JSON-LD and other non-JS scripts are kept separately so we can re-emit them verbatim.
const allInlineScripts = [...src.matchAll(/<script((?:(?!\bsrc=)[^>])*)>([\s\S]*?)<\/script>/g)];
let inlineJs = '';
const otherScripts = []; // [{ attrs, content }]
for (const m of allInlineScripts) {
  const attrs = m[1].trim();
  const content = m[2];
  const typeMatch = attrs.match(/\btype=["']([^"']+)["']/);
  const type = typeMatch?.[1];
  if (!type || type === 'text/javascript' || type === 'module') {
    inlineJs += content + '\n\n';
  } else {
    otherScripts.push({ attrs, content });
  }
}

const bodyMatch = src.match(/<body[^>]*>([\s\S]*?)<\/body>/);
if (!bodyMatch) {
  console.error('No <body> found');
  process.exit(1);
}
let body = bodyMatch[1];

// 1. CSS: drop duplicate @font-face (already in global.css)
css = css.replace(/@font-face\s*\{[^}]*\}\s*/g, '');

// 2. CSS: drop duplicate :root font-size declaration that already exists in global.css.
//    Keep the page's :root because it may have other tokens.

// 3. CSS asset paths
css = css.replace(/url\((['"])(?!https?:|\/|data:)([^'")]+)\1\)/g, "url($1/$2$1)");
css = css.replace(/url\((?!['"]|https?:|\/|data:)([^)]+)\)/g, "url(/$1)");

// 4. Body: prefix asset references with /
body = body.replace(/(src|href)=(['"])(?!https?:|\/|#|mailto:|tel:|data:)([^'"]+)\2/g, "$1=$2/$3$2");

// 5. Body: remove all <script src="..."> blocks (we don't want duplicate JS).
//    Keep inline <script>...</script> (will be moved to LpLayout-equivalent).
body = body.replace(/<script[^>]*src=[^>]*>[\s\S]*?<\/script>/g, '');
//    Also strip inline scripts from body since we'll emit them at the end.
body = body.replace(/<script[\s\S]*?<\/script>/g, '');

const pageName = basename(srcFile, '.html');
const outPath = join(__dirname, `src/pages/${pageName}.astro`);

const title = (titleMatch?.[1] || pageName).replace(/"/g, '\\"');
const description = (descMatch?.[1] || '').replace(/"/g, '\\"');

mkdirSync(join(__dirname, 'src/pages'), { recursive: true });

const astroPage = `---
import InstitutionalLayout from '../layouts/InstitutionalLayout.astro';
---

<InstitutionalLayout
  title="${title}"${description ? `\n  description="${description}"` : ''}
>
  <style is:global>
    ${css.trim().split('\n').join('\n    ')}
  </style>

  ${body.trim().split('\n').join('\n  ')}

  <script is:inline>
    ${inlineJs.trim().split('\n').join('\n    ')}
  </script>
${otherScripts.map(s => `\n  <script ${s.attrs} is:inline>${s.content}</script>`).join('')}
</InstitutionalLayout>
`;

writeFileSync(outPath, astroPage);

console.log(`${pageName}.astro:`, astroPage.length, 'bytes');
console.log('  css:', css.length, 'body:', body.length, 'inline js:', inlineJs.length);
