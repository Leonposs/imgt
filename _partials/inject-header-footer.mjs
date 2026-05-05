import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const css   = readFileSync(join(__dirname, 'header-footer.css'), 'utf8');
const head  = readFileSync(join(__dirname, 'header.html'), 'utf8');
const foot  = readFileSync(join(__dirname, 'footer.html'), 'utf8');

// Each entry maps a file to:
//   nav     - data-nav value to mark aria-current="page" on
//   strip   - optional regex to remove an existing custom mini-header before injection
const targets = [
  {
    file: 'sobre.html',
    nav: 'sobre',
    strip: /\s*<!--\s*Top nav minimal\s*-->\s*<header class="relative z-20[\s\S]*?<\/header>\s*/m,
  },
  { file: 'contato.html',                nav: 'contato' },
  { file: 'cursos.html',                 nav: 'cursos' },
  { file: 'palestras.html',              nav: 'palestras' },
  { file: 'supervisao.html',             nav: 'supervisao' },
  { file: 'atendimento.html',            nav: 'atendimento' },
];

const STAMP_BEGIN = '<!-- @@HEADER-FOOTER:BEGIN @@ -->';
const STAMP_END   = '<!-- @@HEADER-FOOTER:END @@ -->';

// Mark aria-current="page" on the matching nav item
function applyCurrent(headerHtml, navKey) {
  if (!navKey) return headerHtml;
  // Add aria-current="page" to all elements with data-nav="navKey"
  const re = new RegExp(`(data-nav="${navKey}"[^>]*?)>`, 'g');
  return headerHtml.replace(re, '$1 aria-current="page">');
}

// Mark the legal link "Política de Privacidade" — done only on that page (handled separately, skipped here)
for (const t of targets) {
  const path = join(ROOT, t.file);
  const orig = readFileSync(path, 'utf8');
  // Backup once
  const backupPath = path + '.bak-headerfooter';
  try { writeFileSync(backupPath, orig, { flag: 'wx' }); } catch (_) { /* already exists */ }

  let html = orig;

  // 1) Strip optional custom mini-header
  if (t.strip) {
    html = html.replace(t.strip, '\n');
  }

  // 2) Inject CSS right before </style> (first </style> after :root vars)
  if (!html.includes('.site-header {')) {
    html = html.replace(/(\n\s*)<\/style>/, `\n\n${css}\n$1</style>`);
  }

  // 3) Inject header HTML right after <body...>
  const headerWithCurrent = applyCurrent(head, t.nav);
  if (!html.includes('<header class="site-header"')) {
    html = html.replace(/(<body[^>]*>)/, `$1\n\n${STAMP_BEGIN}\n${headerWithCurrent}\n${STAMP_END}\n`);
  }

  // 4) Inject footer HTML right before </body>
  if (!html.includes('<footer class="site-footer"')) {
    html = html.replace(/<\/body>/, `\n${STAMP_BEGIN}\n${foot}\n${STAMP_END}\n</body>`);
  }

  if (html === orig) {
    console.log(`[skip] ${t.file} — already has site-header/footer`);
    continue;
  }

  writeFileSync(path, html, 'utf8');
  console.log(`[ok]   ${t.file} — header + footer injected${t.nav ? ` (current=${t.nav})` : ''}`);
}
