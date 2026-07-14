// LE PARCOURS PUBLIC : un parent dépose une candidature avec une photo lourde →
// la photo est compressée, le dossier PERSISTE, le reçu dit vrai — et la
// direction la retrouve dans Inscriptions ET dans « À décider ».
// (C'est le parcours qui a perdu deux vraies candidatures le 2026-07-14.)
import { scenario } from './lib.mjs'

await scenario(8981, async ({ page, ok, login, base }) => {
  await page.goto(`${base}/#/inscription`)
  await page.getByPlaceholder('Adam Ben Salah').fill('Hammouda Test')
  await page.locator('input[type=date]').fill('2021-03-10')
  await page.getByRole('button', { name: 'Maternelle 1', exact: true }).click()
  await page.getByPlaceholder('Karim Ben Salah').fill('Othman Ounis')
  await page.getByPlaceholder('+216 20 000 000').fill('30359449')
  await page.evaluate(async () => {          // une « photo de téléphone » de ~2 Mo
    const c = document.createElement('canvas'); c.width = 3000; c.height = 2000
    const g = c.getContext('2d')
    for (let i = 0; i < 4000; i++) { g.fillStyle = `rgb(${Math.random()*255|0},${Math.random()*255|0},${Math.random()*255|0})`; g.fillRect(Math.random()*3000, Math.random()*2000, 60, 60) }
    const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', 0.99))
    const dt = new DataTransfer(); dt.items.add(new File([blob], 'acte.jpg', { type: 'image/jpeg' }))
    const input = document.querySelectorAll('input[type=file]')[0]
    input.files = dt.files; input.dispatchEvent(new Event('change', { bubbles: true }))
  })
  await page.waitForTimeout(1200)
  await page.getByRole('button', { name: /Envoyer ma candidature/ }).click()
  await page.waitForTimeout(600)
  ok(await page.getByText('Candidature reçue.').count() === 1, 'reçu affiché')
  const p = await page.evaluate(() => {
    const d = JSON.parse(localStorage.getItem('coreon_db'))
    const a = d?.applications?.find(x => x.childName === 'Hammouda Test')
    return a ? { stage: a.stage, files: a.files.length, size: (a.files[0]?.data || '').length } : null
  })
  ok(p && p.stage === 'nouvelle' && p.files === 1, `candidature persistée avec sa pièce (${JSON.stringify(p)})`)
  ok(p && p.size > 0 && p.size < 1_200_000, 'photo compressée avant stockage')

  await login('direction@alnour.tn', 'admin')
  ok(page.url().includes('#/app'), 'connexion direction')
  ok(await page.getByText('À décider').count() >= 1, 'l’atelier est là')
  ok(await page.getByText(/candidature(s)? reçue(s)? à ouvrir/).count() >= 1, 'la décision « à ouvrir » est allumée')
  await page.goto(`${base}/#/app/admissions`); await page.waitForTimeout(600)
  ok(await page.getByText('Hammouda Test').count() >= 1, 'la candidature est chez la direction')
})
