// L'ARABE EST UNE DIRECTION : bascule ع → dir=rtl, Tajawal, barre à droite,
// une candidature déposée entièrement en arabe arrive chez la direction.
import { scenario } from './lib.mjs'

await scenario(8983, async ({ page, ok, login, base }) => {
  await page.goto(`${base}/#/login`); await page.waitForTimeout(800)
  await page.getByRole('button', { name: 'ع' }).click(); await page.waitForTimeout(1200)
  ok(await page.evaluate(() => document.documentElement.dir) === 'rtl', 'dir=rtl sur <html>')
  ok((await page.evaluate(() => getComputedStyle(document.body).fontFamily)).includes('Tajawal'), 'Tajawal actif')
  ok((await page.locator('body').innerText()).includes('مرحبًا بعودتك'), 'connexion en arabe')

  await page.goto(`${base}/#/inscription`); await page.waitForTimeout(700)
  await page.locator('input').first().fill('آدم بن صالح')
  await page.locator('input[type=date]').fill('2021-05-05')
  await page.getByRole('button', { name: 'روضة 1' }).click()
  await page.locator('input').nth(2).fill('صالح بن صالح')
  await page.locator('input').nth(3).fill('36000000')
  await page.getByRole('button', { name: /إرسال المطلب/ }).click(); await page.waitForTimeout(600)
  ok((await page.locator('body').innerText()).includes('تم استلام المطلب'), 'reçu en arabe')

  await login('direction@alnour.tn', 'admin')
  const t = await page.locator('body').innerText()
  ok(t.includes('لوحة المتابعة'), 'barre latérale en arabe')
  const aside = await page.locator('aside').boundingBox()
  ok(aside && aside.x > 600, `barre latérale à droite (x=${Math.round(aside?.x)})`)
  await page.goto(`${base}/#/app/admissions`); await page.waitForTimeout(600)
  ok((await page.locator('body').innerText()).includes('آدم بن صالح'), 'la candidature arabe est chez la direction')
  await page.getByRole('button', { name: 'FR' }).first().click(); await page.waitForTimeout(1200)
  ok(await page.evaluate(() => document.documentElement.dir) === 'ltr', 'retour FR propre')
})
