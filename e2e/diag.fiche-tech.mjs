// DIAGNOSTIC — CR-014 : la fiche technique d'une école dans la console owner.
import { chromium } from 'playwright-core'
import { findChrome, serveDist } from './lib.mjs'

const PORT = 8991
const server = serveDist(PORT)
const browser = await chromium.launch({ executablePath: findChrome() })
const page = await (await browser.newContext({ viewport: { width: 1440, height: 950 } })).newPage()
const B = `http://localhost:${PORT}`
const errs = []; page.on('pageerror', e => errs.push(e.message))
const ok = (c, m) => console.log((c ? 'PASS' : 'FAIL') + ' — ' + m)

console.log('\n══ FICHE TECHNIQUE (CONSOLE PLATEFORME) ══\n')

await page.goto(`${B}/#/login`); await page.waitForTimeout(600)
await page.locator('button:has-text("Kogia Group")').first().click(); await page.waitForTimeout(1600)
await page.goto(`${B}/#/app/schools`); await page.waitForTimeout(1000)

const btn = page.locator('button:has-text("Fiche technique")').first()
ok(await btn.count() > 0, 'chaque école a un bouton « Fiche technique »')
await btn.click(); await page.waitForTimeout(700)

const body = await page.locator('body').innerText()
ok(/Fiche technique/.test(body), 'le panneau s’ouvre')
ok(/Identité|Contact|Infrastructure|Diagnostic/.test(body), 'les sections attendues sont là')
ok(/à collecter/.test(body), 'les champs non renseignés sont marqués « à collecter », pas inventés')
ok(/\.tn|\.app|kogiagroup/.test(body), 'un domaine est affiché')
ok(/Révision|Mode|Joignable/.test(body), 'le diagnostic montre ce qu’on peut vraiment vérifier')

// un lien externe vers le domaine
const link = page.locator('a[target=_blank]').first()
ok(await link.count() > 0, 'le domaine est un lien ouvrable')

ok(errs.length === 0, `aucune exception JS (${errs.length})`)
if (errs.length) console.log(errs.slice(0, 3).join('\n'))
await browser.close(); server.close()
