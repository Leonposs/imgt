// For each LP page, extract the original hero-bg URL from the source HTML
// and inject a `.hero-bg { background-image: url(...) }` override into the
// page's <style is:global> block. This fixes the cascade collision caused
// by concatenating multiple LP CSS files into lp.css.
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const lps = [
  'lp-formacao', 'lp-ansiedade', 'lp-ciclo-de-contato', 'lp-curso-gratuito',
  'lp-depressao', 'lp-fenomenologia', 'lp-tdah', 'lp-teoria-do-self', 'lp-vicios'
];

for (const lp of lps) {
  const srcHtml = readFileSync(join(__dirname, `${lp}.html`), 'utf8');
  // The hero-bg rule contains a single background-image url to the LP's hero image
  // (the como-funciona-bg and cta-final-bg are identical across LPs, no override needed).
  const heroMatch = srcHtml.match(/\.hero-bg\s*\{[^}]*?background-image:\s*url\(['"]?([^'")]+)['"]?\)/);
  if (!heroMatch) {
    console.error(`${lp}: no hero-bg URL found`);
    continue;
  }
  const heroUrl = heroMatch[1].replace(/^\//, '');
  const astroPath = join(__dirname, `src/pages/${lp}.astro`);
  const astro = readFileSync(astroPath, 'utf8');

  // Inject override into the existing <style is:global> block, just after `body {` closes.
  const override = `\n    .hero-bg { background-image: url('/${heroUrl}'); }`;
  const updated = astro.replace(
    /(<style is:global>[\s\S]*?})\s*\n\s*<\/style>/,
    `$1${override}\n  </style>`
  );

  if (updated === astro) {
    console.error(`${lp}: didn't match style block`);
    continue;
  }

  writeFileSync(astroPath, updated);
  console.log(`${lp}: hero-bg = ${heroUrl}`);
}
