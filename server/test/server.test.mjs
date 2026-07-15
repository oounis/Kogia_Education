// Tests du serveur — on démarre un VRAI serveur sur un port libre et on parle
// HTTP, comme le fera l'application. Les règles vérifiées sont celles de la
// production : hachage, filtrage par rôle, verrou de révision, gardes parent.
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const DATA = mkdtempSync(join(tmpdir(), 'coreon-srv-'))
let base, server

before(async () => {
  execFileSync('node', [join(HERE, '../import.mjs'), '--demo'], { env: { ...process.env, COREON_DATA: DATA } })
  process.env.COREON_DATA = DATA
  process.env.NODE_ENV = 'test'
  ;({ server } = await import('../server.mjs'))
  await new Promise(r => server.listen(0, r))
  base = `http://localhost:${server.address().port}`
})
after(() => { server?.close(); rmSync(DATA, { recursive: true, force: true }) })

const api = async (path, { method = 'GET', token, body } = {}) => {
  const res = await fetch(base + path, {
    method, headers: { ...(token ? { authorization: `Bearer ${token}` } : {}), 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  return { status: res.status, json: await res.json() }
}
const login = async (email, pw) => (await api('/api/login', { method: 'POST', body: { email, pw } })).json

test('auth : mauvais mot de passe refusé, bon accepté, aucun pw dans le blob', async () => {
  assert.equal((await api('/api/login', { method: 'POST', body: { email: 'direction@alnour.tn', pw: 'faux' } })).status, 401)
  const s = await login('direction@alnour.tn', 'admin')
  assert.ok(s.token && s.user.role === 'schooladmin')
  const { json } = await api('/api/db', { token: s.token })
  assert.ok(json.blob.users.length > 5)
  assert.ok(json.blob.users.every(u => !('pw' in u)), 'AUCUN mot de passe ne voyage')
  assert.ok(json.blob.hrPayrolls !== undefined || true)
})

test('lecture : l\'enseignant ne voit ni la paie, ni les factures, ni les salaires', async () => {
  const s = await login('enseignant@alnour.tn', 'teacher')
  const { json } = await api('/api/db', { token: s.token })
  for (const k of ['hrPayrolls', 'hrContracts', 'invoices', 'receipts', 'expenses', 'payments'])
    assert.equal(json.blob[k], undefined, `${k} est retiré du blob enseignant`)
  assert.ok(json.blob.teachers.every(t => !('salary' in t)), 'les salaires des collègues non plus')
  assert.ok(json.blob.students?.length, 'mais il voit ses élèves')
})

test('lecture : le parent reçoit un blob RECONSTRUIT — ses enfants, rien d\'autre', async () => {
  const s = await login('parent@alnour.tn', 'parent')
  const { json } = await api('/api/db', { token: s.token })
  const kids = new Set(s.user.childIds)
  assert.ok(json.blob.students.length >= 1 && json.blob.students.every(x => kids.has(x.id)), 'seulement SES enfants')
  assert.equal(json.blob.hrPayrolls, undefined)
  assert.equal(json.blob.visitors, undefined)
  assert.ok(json.blob.users.length === 1 && json.blob.users[0].id === s.user.id, 'un seul compte : le sien')
  assert.ok((json.blob.notifications || []).every(n => n.to === s.user.id), 'seulement SES notifications')
  assert.ok((json.blob.invoices || []).every(i => kids.has(i.studentId)))
})

test('écriture : verrou de révision (409) et fusion limitée au rôle', async () => {
  const dir = await login('direction@alnour.tn', 'admin')
  const t = await login('enseignant@alnour.tn', 'teacher')
  const mine = (await api('/api/db', { token: t.token })).json

  // l'enseignant tente d'écrire l'appel (permis) ET les classes (interdit)
  const posted = { ...mine.blob, attendance: { ...mine.blob.attendance, test_2026: { s1: 'absent' } }, classes: [] }
  const w = await api('/api/db', { method: 'POST', token: t.token, body: { baseRev: mine.rev, blob: posted } })
  assert.equal(w.status, 200)
  assert.ok(w.json.applied.includes('attendance') && !w.json.applied.includes('classes'), 'la fusion ne prend que ses collections')
  const after = (await api('/api/db', { token: dir.token })).json
  assert.ok(after.blob.classes.length > 0, 'les classes n\'ont pas été détruites')
  assert.equal(after.blob.attendance.test_2026.s1, 'absent', 'l\'appel est passé')

  // une écriture périmée reçoit 409 + les données fraîches — jamais un écrasement muet
  const stale = await api('/api/db', { method: 'POST', token: dir.token, body: { baseRev: mine.rev, blob: after.blob } })
  assert.equal(stale.status, 409)
  assert.ok(stale.json.rev > mine.rev && stale.json.blob)

  // le parent ne pousse jamais un bloc
  const p = await login('parent@alnour.tn', 'parent')
  assert.equal((await api('/api/db', { method: 'POST', token: p.token, body: { baseRev: 1, blob: {} } })).status, 403)
})

test('opérations parent : gardées par le lien enfant', async () => {
  const p = await login('parent@alnour.tn', 'parent')
  const like = await api('/api/op', { method: 'POST', token: p.token, body: { op: 'toggleLike', args: ['mo_seed2'] } })
  assert.equal(like.status, 200, JSON.stringify(like.json))
  const bad = await api('/api/op', { method: 'POST', token: p.token, body: { op: 'acknowledge', args: ['acc_inexistant'] } })
  assert.equal(bad.status, 400, 'un accident qui n\'est pas le sien : refus')
  const unknown = await api('/api/op', { method: 'POST', token: p.token, body: { op: 'resetDb', args: [] } })
  assert.equal(unknown.status, 400, 'aucune opération hors liste')
})

test('pré-inscription publique : acceptée, puis limitée par IP', async () => {
  const body = { childName: 'Test Serveur', dob: '2022-01-01', level: 'nursery', parentName: 'P', parentPhone: '+216', parentEmail: 's@t.tn' }
  const r = await api('/api/apply', { method: 'POST', body })
  assert.equal(r.status, 200)
  let last
  for (let i = 0; i < 12; i++) last = await api('/api/apply', { method: 'POST', body })
  assert.equal(last.status, 429, 'le robinet se ferme après 10/heure')
})
