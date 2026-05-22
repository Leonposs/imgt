// Lighthouse local — auditoria de performance/accessibility/best-practices/seo.
// Uso:
//   node lighthouse.mjs                          -> audita http://localhost:3000 (mobile)
//   node lighthouse.mjs http://localhost:3000/cursos.html
//   node lighthouse.mjs http://localhost:3000 desktop
//
// Saída:
//   lighthouse-reports/<timestamp>-<slug>-<formfactor>.html  (relatório navegável)
//   lighthouse-reports/<timestamp>-<slug>-<formfactor>.json  (dados crus)
//   Console: scores + top 5 oportunidades + top 5 diagnósticos.

import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const url        = process.argv[2] || 'http://localhost:3000';
const formFactor = (process.argv[3] || 'mobile').toLowerCase();

const dir = join(__dirname, 'lighthouse-reports');
mkdirSync(dir, { recursive: true });

const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const slug = url.replace(/^https?:\/\//, '').replace(/[^a-zA-Z0-9]+/g, '_').replace(/_+$/, '') || 'root';
const base = `${ts}-${slug}-${formFactor}`;

console.log(`\n▸ Auditando ${url} (${formFactor})...\n`);

const chrome = await chromeLauncher.launch({
  chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
});

const config = {
  extends: 'lighthouse:default',
  settings: {
    formFactor,
    screenEmulation: formFactor === 'desktop'
      ? { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false }
      : { mobile: true,  width: 412,  height: 823, deviceScaleFactor: 1.75, disabled: false },
    throttling: formFactor === 'desktop'
      ? { rttMs: 40,  throughputKbps: 10240, cpuSlowdownMultiplier: 1, requestLatencyMs: 0, downloadThroughputKbps: 0, uploadThroughputKbps: 0 }
      : { rttMs: 150, throughputKbps: 1638.4, cpuSlowdownMultiplier: 4, requestLatencyMs: 0, downloadThroughputKbps: 0, uploadThroughputKbps: 0 },
  },
};

const result = await lighthouse(url, { port: chrome.port, output: ['html', 'json'], logLevel: 'error' }, config);
await chrome.kill();

const [htmlReport, jsonReport] = result.report;
writeFileSync(join(dir, `${base}.html`), htmlReport);
writeFileSync(join(dir, `${base}.json`), jsonReport);

const lhr = result.lhr;
const score = (key) => {
  const c = lhr.categories[key];
  return c ? Math.round(c.score * 100) : '—';
};

const fmt = (n, w = 3) => String(n).padStart(w);

console.log('─'.repeat(60));
console.log(`  PERFORMANCE   ${fmt(score('performance'))}`);
console.log(`  ACCESSIBILITY ${fmt(score('accessibility'))}`);
console.log(`  BEST PRACTICES${fmt(score('best-practices'))}`);
console.log(`  SEO           ${fmt(score('seo'))}`);
console.log('─'.repeat(60));

// Core Web Vitals
const metrics = lhr.audits;
const ms = (key) => metrics[key]?.displayValue || '—';
console.log(`  LCP  ${ms('largest-contentful-paint')}`);
console.log(`  CLS  ${ms('cumulative-layout-shift')}`);
console.log(`  TBT  ${ms('total-blocking-time')}`);
console.log(`  FCP  ${ms('first-contentful-paint')}`);
console.log(`  Speed Index  ${ms('speed-index')}`);
console.log('─'.repeat(60));

// Top oportunidades (potential savings)
const opportunities = Object.values(metrics)
  .filter((a) => a.details?.type === 'opportunity' && a.numericValue > 0)
  .sort((a, b) => (b.numericValue || 0) - (a.numericValue || 0))
  .slice(0, 5);

if (opportunities.length) {
  console.log('  TOP OPORTUNIDADES (estimativa de ganho):');
  opportunities.forEach((a) => {
    const saving = a.displayValue || `${Math.round(a.numericValue)}ms`;
    console.log(`   · ${a.title.padEnd(50).slice(0, 50)} ${saving}`);
  });
  console.log('─'.repeat(60));
}

// Top diagnósticos (problemas detectados, sem ganho estimado direto)
const diagnostics = Object.values(metrics)
  .filter((a) => a.score !== null && a.score < 0.9 && a.details?.type && a.details.type !== 'opportunity')
  .sort((a, b) => (a.score ?? 1) - (b.score ?? 1))
  .slice(0, 5);

if (diagnostics.length) {
  console.log('  TOP DIAGNÓSTICOS (qualidade abaixo do ideal):');
  diagnostics.forEach((a) => {
    console.log(`   · ${a.title.padEnd(50).slice(0, 50)} score ${Math.round((a.score || 0) * 100)}`);
  });
  console.log('─'.repeat(60));
}

console.log(`\n  Relatório completo: lighthouse-reports/${base}.html`);
console.log(`  Dados crus:         lighthouse-reports/${base}.json\n`);
