const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }
  });

  const page = await context.newPage();

  // コンソールエラーをキャプチャ
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
  });

  // ページエラーをキャプチャ
  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
  });

  try {
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', {
      waitUntil: 'load',
      timeout: 30000
    });

    console.log('Waiting for JavaScript to load...');
    await page.waitForLoadState('networkidle', { timeout: 30000 });

    console.log('Waiting 2 seconds for content to fully load...');
    await page.waitForTimeout(2000);

    console.log('Taking screenshot...');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const screenshotPath = `screenshot_${timestamp}.png`;

    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
      type: 'png'
    });

    console.log('Screenshot saved to:', screenshotPath);
    console.log('URL:', 'http://localhost:3000');

  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await browser.close();
  }
})();
