// UI/UX : chaque page sur téléphone (390px) × chaque rôle — 0 débordement horizontal.
import { scenario } from './lib.mjs'
const ROLES = {
  'direction@alnour.tn/admin': ['/app','/app/admissions','/app/students','/app/hr','/app/accounting','/app/academic','/app/facilities','/app/results','/app/finance','/app/interop','/app/settings'],
  'enseignant@alnour.tn/teacher': ['/app','/app/evaluate','/app/attendance','/app/journal','/app/child','/app/timetable'],
  'parent@alnour.tn/parent': ['/app','/app/live','/app/journal','/app/payments','/app/accidents'],
  'securite@alnour.tn/secu': ['/app','/app/security','/app/incidents'],
}
await scenario(8961, async ({ page, ok, base }) => {
  const bad = []
  await page.setViewportSize({ width: 390, height: 800 })   // téléphone
  for (const [cred, routes] of Object.entries(ROLES)) {
    const [email, pw] = cred.split('/')
    await page.goto(`${base}/#/login`); await page.evaluate(()=>sessionStorage.clear())
    await page.goto(`${base}/#/login`); await page.waitForSelector('input')
    await page.locator('input').first().fill(email)
    await page.locator('input[type=password]').fill(pw)
    await page.keyboard.press('Enter'); await page.waitForTimeout(800)
    for (const r of routes) {
      await page.goto(`${base}/#${r}`); await page.waitForTimeout(400)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2)
      if (overflow) bad.push(`${email.split('@')[0]} ${r} déborde horizontalement`)
    }
  }
  // aussi : titre de page présent (accessibilité de base) + langue déclarée
  const lang = await page.evaluate(() => document.documentElement.lang)
  ok(lang === 'fr' || lang === 'ar', `langue déclarée sur <html> (${lang})`)
  console.log('OVERFLOW:', bad.length ? '\n'+bad.join('\n') : 'aucun (25 pages × mobile)')
  ok(bad.length === 0, `mobile : 0 débordement sur 25 pages`)
})
