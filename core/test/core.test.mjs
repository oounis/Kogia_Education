// Tests du cœur métier — les règles que web ET mobile partagent.
// Zéro dépendance : node --test. Le stockage retombe sur la mémoire (storage.js).
import { test } from 'node:test'
import assert from 'node:assert/strict'

import { FEATURES, featureEnabled } from '../src/features.js'
import { canAccess } from '../src/access.js'
import { isoOf, rentreeDate, rentreeLabel } from '../src/clock.js'
import { mentionFor } from '../src/results.js'
import { spaceOfRole, belongsToSpace, seesAllSpaces, canDecide } from '../src/social.js'
import { db, uid } from '../src/db.js'
import { loginAs, current, logout } from '../src/auth.js'

test('modules cachés : éteints mais présents', () => {
  for (const m of ['homework', 'exams', 'library', 'transport']) assert.equal(FEATURES[m], false)
  assert.equal(featureEnabled('/app/homework'), false)
  assert.equal(featureEnabled('/app/evaluate'), true)
})

test('accès : refus par défaut et périmètres de rôle', () => {
  assert.equal(canAccess('parent', '/app/payments'), true)
  assert.equal(canAccess('teacher', '/app/payments'), false)   // un enseignant ne voit pas les paiements
  assert.equal(canAccess('teacher', '/app/evaluate'), true)
  assert.equal(canAccess('parent', '/app/evaluate'), false)
  assert.equal(canAccess('admin', '/app/route-inconnue'), false) // défaut = refus
  assert.equal(canAccess('security', '/app/security'), true)
})

test('dates : locales, jamais UTC ; rentrée calculée', () => {
  assert.equal(isoOf(new Date(2026, 6, 10)), '2026-07-10')
  const r = rentreeDate(new Date(2026, 6, 10))
  assert.equal(r.getMonth(), 8); assert.equal(r.getDate(), 15); assert.equal(r.getFullYear(), 2026)
  assert.match(rentreeLabel(new Date(2026, 6, 10)), /septembre/)
})

test('mentions : ordonnées et définies aux bornes', () => {
  const excellent = mentionFor(95), faible = mentionFor(20)
  assert.ok(excellent && excellent.label)
  assert.ok(faible && faible.label)
  assert.notEqual(excellent.label, faible.label)
})

test('espaces : chacun le sien, la direction voit tout', () => {
  assert.equal(spaceOfRole('parent'), 'parent')
  assert.equal(belongsToSpace('parent', 'parent'), true)
  assert.equal(belongsToSpace('parent', 'teacher'), false)     // un enseignant ne rejoint pas une sortie parents
  assert.equal(seesAllSpaces('schooladmin'), true)
  assert.equal(seesAllSpaces('parent'), false)
})

test('séparation des pouvoirs : personne n\'approuve sa propre proposition', () => {
  const ev = { status: 'soumis', by: 'u_x', space: 'parent' }
  assert.equal(canDecide(ev, { id: 'u_x', role: 'admin' }), false)
  assert.equal(canDecide(ev, { id: 'u_autre', role: 'admin' }), true)
  assert.equal(canDecide(ev, { id: 'u_autre', role: 'parent' }), false)
})

test('db : se sème en mémoire, stable entre deux lectures', () => {
  const d1 = db()
  assert.ok(d1.users.length >= 6, 'utilisateurs de démo présents')
  assert.ok(d1.students.length > 0)
  assert.equal(db()._v, d1._v)
})

test('auth : session par la couture, jamais par le navigateur', () => {
  const u = loginAs('u_owner')
  assert.ok(u && current() && current().id === 'u_owner')
  logout()
  assert.equal(current(), null)
})

test('uid : identifiants distincts', () => {
  const seen = new Set(Array.from({ length: 200 }, () => uid('t')))
  assert.equal(seen.size, 200)
})

// ── Le reçu ne ment jamais (admissions.js × storage.js) ──────────────────────
// Le 2026-07-14, deux vraies pré-inscriptions ont été perdues : quatre photos en
// base64 dépassaient le quota du navigateur, l'écriture échouait EN SILENCE, et
// le parent repartait avec la référence d'un dossier jamais enregistré.
import { setStorage } from '../src/storage.js'
import { apply, appById } from '../src/admissions.js'

test('inscription : jamais de faux reçu — le stockage plein est dit, pas avalé', () => {
  // un stockage à quota : refuse toute écriture au-delà de `limit`
  const m = new Map()
  let limit = Infinity
  setStorage({
    getItem: k => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => { if (String(v).length > limit) throw new Error('QuotaExceeded'); m.set(k, String(v)) },
    removeItem: k => m.delete(k),
  })
  const tick = () => { const t = Date.now(); while (Date.now() <= t) { /* ids distincts */ } }
  const base = JSON.stringify(db()).length          // l'école de démo se sème ici
  limit = base + 200 * 1024                          // ~200 Ko de marge — comme un vrai quota

  // 1) une pièce trop lourde : le dossier passe SANS elle, et on le DIT
  const big = 'x'.repeat(500 * 1024)
  const r1 = apply({ childName: 'Hammouda', dob: '2021-01-01', level: 'kg1',
    parentName: 'O. Ounis', parentPhone: '30359449',
    files: [{ type: 'photo', name: 'p.jpg', size: big.length, mime: 'image/jpeg', data: big }] })
  assert.ok(r1.app, 'la candidature survit à la pièce')
  assert.equal(r1.filesDropped, true, 'et l’abandon des pièces est DIT au parent')
  assert.ok(appById(r1.app.id), 'le dossier est réellement en base')
  assert.equal(appById(r1.app.id).files.length, 0)

  // 2) une candidature légère passe entière
  tick()
  const r2 = apply({ childName: 'ounis Marwan', dob: '2020-05-05', level: 'g1',
    parentName: 'O. Ounis', parentPhone: '+21600000000' })
  assert.ok(r2.app && r2.filesDropped === false)
  assert.ok(appById(r2.app.id))

  // 3) quota totalement plein : une ERREUR franche, pas de reçu
  tick()
  limit = 10
  const r3 = apply({ childName: 'Fantôme', dob: '2020-01-01', level: 'g1',
    parentName: 'X', parentPhone: '00000000' })
  assert.ok(r3.error, 'pas de reçu pour un dossier non enregistré')
  assert.ok(!r3.app)

  setStorage(null)   // un stockage neuf pour la suite
})
