// DIAGNOSTIC — DEF-002 : « dans le tableau de bord, des éléments ne sont pas
// cliquables ». On regarde CHAQUE carte/tuile du tableau de bord, pour chaque
// rôle, et on classe :
//   INTERACTIF  — <a>/<button>, ou porteur d'un gestionnaire : normal
//   TROMPEUR    — a l'air cliquable (curseur main, effet de survol) mais n'est
//                 ni lien ni bouton : c'est le défaut que l'utilisateur voit
//   INERTE      — carte de lecture seule, sans affordance : légitime
// Un navigateur NEUF par rôle : l'outil d'audit existant mourait en réutilisant
// le même contexte trop longtemps.
import { chromium } from 'playwright-core'
import { findChrome, serveDist } from './lib.mjs'

const PORT = 8983
const ROLES = [
  ['owner@kogia.tn', 'owner', 'Kogia Group (Plateforme)'],
  ['direction@alnour.tn', 'admin', 'Direction'],
  ['admin@alnour.tn', 'office', 'Administration'],
  ['enseignant@alnour.tn', 'teacher', 'Enseignant'],
  ['parent@alnour.tn', 'parent', 'Parent'],
  ['surveillant@alnour.tn', 'super', 'Surveillant'],
  ['securite@alnour.tn', 'secu', 'Sécurité'],
]

const server = serveDist(PORT)
const B = `http://localhost:${PORT}`
const report = []

for (const [email, pw, label] of ROLES) {
  const browser = await chromium.launch({ executablePath: findChrome() })
  try {
    const page = await (await browser.newContext({ viewport: { width: 1440, height: 950 } })).newPage()
    await page.goto(`${B}/#/login`)
    await page.evaluate(() => sessionStorage.clear())
    await page.goto(`${B}/#/login`)
    await page.waitForSelector('input', { timeout: 15000 })
    await page.locator('input').first().fill(email)
    await page.locator('input[type=password]').fill(pw)
    await page.keyboard.press('Enter')
    await page.waitForTimeout(2000)

    const found = await page.evaluate(() => {
      const out = []
      // toute « carte » du tableau de bord
      const cards = [...document.querySelectorAll('.card, [class*="rounded-2xl"], [class*="rounded-xl"]')]
      for (const el of cards) {
        const r = el.getBoundingClientRect()
        if (r.width < 90 || r.height < 50) continue            // pas une tuile
        if (el.querySelector('.card, button, a')) continue      // conteneur, pas feuille
        const tag = el.tagName.toLowerCase()
        const interactive = tag === 'a' || tag === 'button' ||
          el.closest('a,button') !== null || typeof el.onclick === 'function' ||
          el.getAttribute('role') === 'button' || el.hasAttribute('tabindex')
        const cs = getComputedStyle(el)
        const looksClickable = cs.cursor === 'pointer' ||
          /hover:(shadow|translate|scale|bg)/.test(el.className || '') ||
          /group/.test(el.className || '')
        const txt = (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 46)
        if (!txt) continue
        out.push({ txt, tag, interactive, looksClickable, cls: (el.className || '').slice(0, 60) })
      }
      // dédoublonnage par texte
      const seen = new Set()
      return out.filter(o => !seen.has(o.txt) && seen.add(o.txt))
    })

    const trompeur = found.filter(f => !f.interactive && f.looksClickable)
    const inerte = found.filter(f => !f.interactive && !f.looksClickable)
    report.push({ label, total: found.length, trompeur, inerte: inerte.length, inerteList: inerte })
  } catch (e) {
    report.push({ label, error: String(e.message).slice(0, 90) })
  } finally { await browser.close() }
}

console.log('\n══ TABLEAU DE BORD — ÉLÉMENTS QUI ONT L\'AIR CLIQUABLES MAIS NE LE SONT PAS ══\n')
let totalBad = 0
for (const r of report) {
  if (r.error) { console.log(`${r.label.padEnd(26)} ERREUR : ${r.error}`); continue }
  console.log(`${r.label.padEnd(26)} ${String(r.total).padStart(3)} tuiles · ${r.trompeur.length} trompeuse(s) · ${r.inerte} en lecture seule`)
  for (const t of r.trompeur) { totalBad++; console.log(`      ⟵ TROMPEUR « ${t.txt} »`) }
  for (const t of (r.inerteList||[])) console.log(`      · lecture seule : « ${t.txt} »`)
}
console.log(`\nRÉSULTAT : ${totalBad} élément(s) trompeur(s) au total.\n`)

server.close()
