const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const url = process.env.STUDIO_URL || 'http://localhost:8080';
  const outDir = path.resolve(process.cwd(), 'screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  console.log('Ouverture de', url);
  await page.goto(url, { waitUntil: 'networkidle' });

  // Capture de la page d'accueil/studio
  await page.screenshot({ path: path.join(outDir, 'studio_home.png'), fullPage: true });
  console.log('Screenshot: studio_home.png');

  // Attendre un peu pour permettre l'UI de charger dynamiquement
  await page.waitForTimeout(1200);

  // Tentative générique : capture de la zone principale (peut nécessiter adaptation)
  try {
    await page.screenshot({ path: path.join(outDir, 'studio_graph.png'), fullPage: true });
    console.log('Screenshot: studio_graph.png');
  } catch (e) {
    console.warn('Échec capture supplémentaire — ajustez les sélecteurs si nécessaire:', e.message);
  }

  await browser.close();
  console.log('Terminé. Vérifiez le dossier ./screenshots');
})();
