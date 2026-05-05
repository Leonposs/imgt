import puppeteer from 'puppeteer';
import { mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || 'mobile';
const dir = join(__dirname, 'temporary screenshots');
mkdirSync(dir, { recursive: true });

const existing = readdirSync(dir).filter(f => f.startsWith('screenshot-'));
const nextNum = existing.length > 0
  ? Math.max(...existing.map(f => parseInt(f.match(/screenshot-(\d+)/)?.[1] || '0'))) + 1
  : 1;
const filename = `screenshot-${nextNum}-${label}.png`;

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
await page.evaluate(() => new Promise(r => setTimeout(r, 1500)));
await page.evaluate(async () => {
  const scrollHeight = document.body.scrollHeight;
  const vh = window.innerHeight;
  for (let y = 0; y < scrollHeight; y += vh * 0.5) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 200));
  }
  window.scrollTo(0, 0);
  await new Promise(r => setTimeout(r, 800));
});
await page.screenshot({ path: join(dir, filename), fullPage: true });
await browser.close();
console.log(`Saved: ${join(dir, filename)}`);
