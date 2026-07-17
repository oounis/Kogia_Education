// QUALITÉ — deux garanties qu'aucun autre parcours ne couvrait :
//   1. les PDF (documents officiels, attestations) se GÉNÈRENT vraiment —
//      une régression de jsPDF passerait inaperçue sinon ;
//   2. accessibilité (axe-core) sur les pages clés × rôles — les écoles
//      emploient du personnel en situation de handicap, et c'est la loi.
import { chromium } from 'playwright-core'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { findChrome, serveDist } from './lib.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const AXE = readFileSync(join(HERE, 'node_modules/axe-core/axe.min.js'), 'utf8')

await (async () => {
  const server = serveDist(8976)
  const browser = await chromium.launch({ executablePath: findChrome() })
  const fails = []
  const ok = (cond, msg) => { console.log((cond ? 'PASS' : 'FAIL') + ' — ' + msg); if (!cond) fails.push(msg) }
  const base = 'http://localhost:8976'

  const login = async (page, email, pw) => {
    await page.goto(`${base}/#/login`)
    await page.locator('input').first().fill(email)
    await page.locator('input[type=password]').fill(pw)
    await page.keyboard.press('Enter'); await page.waitForTimeout(900)
  }

  try {
    // ── 1. PDF : délivrer un certificat de scolarité et capter le téléchargement ──
    const ctx = await browser.newContext({ acceptDownloads: true })
    const page = await ctx.newPage()
    await login(page, 'direction@alnour.tn', 'admin')
    await page.goto(`${base}/#/app/documents`); await page.waitForTimeout(700)
    await page.locator('select').first().selectOption({ index: 1 }); await page.waitForTimeout(200)
    await page.getByRole('button', { name: /Délivrer & inscrire/ }).click(); await page.waitForTimeout(600)
    const dl = page.waitForEvent('download', { timeout: 15000 })
    await page.getByRole('button', { name: /Télécharger PDF/ }).click()
    const file = await dl
    const path = await file.path()
    const head = readFileSync(path).subarray(0, 5).toString('latin1')
    ok(head.startsWith('%PDF-'), 'le certificat de scolarité produit un VRAI fichier PDF')

    // ── 2. Accessibilité : axe-core sur les pages clés × rôles ──
    const scan = async (email, pw, path, label) => {
      const c = await browser.newContext({ viewport: { width: 1280, height: 900 } })
      const pg = await c.newPage()
      await login(pg, email, pw)
      await pg.goto(`${base}/#${path}`); await pg.waitForTimeout(700)
      await pg.addScriptTag({ content: AXE })
      const res = await pg.evaluate(async () => await window.axe.run(document, {
        runOnly: ['wcag2a', 'wcag2aa'],
        resultTypes: ['violations'],
      }))
      const serious = res.violations.filter(v => ['serious', 'critical'].includes(v.impact))
      if (serious.length) console.log('   ⚠ ' + label + ': ' + serious.map(v => `${v.id}(${v.nodes.length})`).join(', '))
      ok(serious.length === 0, `a11y ${label} : aucune violation grave/critique`)
      await c.close()
    }
    await scan('direction@alnour.tn', 'admin', '/app', 'tableau de bord · direction')
    await scan('direction@alnour.tn', 'admin', '/app/attendance', 'présence · direction')
    await scan('enseignant@alnour.tn', 'teacher', '/app/evaluate', 'évaluer · enseignant')
    await scan('parent@alnour.tn', 'parent', '/app', 'tableau de bord · parent')
    await scan('parent@alnour.tn', 'parent', '/app/canteen', 'cantine · parent')
  } finally {
    await browser.close(); server.close()
  }
  console.log(fails.length ? `\n${fails.length} ÉCHEC(S)` : '\nTOUT PASSE')
  process.exit(fails.length ? 1 : 0)
})()
