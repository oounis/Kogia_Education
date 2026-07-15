// ════════════════════════════════════════════════════════════════════════════
// LES FÊTES — ce que le coin du haut raconte à la place d'une simple horloge.
//
// L'esprit « doodle » de Google, version école et HORS LIGNE : pas d'API, un
// calendrier tenu dans le cœur. Trois niveaux, du plus fort au plus doux :
//  1. Un JOUR FÉRIÉ tunisien aujourd'hui → on le dit (l'école est fermée).
//  2. Une JOURNÉE MONDIALE qui parle aux enfants et à l'école → on la célèbre.
//  3. Rien aujourd'hui → on annonce le PROCHAIN congé et dans combien de jours,
//     car c'est la question que parents et personnel se posent vraiment.
//
// Les fêtes religieuses dépendent de l'observation de la lune : leurs dates
// sont tenues PAR ANNÉE (pas de calcul hégirien approximatif) et portées
// `lune: true` — l'écran dit honnêtement « selon la lune ».
// Règle de charte : jamais d'émoji drapeau.
// ════════════════════════════════════════════════════════════════════════════

// Jours fériés tunisiens, par année civile.
export const FERIES = {
  2026: [
    { d: '2026-01-01', label: "Jour de l'an", e: '🎉' },
    { d: '2026-03-20', label: "Fête de l'Indépendance", e: '🕊️' },
    { d: '2026-03-20', label: 'Aïd el-Fitr', e: '🌙', lune: true },
    { d: '2026-03-21', label: 'Aïd el-Fitr (2e jour)', e: '🌙', lune: true },
    { d: '2026-04-09', label: 'Journée des Martyrs', e: '🕯️' },
    { d: '2026-05-01', label: 'Fête du Travail', e: '🛠️' },
    { d: '2026-05-27', label: 'Aïd el-Idha', e: '🐑', lune: true },
    { d: '2026-05-28', label: 'Aïd el-Idha (2e jour)', e: '🐑', lune: true },
    { d: '2026-06-16', label: 'Ras el Am el Hijri', e: '🌙', lune: true },
    { d: '2026-07-25', label: 'Fête de la République', e: '🏛️' },
    { d: '2026-08-13', label: 'Fête de la Femme', e: '🌸' },
    { d: '2026-08-25', label: 'Mouled', e: '✨', lune: true },
    { d: '2026-10-15', label: "Fête de l'Évacuation", e: '⚓' },
    { d: '2026-12-17', label: 'Fête de la Révolution', e: '✊' },
  ],
  2027: [
    { d: '2027-01-01', label: "Jour de l'an", e: '🎉' },
    { d: '2027-03-10', label: 'Aïd el-Fitr', e: '🌙', lune: true },
    { d: '2027-03-11', label: 'Aïd el-Fitr (2e jour)', e: '🌙', lune: true },
    { d: '2027-03-20', label: "Fête de l'Indépendance", e: '🕊️' },
    { d: '2027-04-09', label: 'Journée des Martyrs', e: '🕯️' },
    { d: '2027-05-01', label: 'Fête du Travail', e: '🛠️' },
    { d: '2027-05-17', label: 'Aïd el-Idha', e: '🐑', lune: true },
    { d: '2027-05-18', label: 'Aïd el-Idha (2e jour)', e: '🐑', lune: true },
    { d: '2027-06-06', label: 'Ras el Am el Hijri', e: '🌙', lune: true },
    { d: '2027-07-25', label: 'Fête de la République', e: '🏛️' },
    { d: '2027-08-13', label: 'Fête de la Femme', e: '🌸' },
    { d: '2027-08-15', label: 'Mouled', e: '✨', lune: true },
    { d: '2027-10-15', label: "Fête de l'Évacuation", e: '⚓' },
    { d: '2027-12-17', label: 'Fête de la Révolution', e: '✊' },
  ],
}

