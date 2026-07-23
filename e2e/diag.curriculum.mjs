// DIAGNOSTIC — CR-024 : le curriculum (matières + barème) suit le pays.
import { chromium } from 'playwright-core'
import { findChrome, serveDist } from './lib.mjs'

const PORT = 8994
const server = serveDist(PORT)
const browser = await chromium.launch({ executablePath: findChrome() })
const page = await (await browser.newContext({ viewport: { width: 1440, height: 950 } })).newPage()
const B = `http://localhost:${PORT}`
const errs = []; page.on('pageerror', e => errs.push(e.message))
const ok = (c, m) => console.log((c ? 'PASS' : 'FAIL') + ' — ' + m)

console.log('\n══ CURRICULUM PAR PAYS (CR-024) ══\n')

const login = async () => {
  await page.goto(`${B}/#/login`); await page.evaluate(() => sessionStorage.clear())
  await page.goto(`${B}/#/login`); await page.waitForSelector('input')
  await page.locator('input').first().fill('direction@alnour.tn')
  await page.locator('input[type=password]').fill('admin')
  await page.keyboard.press('Enter'); await page.waitForTimeout(1500)
}
const openGrid = async () => {
  await page.goto(`${B}/#/app/academic`); await page.waitForTimeout(1000)
  // ouvrir une classe de primaire dans la grille
  const carte = () => page.locator('div').filter({ hasText: /^Noter toute une classe/ }).last()
  const n = await carte().locator('button').count()
  for (let i = 0; i < n; i++) {
    await carte().locator('button').nth(i).click(); await page.waitForTimeout(700)
    if (await page.locator('input[data-cell]').count() > 0) return true   // primaire
    const back = page.locator('button:has-text("Tous les élèves")'); if (await back.count()) { await back.click(); await page.waitForTimeout(500) }
  }
  return false
}

// ── Tunisie (défaut) : matières FR, noté /20
await login()
ok(await openGrid(), 'grille de primaire ouverte (Tunisie)')
let head = await page.locator('thead').innerText()
ok(/Français|Arabe|Mathématiques/.test(head), 'Tunisie : matières en français au programme')
ok(/\/20/.test(head), 'Tunisie : barème /20')
ok(!/English|Islamic/.test(head), 'pas de matières du Golfe')

// ── Basculer en Bahreïn
await page.goto(`${B}/#/app/settings`); await page.waitForTimeout(800)
await page.locator('button:has-text("Localisation")').first().click(); await page.waitForTimeout(400)
await page.locator('select').filter({ hasText: /Bahreïn/ }).first().selectOption({ label: 'Bahreïn' }); await page.waitForTimeout(300)
await page.locator('button:has-text("Enregistrer")').first().click(); await page.waitForTimeout(1500)

ok(await openGrid(), 'grille de primaire ouverte (Bahreïn)')
head = await page.locator('thead').innerText()
ok(/English|Mathematics|Islamic/.test(head), 'Bahreïn : matières locales (English, Mathematics, Islamic Studies)')
ok(/\/100/.test(head), 'Bahreïn : barème /100')
ok(!/Français/.test(head), 'les matières tunisiennes ont disparu')

ok(errs.length === 0, `aucune exception JS (${errs.length})`)
if (errs.length) console.log(errs.slice(0, 3).join('\n'))
await browser.close(); server.close()
