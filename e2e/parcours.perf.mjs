// BUDGET DE PERFORMANCE — un garde-fou : si la première visite dépasse le
// budget gzip, le parcours ÉCHOUE. Sans cette assertion, un import distrait
// d'une grosse librairie annulerait en silence le gain du code-splitting.
import { chromium } from 'playwright-core'
import { gzipSync } from 'node:zlib'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { findChrome, serveDist } from './lib.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const ASSETS = join(HERE, '../app/dist/assets')
const BUDGET_LANDING = 450   // KB gzip — première visite (page d'accueil)
const BUDGET_DASH = 600      // KB gzip — après connexion (tableau de bord)

await (async () => {
  const server = serveDist(8981)
  const browser = await chromium.launch({ executablePath: findChrome() })
  const fails = []
  const ok = (cond, msg) => { console.log((cond ? 'PASS' : 'FAIL') + ' — ' + msg); if (!cond) fails.push(msg) }
  const page = await (await browser.newContext()).newPage()
  const files = new Set()
  page.on('response', r => { const u = r.url(); if (/\.(js|css|woff2)$/.test(u)) files.add(u.split('/').pop()) })
  const kb = () => { let t = 0; for (const f of files) { try { t += gzipSync(readFileSync(join(ASSETS, f))).length } catch {} } return Math.round(t / 1024) }

  try {
    await page.goto('http://localhost:8981/'); await page.waitForTimeout(1200)
    const landing = kb()
    ok(landing <= BUDGET_LANDING, `première visite : ${landing} KB gzip ≤ ${BUDGET_LANDING} KB (budget)`)

    await page.goto('http://localhost:8981/#/login')
    await page.locator('input').first().fill('direction@alnour.tn')
    await page.locator('input[type=password]').fill('admin')
    await page.keyboard.press('Enter'); await page.waitForTimeout(1500)
    const dash = kb()
    ok(dash <= BUDGET_DASH, `tableau de bord : ${dash} KB gzip ≤ ${BUDGET_DASH} KB (budget)`)
  } finally {
    await browser.close(); server.close()
  }
  console.log(fails.length ? `\n${fails.length} ÉCHEC(S)` : '\nTOUT PASSE')
  process.exit(fails.length ? 1 : 0)
})()
