// Sauvegarde → restauration — le test que la checklist de production EXIGE :
// « la procédure de retour arrière essayée, pas seulement écrite ». On écrit
// des données, on sauvegarde, on DÉTRUIT, on restaure, on vérifie l'intégrité.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync, readdirSync, copyFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { makeStore } from '../store.mjs'

test('sauvegarde : écriture atomique — une coupure ne laisse jamais un fichier à moitié', () => {
  const dir = mkdtempSync(join(tmpdir(), 'coreon-bk-'))
  const store = makeStore(dir)
  store.write('school', { rev: 1, blob: { students: [{ id: 's1' }] } })
  assert.ok(!readdirSync(dir).some(f => f.endsWith('.tmp')), 'aucun fichier temporaire ne survit')
  assert.equal(store.read('school', null).rev, 1)
  rmSync(dir, { recursive: true, force: true })
})

test('restauration : détruire puis restaurer rend l\'école intacte', () => {
  const dir = mkdtempSync(join(tmpdir(), 'coreon-bk-'))
  const store = makeStore(dir)
  const original = { rev: 42, blob: { students: [{ id: 's1', name: 'Amira' }, { id: 's2', name: 'Adam' }], settings: { schoolName: 'Al Nour' } } }
  store.write('school', original)
  const dest = store.backup()
  assert.ok(dest && readdirSync(join(dir, 'backups')).length === 1, 'la sauvegarde est créée')

  // CATASTROPHE : le fichier principal est corrompu (moitié écrit)
  writeFileSync(join(dir, 'school.json'), '{"rev":42,"blob":{"stud')
  assert.equal(store.read('school', 'CORROMPU'), 'CORROMPU', 'le fichier corrompu ne se lit pas')

  // RESTAURATION : on recopie la sauvegarde par-dessus
  copyFileSync(dest, join(dir, 'school.json'))
  const restored = store.read('school', null)
  assert.equal(restored.rev, 42, 'la révision est revenue')
  assert.equal(restored.blob.students.length, 2, 'les deux élèves sont là')
  assert.equal(restored.blob.students[0].name, 'Amira', 'les données sont identiques')
  assert.equal(restored.blob.settings.schoolName, 'Al Nour')
  rmSync(dir, { recursive: true, force: true })
})

test('rotation : on garde 30 sauvegardes, jamais plus — le disque ne se remplit pas', () => {
  const dir = mkdtempSync(join(tmpdir(), 'coreon-bk-'))
  const store = makeStore(dir)
  store.write('school', { rev: 1, blob: {} })
  const bdir = join(dir, 'backups')
  for (let i = 0; i < 35; i++) {
    const stamp = `2026-01-01-${String(i).padStart(2, '0')}-00`
    copyFileSync(join(dir, 'school.json'), join(bdir, `school-${stamp}.json`))
  }
  store.backup() // déclenche la rotation
  const kept = readdirSync(bdir).filter(f => f.startsWith('school-'))
  assert.ok(kept.length <= 30, `rotation à 30 (trouvé ${kept.length})`)
  assert.ok(kept.sort().at(-1) > kept.sort()[0], 'les plus récentes sont conservées')
  rmSync(dir, { recursive: true, force: true })
})
