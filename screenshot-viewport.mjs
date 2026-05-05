import puppeteer from 'puppeteer';
import { mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || 'viewport';
const scrollY = parseInt(process.argv[4] || '0', 10);

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
await page.evaluate(() => new Promise(r => setTimeout(r, 800)));

// trigger reveals
await page.evaluate(async (targetY) => {
  const sh = document.body.scrollHeight;
  for (let y = 0; y < sh; y += window.innerHeight * 0.5) {
    window.scrollTo(0, y); await new Promise(r => setTimeout(r, 100));
  }
  window.scrollTo(0, targetY);
  await new Promise(r => setTimeout(r, 800));
}, scrollY);

await page.screenshot({ path: join(dir, filename), fullPage: false });
await browser.close();
console.log(`Saved: ${join(dir, filename)}`);
