// ════════════════════════════════════════════════════════════════════════════
// LE MAILER CENTRAL — un seul canal d'email pour TOUTE l'application.
//
// L'hôte (web) injecte un transport une fois (main.jsx → Worker Cloudflare qui
// relaie vers Zoho, expéditeur contact@kogiagroup.com). Tous les modules
// passent par ici : admissions, présence, paiements, bulletins, incidents,
// recrutement… Aucun module ne parle SMTP ni ne connaît le transport.
//
// SANS transport, sendMail renvoie {ok:false, via:'no-transport'} sans jamais
// planter : l'appelant journalise « préparé », rien n'est perdu ni faussé.
// ════════════════════════════════════════════════════════════════════════════
import { db, userById, studentById } from './db.js'

let transport = null
export function setMailTransport(fn) { transport = typeof fn === 'function' ? fn : null }
export const mailReady = () => Boolean(transport)

// Best-effort : n'interrompt jamais un parcours. Retourne un état, ne jette pas.
export async function sendMail({ to, subject, text }) {
  if (!to) return { ok: false, via: 'no-recipient' }
  if (!transport) return { ok: false, via: 'no-transport' }
  try { await transport({ to, subject, text }); return { ok: true, via: 'sent' } }
  catch (e) { return { ok: false, via: 'error', error: String((e && e.message) || e) } }
}

// ── Résolution des destinataires ────────────────────────────────────────────
export const emailOfUser = id => userById(id)?.email || null

// Les emails des parents d'un élève (via childIds ou parentId), dédupliqués.
export function parentEmailsOfStudent(studentId) {
  const s = studentById(studentId)
  if (!s) return []
  const parents = (db().users || []).filter(u =>
    u.role === 'parent' && ((u.childIds || []).includes(studentId) || u.id === s.parentId))
  return [...new Set(parents.map(p => p.email).filter(Boolean))]
}

// Les emails des parents d'une classe (un enfant au moins dans la classe).
export function parentEmailsOfClass(classId) {
  const kids = (db().students || []).filter(s => s.classId === classId).map(s => s.id)
  const set = new Set()
  kids.forEach(id => parentEmailsOfStudent(id).forEach(e => set.add(e)))
  return [...set]
}
