// One-off migration helper. Extracts CSS/JS/body from a source HTML
// and emits artifacts for Astro migration.
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(__dirname, 'lp-formacao.html'), 'utf8');

// Extract first <style>...</style>
const styleMatch = src.match(/<style>([\s\S]*?)<\/style>/);
const scriptMatch = src.match(/<script>([\s\S]*?)<\/script>/);
const bodyMatch = src.match(/<body>([\s\S]*?)<\/body>/);

if (!styleMatch || !scriptMatch || !bodyMatch) {
  console.error('Missing one of style/script/body');
  process.exit(1);
}

let css = styleMatch[1];
let js = scriptMatch[1];
let body = bodyMatch[1];

// 1. CSS: remove @font-face blocks (already in global.css)
css = css.replace(/@font-face\s*\{[^}]*\}\s*/g, '');

// 2. CSS: remove the page-specific body { --page-... } block.
//    This is the block in lp-formacao that starts with the comment about palette.
//    We'll extract it separately for the page file.
const bodyPaletteMatch = css.match(
  /\/\*\s*Page-specific palette[^*]*\*\/\s*body\s*\{[\s\S]*?\n\s*\}/
);
let pageBodyTokens = '';
if (bodyPaletteMatch) {
  pageBodyTokens = bodyPaletteMatch[0];
  css = css.replace(bodyPaletteMatch[0], '');
}

// 3. Asset paths in CSS: add leading /
css = css.replace(/url\((['"])(?!https?:|\/|data:)([^'")]+)\1\)/g, "url($1/$2$1)");
css = css.replace(/url\((?!['"]|https?:|\/|data:)([^)]+)\)/g, "url(/$1)");

// 4. Body content: prefix asset references with /
//    Match src="something" and href="something" that don't start with /, http, #, mailto:
body = body.replace(/(src|href)=(['"])(?!https?:|\/|#|mailto:|tel:|data:)([^'"]+)\2/g, "$1=$2/$3$2");

// 5. Body: remove <script>...</script> blocks (we serve them via LpLayout from /scripts/lp.js)
body = body.replace(/<script[\s\S]*?<\/script>/g, '');

mkdirSync(join(__dirname, 'src/styles'), { recursive: true });
mkdirSync(join(__dirname, 'src/scripts'), { recursive: true });
mkdirSync(join(__dirname, 'src/pages'), { recursive: true });

writeFileSync(join(__dirname, 'src/styles/lp.css'), css.trim() + '\n');
writeFileSync(join(__dirname, '_migrate-body.html'), body.trim());
writeFileSync(join(__dirname, '_migrate-body-tokens.css'), pageBodyTokens.trim());

// Compose lp-formacao.astro
const astroPage = `---
import LpLayout from '../layouts/LpLayout.astro';
---

<LpLayout
  title="Formação em Gestalt-Terapia: Fundamentos e Técnicas — IMGT"
  description="Curso de Formação em Gestalt-Terapia com certificado de extensão universitária reconhecido pelo MEC. Instituto Mineiro de Gestalt-Terapia."
>
  <style is:global>
    ${pageBodyTokens.trim().split('\n').join('\n    ')}
  </style>

  ${body.trim().split('\n').join('\n  ')}
</LpLayout>
`;

writeFileSync(join(__dirname, 'src/pages/lp-formacao.astro'), astroPage);

console.log('lp.css:', css.length, 'bytes');
console.log('body:', body.length, 'bytes');
console.log('page body tokens:', pageBodyTokens.length, 'bytes');
console.log('lp-formacao.astro:', astroPage.length, 'bytes');
