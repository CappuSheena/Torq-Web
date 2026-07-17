import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1200 } });

page.on('console', (msg) => {
  if (msg.type() === 'error') console.log('CONSOLE ERROR:', msg.text());
});
page.on('pageerror', (err) => console.log('PAGE ERROR:', err.message));

const email = `legacyscan.${Date.now()}@example.com`;

await page.goto('http://localhost:5173/');
await page.getByRole('button', { name: /get started for free/i }).click();
await page.waitForTimeout(500);

await page.getByPlaceholder('Gordy').fill('Legacy Scan Tester');
await page.getByPlaceholder(/g1 1xq/i).fill('G1 1XQ');
await page.getByPlaceholder('name@email.com').fill(email);
await page.locator('input[type="password"]').fill('TestPass123!');
await page.getByRole('button', { name: /create account/i }).click();
await page.waitForTimeout(1500);

// Step 1: search and pick a real bike via live API Ninjas search
await page.locator('select').selectOption('Honda');
await page.getByPlaceholder(/search e.g. street triple/i).fill('cbf125');
await page.waitForTimeout(1500);
const firstResult = page.locator('button:has-text("CBF125")').first();
if (await firstResult.count() > 0) {
  await firstResult.click();
} else {
  console.log('No live search result, using manual entry fallback.');
  await page.getByRole('button', { name: /can't find your bike/i }).click();
  await page.getByPlaceholder(/street triple 765 r/i).fill('Test Model');
  await page.locator('input[type="number"]').first().fill('2020');
}
await page.getByRole('button', { name: /continue/i }).click();
await page.waitForTimeout(500);

// Step 2 (key dates): skip
await page.getByRole('button', { name: /skip for now/i }).click();
await page.waitForTimeout(1000);

console.log('After key dates skip, URL:', page.url());

await page.screenshot({ path: '_tmp_bike_flow.png', fullPage: true });
console.log('Screenshot saved.');

await browser.close();
