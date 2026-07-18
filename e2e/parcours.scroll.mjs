import { scenario } from './lib.mjs'

// LE BUG D'OTHMAN (2026-07-18) : depuis le bas d'une longue page, cliquer une
// entrée de la barre latérale (« Demandes ») ouvrait la nouvelle page à
// mi-hauteur — il fallait remonter à la main pour voir son titre. Le contenu
// défile avec la FENÊTRE, et le routeur ne remet pas le défilement à zéro.
// Corrigé par <ScrollToTop/>. Ce parcours le verrouille.
scenario(8994, async ({ page, ok, login, base }) => {
  await login('direction@alnour.tn', 'admin')

  // Une longue page (le répertoire des 121 élèves), défilée vers le bas.
  await page.goto(`${base}/#/app/students`); await page.waitForTimeout(1300)
  await page.evaluate(() => window.scrollTo(0, 2500)); await page.waitForTimeout(250)
  const before = await page.evaluate(() => Math.round(window.scrollY))
  ok(before > 150, `la page défile vers le bas (scrollY=${before})`)

  // On clique « Demandes » DANS la barre latérale (ciblé par son lien, sans
  // ambiguïté avec le titre de section « Élèves & familles »).
  await page.locator('aside a[href$="/app/requests"]').click()
  await page.waitForTimeout(700)
  ok(/\/app\/requests/.test(page.url()), `la navigation a ouvert Demandes (${page.url()})`)

  const after = await page.evaluate(() => Math.round(window.scrollY))
  ok(after < 5, `la nouvelle page s'ouvre EN HAUT, sans remonter à la main (scrollY=${after})`)

  // Et l'inverse : défiler puis revenir aux Élèves — toujours en haut.
  await page.evaluate(() => window.scrollTo(0, 1500)); await page.waitForTimeout(200)
  await page.locator('aside a[href$="/app/students"]').click()
  await page.waitForTimeout(800)
  const after2 = await page.evaluate(() => Math.round(window.scrollY))
  ok(after2 < 5, `retour vers Élèves aussi en haut (scrollY=${after2})`)
})
