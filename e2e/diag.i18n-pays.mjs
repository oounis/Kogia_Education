// DIAGNOSTIC — CR-002/003/004/005 : le produit cesse de supposer la Tunisie.
import { chromium } from 'playwright-core'
import { findChrome, serveDist } from './lib.mjs'

const PORT = 8990
const server = serveDist(PORT)
const browser = await chromium.launch({ executablePath: findChrome() })
const page = await (await browser.newContext({ viewport: { width: 1440, height: 950 } })).newPage()
const B = `http://localhost:${PORT}`
const errs = []; page.on('pageerror', e => errs.push(e.message))
const ok = (c, m) => console.log((c ? 'PASS' : 'FAIL') + ' — ' + m)

console.log('\n══ INTERNATIONALISATION ══\n')

// ── CR-002 / CR-003 : la page d'accueil
await page.goto(`${B}/#/`); await page.waitForTimeout(900)
const nav = await page.locator('nav').first().innerText()
ok(!/Deux mondes/.test(nav), 'le libellé obscur « Deux mondes » a disparu du menu')
ok(/Crèche & primaire/.test(nav), 'remplacé par « Crèche & primaire », clair')
const body = await page.locator('body').innerText()
ok(/€\s?79|€79/.test(body), 'les tarifs sont en euros')
ok(!/TND/.test(body), 'plus aucun TND sur la page d’accueil')

// ── CR-004/005 : le pays pilote régions + pièce d'identité + loi
await page.goto(`${B}/#/login`); await page.evaluate(() => sessionStorage.clear())
await page.goto(`${B}/#/login`); await page.waitForSelector('input')
await page.locator('input').first().fill('direction@alnour.tn')
await page.locator('input[type=password]').fill('admin')
await page.keyboard.press('Enter'); await page.waitForTimeout(1600)

// Tunisie par défaut : le champ élève dit « Gouvernorat »
await page.goto(`${B}/#/app/students`); await page.waitForTimeout(900)
await page.locator('button:has-text("Nouvel élève"), button:has-text("Inscrire"), button:has-text("Ajouter")').first().click().catch(() => {})
await page.waitForTimeout(700)
let modal = await page.locator('body').innerText()
ok(/Gouvernorat/.test(modal), 'par défaut (Tunisie) : le champ région dit « Gouvernorat »')
await page.keyboard.press('Escape'); await page.waitForTimeout(400)

// passer en France dans les paramètres
await page.goto(`${B}/#/app/settings`); await page.waitForTimeout(900)
await page.locator('button:has-text("Localisation"), [role=tab]:has-text("Localisation")').first().click().catch(() => {})
await page.waitForTimeout(500)
const paysSel = page.locator('select').filter({ hasText: /Tunisie|France|International/ }).first()
ok(await paysSel.count() > 0, 'un sélecteur de PAYS existe dans les paramètres')
await paysSel.selectOption({ label: 'France' })
await page.waitForTimeout(300)
// la devise suit le pays
const devise = await page.evaluate(() => {
  const sels = [...document.querySelectorAll('select')]
  const d = sels.find(s => [...s.options].some(o => /EUR/.test(o.textContent)))
  return d ? d.value : ''
})
ok(devise === 'EUR', `choisir la France passe la devise en euro (${devise})`)
await page.locator('button:has-text("Enregistrer")').first().click().catch(() => {})
await page.waitForTimeout(1400)

// après France : le champ élève dit « Département », plus « Gouvernorat »
await page.goto(`${B}/#/app/students`); await page.waitForTimeout(900)
await page.locator('button:has-text("Nouvel élève"), button:has-text("Inscrire"), button:has-text("Ajouter")').first().click().catch(() => {})
await page.waitForTimeout(700)
modal = await page.locator('body').innerText()
ok(/Département/.test(modal) && !/Gouvernorat/.test(modal), 'en France : le champ région devient « Département »')
const idLabel = await page.evaluate(() => [...document.querySelectorAll('label,span')].map(e=>e.textContent).find(t=>/N. de pi.ce|acte de naissance|CIN \(8/.test(t))||'')
  ok(!/CIN \(8/.test(idLabel), `le libellé pièce d’identité n’est plus « CIN (8 chiffres) » (${idLabel.slice(0,40)})`)

ok(errs.length === 0, `aucune exception JS (${errs.length})`)
if (errs.length) console.log(errs.slice(0, 3).join('\n'))
await browser.close(); server.close()
