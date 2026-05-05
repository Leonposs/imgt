import puppeteer from 'puppeteer';
import { mkdirSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const url = process.argv[2] || 'http://localhost:3000';
const selector = process.argv[3];
const label = process.argv[4] || 'zone';
const dir = join(__dirname, 'temporary screenshots');

mkdirSync(dir, { recursive: true });
const existing = readdirSync(dir).filter(f => f.startsWith('screenshot-'));
const nextNum = existing.length > 0
  ? Math.max(...existing.map(f => parseInt(f.match(/screenshot-(\d+)/)?.[1] || '0'))) + 1
  : 1;
const filename = `screenshot-${nextNum}-${label}.png`;

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
await page.evaluate(() => new Promise(r => setTimeout(r, 1200)));

const box = await page.evaluate((sel) => {
  const el = document.querySelector(sel);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { top: r.top + window.scrollY, height: r.height };
}, selector);

if (!box) { console.error('Selector not found'); process.exit(1); }

// Scroll to position so the top of section sits at viewport y=200 (we want to see transition + part of previous section)
await page.evaluate((y) => window.scrollTo(0, y - 100), box.top);
await new Promise(r => setTimeout(r, 800));

await page.screenshot({ path: join(dir, filename), fullPage: false });
await browser.close();
console.log(`Saved: ${join(dir, filename)}`);
