const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const url = process.env.APP_URL || 'http://localhost:5173';
  const outDir = path.resolve(process.cwd(), 'screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  console.log('Ouverture de', url);
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  await page.screenshot({ path: path.join(outDir, 'app_home.png'), fullPage: true });
  console.log('Screenshot: app_home.png');

  const startBtn = page.locator('button', { hasText: 'Commencer une consultation' });
  if (await startBtn.count() > 0) {
    await startBtn.click();
    await page.waitForTimeout(1200);
    await page.waitForSelector('textarea, input, .stepper', { timeout: 5000 }).catch(() => null);
    await page.screenshot({ path: path.join(outDir, 'app_initial_case.png'), fullPage: true });
    console.log('Screenshot: app_initial_case.png');
  } else {
    console.warn("Bouton 'Commencer une consultation' introuvable : capture uniquement de la page d'accueil.");
  }

  await browser.close();
  console.log('Terminé. Vérifiez le dossier ./screenshots');
})();