// Journées mondiales choisies pour une école (0–12 ans) : l'enfant, le livre,
// l'eau, la gentillesse… — pas la liste exhaustive de l'ONU.
export const JOURNEES = [
  { d: '01-24', label: "Journée internationale de l'éducation", e: '🎓' },
  { d: '02-21', label: 'Journée de la langue maternelle', e: '🗣️' },
  { d: '03-08', label: 'Journée internationale des femmes', e: '🌸' },
  { d: '03-20', label: 'Journée internationale du bonheur', e: '😊' },
  { d: '03-21', label: 'Journée mondiale de la poésie', e: '📜' },
  { d: '03-22', label: "Journée mondiale de l'eau", e: '💧' },
  { d: '04-02', label: 'Journée du livre pour enfants', e: '📖' },
  { d: '04-07', label: 'Journée mondiale de la santé', e: '🩺' },
  { d: '04-22', label: 'Jour de la Terre', e: '🌍' },
  { d: '04-23', label: 'Journée mondiale du livre', e: '📚' },
  { d: '05-15', label: 'Journée internationale des familles', e: '🏡' },
  { d: '06-05', label: "Journée mondiale de l'environnement", e: '🌱' },
  { d: '06-21', label: 'Fête de la musique', e: '🎵' },
  { d: '07-15', label: 'Journée des compétences des jeunes', e: '💡' },
  { d: '07-30', label: "Journée internationale de l'amitié", e: '🤝' },
  { d: '08-12', label: 'Journée internationale de la jeunesse', e: '🚀' },
  { d: '09-08', label: "Journée de l'alphabétisation", e: '✏️' },
  { d: '09-21', label: 'Journée internationale de la paix', e: '🕊️' },
  { d: '10-05', label: 'Journée mondiale des enseignants', e: '🍎' },
  { d: '10-16', label: "Journée mondiale de l'alimentation", e: '🍽️' },
  { d: '11-13', label: 'Journée mondiale de la gentillesse', e: '💛' },
  { d: '11-20', label: "Journée des droits de l'enfant", e: '🧒' },
  { d: '12-03', label: 'Journée des personnes handicapées', e: '♿' },
  { d: '12-10', label: "Journée des droits de l'homme", e: '⚖️' },
  { d: '12-18', label: 'Journée mondiale de la langue arabe', e: '✒️' },
]

const allFeries = () => Object.values(FERIES).flat()
const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000)

export const ferieOf = iso => allFeries().find(f => f.d === iso) || null
export const journeeOf = iso => JOURNEES.find(j => j.d === iso.slice(5)) || null

/** Ce que le jour raconte : férié d'abord (l'école est fermée), journée sinon. */
export function feteOfDay(iso) {
  const f = ferieOf(iso)
  if (f) return { kind: 'ferie', ...f }
  const j = journeeOf(iso)
  if (j) return { kind: 'journee', ...j, d: iso }
  return null
}

/** Le prochain jour férié STRICTEMENT après `iso`, avec le compte à rebours. */
export function nextFerie(iso) {
  const f = allFeries().filter(x => x.d > iso).sort((a, b) => a.d.localeCompare(b.d))[0]
  return f ? { ...f, inDays: daysBetween(iso, f.d) } : null
}

/** L'agenda : les n prochaines fêtes (fériés + journées), aujourd'hui compris. */
export function upcoming(iso, n = 6) {
  const y = Number(iso.slice(0, 4))
  const journees = JOURNEES.flatMap(j => [`${y}-${j.d}`, `${y + 1}-${j.d}`]
    .map(d => ({ kind: 'journee', ...j, d })))
  const feries = allFeries().map(f => ({ kind: 'ferie', ...f }))
  return [...feries, ...journees]
    .filter(x => x.d >= iso)
    .sort((a, b) => a.d.localeCompare(b.d) || (a.kind === 'ferie' ? -1 : 1))
    .slice(0, n)
    .map(x => ({ ...x, inDays: daysBetween(iso, x.d) }))
}
