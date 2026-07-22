// Vérification INDÉPENDANTE sur le site RÉEL — pas sur un bundle local.
import { chromium } from 'playwright-core'
import { findChrome } from './lib.mjs'

const SITE = 'https://edu.kogiagroup.com'
const browser = await chromium.launch({ executablePath: findChrome() })
const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage()
const errs = []
page.on('pageerror', e => errs.push(e.message))
const ok = (c, m) => console.log((c ? 'PASS' : 'FAIL') + ' — ' + m)

console.log(`\n══ ${SITE} — les correctifs sont-ils EN LIGNE ? ══\n`)

// DEF-003 : le menu défile vraiment
await page.goto(`${SITE}/#/`, { waitUntil: 'networkidle' }); await page.waitForTimeout(1200)
await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(300)
const y0 = await page.evaluate(() => window.scrollY)
const item = page.locator('nav button:has-text("Modules"), nav a:has-text("Modules")').first()
await item.click(); await page.waitForTimeout(1800)
const y1 = await page.evaluate(() => window.scrollY)
ok(y1 > 200, `DEF-003 : « Modules » défile réellement (${y0} → ${y1})`)
const actif = await page.evaluate(() => {
  const els = [...document.querySelectorAll('nav button, nav a')]
  return new Set(els.map(e => getComputedStyle(e).color)).size > 1
})
ok(actif, 'DEF-003 : l\'entrée courante se distingue visuellement')

// DEF-001 : /login ne déborde pas sur téléphone
await page.setViewportSize({ width: 390, height: 844 })
await page.goto(`${SITE}/#/login`, { waitUntil: 'networkidle' }); await page.waitForTimeout(1000)
const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
ok(over <= 2, `DEF-001 : aucun débordement horizontal sur téléphone (${over}px)`)

// CR-013 : le lien et l'écran existent
const lien = await page.locator('a:has-text("Mot de passe oublié")').count()
ok(lien > 0, 'CR-013 : le lien « Mot de passe oublié ? » est en ligne')
await page.goto(`${SITE}/#/mot-de-passe-oublie`, { waitUntil: 'networkidle' }); await page.waitForTimeout(1200)
ok(/Mot de passe oublié/i.test(await page.locator('body').innerText()), 'CR-013 : l\'écran de demande répond en production')

// DEF-002 : les 4 chiffres de la console plateforme mènent quelque part
await page.setViewportSize({ width: 1280, height: 900 })
await page.goto(`${SITE}/#/login`, { waitUntil: 'networkidle' }); await page.waitForTimeout(1000)
await page.locator('button:has-text("Kogia Group")').first().click(); await page.waitForTimeout(2500)
const liens = await page.evaluate(() => {
  const wanted = ['Écoles clientes', 'Élèves gérés', 'Revenu mensuel', 'En essai']
  return wanted.map(w => {
    // le PLUS PETIT élément qui porte le libellé — sinon on attrape un
    // conteneur de page, qui n'est évidemment ni lien ni bouton
    const cands = [...document.querySelectorAll('*')].filter(e =>
      (e.textContent || '').includes(w) && ![...e.children].some(c => (c.textContent || '').includes(w)))
    const el = cands[0]
    const found = !!(el && el.closest('a,button'))
    return { w, cliquable: found, href: el?.closest('a')?.getAttribute('href') || null, present: !!el }
  })
})
liens.forEach(l => ok(l.cliquable, `DEF-002 : « ${l.w} » est cliquable${l.href ? " → " + l.href : (l.present ? " (trouvé, non cliquable)" : " (ABSENT de la page)")}`))

ok(errs.length === 0, `aucune exception JS sur le site réel (${errs.length})`)
if (errs.length) console.log(errs.join('\n'))
await browser.close()
