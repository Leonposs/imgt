// Screenshot em viewport customizado — útil pra avaliar escala fluida em 1440/1920/2560/3440.
// Uso: node screenshot-wide.mjs [width] [height] [label] [url]
import puppeteer from 'puppeteer';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const width  = parseInt(process.argv[2] || '2560', 10);
const height = parseInt(process.argv[3] || '1440', 10);
const label  = process.argv[4] || `${width}x${height}`;
const url    = process.argv[5] || 'http://localhost:3000';

const dir = join(__dirname, 'temporary screenshots');
mkdirSync(dir, { recursive: true });
const filename = `screenshot-${label}.png`;

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width, height, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 20000 });
await page.evaluate(() => new Promise(r => setTimeout(r, 1200)));

await page.evaluate(async () => {
  const sh = document.body.scrollHeight;
  for (let y = 0; y < sh; y += window.innerHeight * 0.5) {
    window.scrollTo(0, y); await new Promise(r => setTimeout(r, 100));
  }
  window.scrollTo(0, 0);
  await new Promise(r => setTimeout(r, 600));
});

await page.screenshot({ path: join(dir, filename), fullPage: false });
await browser.close();
console.log(`Saved: ${filename}`);
