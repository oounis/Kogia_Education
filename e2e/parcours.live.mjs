// LIVE : le mode serveur, conduit comme une vraie école.
// Un VRAI serveur (server/server.mjs), deux « appareils » (deux contextes de
// navigateur isolés), et les trois preuves qui font une production :
//   1. la direction écrit sur l'appareil A → l'appareil B LE VOIT ;
//   2. le parent reçoit un blob reconstruit — jamais la paie, jamais les
//      enfants des autres ;
//   3. personne n'entre sans mot de passe (haché côté serveur).
import { chromium } from 'playwright-core'
import { spawn, execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { findChrome, serveDist } from './lib.mjs'

const APP = 8961, API = 8791
const DATA = mkdtempSync(join(tmpdir(), 'coreon-live-'))
execFileSync('node', ['../server/import.mjs', '--demo'], { env: { ...process.env, COREON_DATA: DATA } })
const srv = spawn('node', ['../server/server.mjs'], {
  env: { ...process.env, COREON_DATA: DATA, PORT: String(API), COREON_ORIGINS: `http://localhost:${APP}` },
  stdio: 'inherit',
})
await new Promise(r => setTimeout(r, 1200))

const web = serveDist(APP)
const browser = await chromium.launch({ executablePath: findChrome() })
const fails = []
const ok = (cond, msg) => { console.log((cond ? 'PASS' : 'FAIL') + ' — ' + msg); if (!cond) fails.push(msg) }

const device = async () => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(`http://localhost:${APP}/`)
  await page.evaluate(api => localStorage.setItem('coreon_api', api), `http://localhost:${API}`)
  await page.reload(); await page.waitForTimeout(600)
  return page
}
const connect = async (page, email, pw) => {
  await page.locator('input[type=email]').fill(email)
  await page.locator('input[type=password]').fill(pw)
  await page.getByRole('button', { name: /Se connecter/ }).click()
  await page.waitForTimeout(1500)
}

try {
  // 1. Mauvais mot de passe → la porte reste fermée
  const A = await device()
  ok((await A.locator('input[type=password]').count()) === 1, 'sans session : seul l\'écran de connexion existe')
  await connect(A, 'direction@alnour.tn', 'faux')
  ok((await A.locator('body').innerText()).includes('incorrect'), 'mauvais mot de passe : refus dit clairement')

  // 2. La direction se connecte sur l'appareil A et inscrit une dépense
  await connect(A, 'direction@alnour.tn', 'admin')
  await A.waitForTimeout(800)
  ok((await A.locator('body').innerText()).includes('Bonjour'), 'la direction entre (appareil A)')
  await A.goto(`http://localhost:${APP}/#/app/budget`); await A.waitForTimeout(800)
  await A.getByRole('button', { name: /Dépense/ }).first().click(); await A.waitForTimeout(400)
  await A.getByPlaceholder(/Ramettes/).fill('Preuve multi-appareils')
  await A.locator('.fixed input[type=number]').fill('123')
  await A.getByRole('button', { name: 'Inscrire' }).click()
  await A.waitForTimeout(1800)   // débounce 800 ms + aller-retour serveur

  // 3. L'appareil B (contexte isolé = autre machine) se connecte et LA VOIT
  const B = await device()
  await connect(B, 'direction@alnour.tn', 'admin')
  await B.goto(`http://localhost:${APP}/#/app/budget`); await B.waitForTimeout(900)
  await B.locator('button.card.k-press').nth(2).click(); await B.waitForTimeout(500)
  ok((await B.locator('.fixed').last().innerText()).includes('Preuve multi-appareils'),
    'MULTI-APPAREILS : la dépense écrite sur A est lue sur B')

  // 4. Le parent : blob reconstruit — ses enfants, jamais la paie
  const P = await device()
  await connect(P, 'parent@alnour.tn', 'parent')
  const blob = await P.evaluate(() => JSON.parse(localStorage.getItem('coreon_db') || '{}'))
  ok(!('hrPayrolls' in blob) && !('expenses' in blob) && !('visitors' in blob),
    'le parent ne reçoit NI paie, NI dépenses, NI registre de sécurité')
  ok((blob.students || []).length === 2 && (blob.users || []).length === 1,
    'le parent reçoit SES deux enfants et son seul compte')
  ok((blob.users || []).every(u => !('pw' in u)), 'aucun mot de passe ne voyage')
} finally {
  await browser.close(); web.close(); srv.kill(); rmSync(DATA, { recursive: true, force: true })
}
console.log(fails.length ? `\n${fails.length} ÉCHEC(S)` : '\nTOUT PASSE')
process.exit(fails.length ? 1 : 0)
