// Committee page screenshots for design review. Writes into .taste-skill/inspect/,
// which is gitignored — the script is the thing worth keeping, not the captures.
// Usage: BASE_URL=http://localhost:5173 node .taste-skill/committee-shots.mjs [round] [path]
import { chromium } from 'playwright-core';
import fs from 'node:fs';

const BASE = process.env.BASE_URL || 'http://localhost:5173';
const ROUND = process.argv[2] || 'r1';
const PATH = process.argv[3] || '/leadership/committees/academic';
const OUT = new URL(`./inspect/committee-${ROUND}/`, import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: 'msedge', headless: true });

// Scroll the whole page so IntersectionObserver reveals fire, then return to
// the top — otherwise every section below the fold captures at opacity 0.
async function settle(page) {
  await page.waitForTimeout(2500); // fonts + stock photos
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += Math.round(height / 10)) {
    await page.evaluate(top => window.scrollTo(0, top), y);
    await page.waitForTimeout(220);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(900);
  return height;
}

for (const [name, width, height] of [
  ['desktop-1440', 1440, 900],
  ['mobile-390', 390, 844],
]) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(`${BASE}${PATH}`, { waitUntil: 'networkidle' });
  const total = await settle(page);
  await page.screenshot({ path: `${OUT}${name}-full.png`, fullPage: true });
  console.log(`saved ${OUT}${name}-full.png (page height ${total}px)`);

  // Viewport-sized segments: a 12-section full-page shot is unreadable as an
  // image, so both passes are also cut into screens for close reading.
  let index = 0;
  for (let y = 0; y < total; y += Math.round(height * 0.92)) {
    await page.evaluate(top => window.scrollTo(0, top), y);
    await page.waitForTimeout(450);
    await page.screenshot({ path: `${OUT}${name}-${String(index).padStart(2, '0')}.png` });
    index += 1;
  }
  console.log(`saved ${index} ${name} segments`);
  await page.close();
}

// Report what the page actually rendered, so a section that silently dropped
// out (no roster, no events, API offline) is visible in the run output.
const probe = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await probe.goto(`${BASE}${PATH}`, { waitUntil: 'networkidle' });
await settle(probe);
const outline = await probe.evaluate(() =>
  [...document.querySelectorAll('h1, h2')].map(node => `${node.tagName} ${node.textContent.trim().slice(0, 70)}`)
);
console.log(outline.join('\n'));
await browser.close();
