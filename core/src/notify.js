import { mutate, db, uid, studentById } from './db.js'

// Une notification vise soit UNE personne (`to`), soit un RÔLE (`role`).
//
// Problème réglé ici : un `role:'parent'` était livré à TOUS les parents de l'école.
// Un devoir de 6ème A, un examen de 3ème A, et même un rappel « 2 mois impayés »
// arrivaient dans la boîte de chaque famille. On ajoute `classId` : une notification
// de rôle peut être restreinte à une classe, et un parent ne reçoit alors que ce qui
// concerne réellement ses enfants. Les notifications destinées au personnel ne sont
// pas filtrées par classe (un directeur voit toute l'école).
export function notify({ to = null, role = null, classId = null, kind = 'info', actor = null, title, body, link = null }) {
  mutate(d => {
    d.notifications = d.notifications || []
    d.notifications.unshift({ id: uid('n'), to, role, classId, kind, actor, title, body, link, at: Date.now(), read: false })
  })
}

// Les classes des enfants d'un parent (via childIds).
export function classIdsOfParent(user) {
  return (user?.childIds || []).map(id => studentById(id)?.classId).filter(Boolean)
}

function reaches(n, user) {
  if (n.to === user.id) return true          // destinataire nommé
  if (!n.role || n.role !== user.role) return false
  if (!n.classId) return true                // diffusion à tout le rôle
  if (user.role !== 'parent') return true    // le personnel n'est pas filtré par classe
  return classIdsOfParent(user).includes(n.classId)
}

export function inboxFor(user) {
  if (!user) return []
  return (db().notifications || []).filter(n => reaches(n, user))
}
export function unreadFor(user) { return inboxFor(user).filter(n => !n.read).length }
export function markRead(id) { mutate(d => { const n = d.notifications.find(x => x.id === id); if (n) n.read = true }) }
export function markAllRead(user) {
  mutate(d => { d.notifications.forEach(n => { if (reaches(n, user)) n.read = true }) })
}
