// ════════════════════════════════════════════════════════════════════════════
// LA NUMÉROTATION STRUCTURÉE (CR-017)
//
// Ce qui fait un ERP, ce n'est pas une clé interne (`s_a1b2c3`) : c'est une
// RÉFÉRENCE qu'on peut citer au téléphone, écrire sur un papier, chercher, et
// prononcer. Chaque entité en reçoit une, selon un plan de numérotation unique.
//
// Format :  PRÉFIXE-ANNÉE-SÉQUENCE-CLÉ      ex.  ELV-2026-0042-7
//   · PRÉFIXE  — un par type d'entité (élève, enseignant, facture…)
//   · ANNÉE    — l'année d'émission (les séries repartent à 1 chaque année)
//   · SÉQUENCE — 4 chiffres, SANS TROU (0001, 0002, …) par préfixe et par année
//   · CLÉ      — un chiffre de contrôle (Luhn) : une référence mal recopiée est
//                détectée tout de suite, comme sur une carte bancaire ou un RIB
//
// Règles ERP tenues ici :
//   · une référence est IMMUABLE une fois émise (on ne la recalcule jamais)
//   · elle n'est jamais réutilisée (la séquence ne recule pas)
//   · elle est indépendante de la clé technique interne (qui, elle, peut changer)
//
// Le module ne connaît ni React ni le stockage : on lui passe les références
// DÉJÀ existantes, il calcule la suivante. `db.js` l'appelle à la création.
// ════════════════════════════════════════════════════════════════════════════

// Un préfixe par type. Court, en lettres, prononçable.
export const PREFIX = {
  student:    'ELV',   // élève
  teacher:    'ENS',   // enseignant
  staff:      'PER',   // personnel (compte non-enseignant)
  application:'ADM',   // candidature (admission)
  invoice:    'FAC',   // facture
  receipt:    'REC',   // reçu
  request:    'DEM',   // demande
  accident:   'ACC',   // accident
  incident:   'INC',   // incident
  document:   'DOC',   // document délivré
  booking:    'RES',   // réservation d'installation
  expense:    'DEP',   // dépense
}

// ── Chiffre de contrôle (Luhn sur les chiffres de PRÉFIXE+ANNÉE+SÉQUENCE) ──────
// On mappe les lettres du préfixe en chiffres (A=1…Z=26 → somme des chiffres)
// pour que le préfixe compte aussi : FAC-2026-0001 et ELV-2026-0001 n'ont pas
// la même clé, donc citer la mauvaise série se voit.
function luhn(numStr) {
  let sum = 0, alt = false
  for (let i = numStr.length - 1; i >= 0; i--) {
    let d = numStr.charCodeAt(i) - 48
    if (d < 0 || d > 9) continue
    if (alt) { d *= 2; if (d > 9) d -= 9 }
    sum += d; alt = !alt
  }
  return (10 - (sum % 10)) % 10
}
const lettersToDigits = s => s.split('').map(c => {
  const u = c.toUpperCase().charCodeAt(0)
  return u >= 65 && u <= 90 ? String(u - 64) : c
}).join('')

/** La clé de contrôle d'un corps « PRÉFIXE-ANNÉE-SÉQUENCE ». */
export function checkDigit(body) {
  return String(luhn(lettersToDigits(body)))
}

/** Vérifie qu'une référence est bien formée ET que sa clé est cohérente. */
export function isValidRef(ref) {
  const m = /^([A-Z]{2,4})-(\d{4})-(\d{4})-(\d)$/.exec(String(ref || '').trim())
  if (!m) return false
  return checkDigit(`${m[1]}-${m[2]}-${m[3]}`) === m[4]
}

/**
 * La référence suivante pour un type donné.
 * @param type    clé de PREFIX (ex. 'student')
 * @param existing  toutes les références DÉJÀ émises pour ce type (["ELV-2026-0001-7", …])
 * @param year    année d'émission (chaîne "2026") — passée pour rester testable
 */
export function nextRef(type, existing, year) {
  const prefix = PREFIX[type]
  if (!prefix) throw new Error(`Type sans préfixe : ${type}`)
  const head = `${prefix}-${year}-`
  // La plus haute séquence déjà émise cette année pour ce préfixe (sans trou : +1).
  const used = (existing || [])
    .map(r => { const m = new RegExp(`^${prefix}-${year}-(\\d{4})-\\d$`).exec(String(r || '')); return m ? Number(m[1]) : 0 })
  const n = (used.length ? Math.max(...used) : 0) + 1
  const body = `${head}${String(n).padStart(4, '0')}`
  return `${body}-${checkDigit(body)}`
}

/** Le type d'une référence, déduit du préfixe (pour l'afficher, la router…). */
export function typeOfRef(ref) {
  const m = /^([A-Z]{2,4})-/.exec(String(ref || ''))
  if (!m) return null
  return Object.keys(PREFIX).find(k => PREFIX[k] === m[1]) || null
}
