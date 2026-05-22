// Extracts the LP-specific :root surface tokens AND hero-bg URL from each
// original LP HTML, then injects them into the page's <style is:global> block
// so the cascade collisions caused by concatenating LP CSS files into lp.css
// don't override per-page colors/images.
//
// Idempotent: replaces previous injection sentinels if re-run.
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const lps = [
  'lp-formacao', 'lp-ansiedade', 'lp-ciclo-de-contato', 'lp-curso-gratuito',
  'lp-depressao', 'lp-fenomenologia', 'lp-tdah', 'lp-teoria-do-self', 'lp-vicios'
];

// Per-page surface tokens that diverge between LPs.
// Other --color-text-* tokens are identical across all LPs, so they stay in lp.css.
const PER_PAGE_TOKENS = [
  '--color-bg',
  '--color-bg-elevated',
  '--color-bg-dark',
  '--color-text-inverted'
];

const SENTINEL_START = '/* === Per-page surface tokens (injected) === */';
const SENTINEL_END   = '/* === End per-page surface tokens === */';

for (const lp of lps) {
  const srcHtml = readFileSync(join(__dirname, `${lp}.html`), 'utf8');

  // Extract LP :root block
  const rootMatch = srcHtml.match(/:root\s*\{([\s\S]*?)\}/);
  if (!rootMatch) {
    console.error(`${lp}: no :root block`);
    continue;
  }
  const rootBody = rootMatch[1];

  const tokenLines = [];
  for (const tok of PER_PAGE_TOKENS) {
    const re = new RegExp(`${tok}:\\s*([^;]+);`);
    const m = rootBody.match(re);
    if (m) tokenLines.push(`      ${tok}: ${m[1].trim()};`);
  }

  // Extract hero-bg URL
  const heroMatch = srcHtml.match(/\.hero-bg\s*\{[^}]*?background-image:\s*url\(['"]?([^'")]+)['"]?\)/);
  const heroUrl = heroMatch ? heroMatch[1].replace(/^\//, '') : null;

  // Build injection block
  const injection = [
    `    ${SENTINEL_START}`,
    `    body {`,
    ...tokenLines,
    `    }`,
    heroUrl ? `    .hero-bg { background-image: url('/${heroUrl}'); }` : null,
    `    ${SENTINEL_END}`
  ].filter(Boolean).join('\n');

  // Read current .astro
  const astroPath = join(__dirname, `src/pages/${lp}.astro`);
  let astro = readFileSync(astroPath, 'utf8');

  // If sentinel already exists, replace it
  const sentinelRe = new RegExp(
    `\\s*${SENTINEL_START.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}[\\s\\S]*?${SENTINEL_END.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}`
  );
  if (sentinelRe.test(astro)) {
    astro = astro.replace(sentinelRe, '\n' + injection);
  } else {
    // Insert before the closing </style> of the FIRST <style is:global> block
    astro = astro.replace(
      /(<style is:global>[\s\S]*?)(\n\s*<\/style>)/,
      `$1\n${injection}$2`
    );
  }

  writeFileSync(astroPath, astro);
  console.log(`${lp}: ${tokenLines.length} tokens + ${heroUrl ? 'hero-bg' : 'no-hero-bg'}`);
}
