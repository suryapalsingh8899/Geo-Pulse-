const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 6000));
  const btn = await page.$('.btn-primary');
  if(btn) { await btn.click(); await new Promise(r => setTimeout(r, 10000)); }
  await browser.close();
})();
