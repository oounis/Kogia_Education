// ── Les matières : UNE table, pour le web et le natif ───────────────────────
//
// Avant, la couleur d'une matière était décidée à deux endroits (app/src/subjects.jsx
// et TT_SUBJECTS dans db.js) qui n'étaient pas d'accord : « Mathématiques » n'avait
// pas la même teinte au web et sur mobile. Ici il n'y en a plus qu'une.
//
// Ces teintes sont des MARQUES (la pastille d'icône), jamais du texte : le libellé
// d'une matière se compose en encre. C'est la règle du livre de marque — « le texte
// porte les couleurs de texte, jamais celle de la série » — et c'est ce qui permet
// d'utiliser la palette catégorielle validée (≥ 3:1 en marque) sans casser l'AA.
//
// Ordre FIXE, jamais recyclé. Une matière inconnue tombe sur l'ardoise (« Autre »).
// Source : brand/KOGIA_HARMONY.md §3.4
import { SERIES, BRAND, N, TERRA } from './tokens.js'

// [regex, clé d'icône, teinte canonique]
const RULES = [
  [/math/,                'Calculator',   SERIES[0]], // #4361D0 bleu
  [/fran/,                'BookOpen',     SERIES[1]], // #0FA396 sarcelle
  [/scien|éveil|eveil/,   'FlaskConical', SERIES[5]], // #2F8050 vert
  [/arabe/,               'BookText',     SERIES[4]], // #B07414 ocre
  [/angl/,                'Languages',    SERIES[3]], // #9061F0 violet
  [/musi/,                'Music',        BRAND.violet],  // #8B5CF6
  [/art|dessin/,          'Palette',      SERIES[2]], // #D2603A terre
  [/info|techno/,         'Monitor',      N.slate],   // #5B6B7D ardoise
  [/sport|physique|gym/,  'Dumbbell',     TERRA.deep],// #C2410C terre profonde
  [/islam|coran/,         'MoonStar',     BRAND.indigo], // #7539E4
  [/civi/,                'Landmark',     N.ink],     // #0E2135 encre
]

const FALLBACK = { icon: 'NotebookPen', color: N.slate }

/** La teinte + l'icône d'une matière. Une seule fois, pour les deux plateformes. */
export function subjectMeta(label = '') {
  const l = String(label).toLowerCase()
  for (const [re, icon, color] of RULES) if (re.test(l)) return { icon, color }
  return FALLBACK
}
export const subjectHue = label => subjectMeta(label).color

// Les lieux de la journée d'école (arrivée, récré, cantine…) — même famille visuelle.
export const PLACES = {
  arrivee: { icon: 'LogIn',           color: N.slate },
  sortie:  { icon: 'LogOut',          color: N.slate },
  recre:   { icon: 'Trees',           color: SERIES[5] },
  cantine: { icon: 'UtensilsCrossed', color: SERIES[4] },
  etude:   { icon: 'NotebookPen',     color: BRAND.indigo },
}
