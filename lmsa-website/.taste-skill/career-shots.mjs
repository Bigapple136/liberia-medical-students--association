// Screenshot harness for the design look-and-fix loop (not committed tooling).
// Usage: node .taste-skill/career-shots.mjs [round]
import { chromium } from 'playwright-core';
import fs from 'node:fs';

const BASE = process.env.BASE_URL || 'http://localhost:4173';
const ROUND = process.argv[2] || 'r1';
const OUT = new URL(`./inspect/career-${ROUND}/`, import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
fs.mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  ['desktop-1440', 1440, 900],
  ['tablet-768', 768, 1024],
  ['mobile-390', 390, 844],
];

const browser = await chromium.launch({ channel: 'msedge', headless: true });
for (const [name, width, height] of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(`${BASE}/academics/career-center`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500); // fonts + unsplash images settle
  await page.screenshot({ path: `${OUT}${name}.png`, fullPage: true });
  await page.close();
  console.log(`saved ${OUT}${name}.png`);
}
await browser.close();
