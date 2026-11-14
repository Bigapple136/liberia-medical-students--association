// Desktop segment screenshots for review (not committed tooling).
// Usage: node .taste-skill/career-segments.mjs [round]
import { chromium } from 'playwright-core';
import fs from 'node:fs';

const BASE = process.env.BASE_URL || 'http://localhost:4173';
const ROUND = process.argv[2] || 'r1';
const PATH = process.argv[3] || '/academics/career-center';
const OUT = new URL(`./inspect/career-${ROUND}/`, import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`${BASE}${PATH}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);

const total = await page.evaluate(() => document.documentElement.scrollHeight);
let index = 0;
for (let y = 0; y < total; y += 900) {
  await page.evaluate((top) => window.scrollTo(0, top), y);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}desktop-${String(index).padStart(2, '0')}.png` });
  index += 1;
}
console.log(`captured ${index} segments, page height ${total}`);
await browser.close();
