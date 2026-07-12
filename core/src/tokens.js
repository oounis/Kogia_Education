// ============================================================================
// Kogia Harmony — jetons de conception, miroir exact de
//   KogiaGroup/brand/tokens/kogia.js  (source de vérité : brand/KOGIA_HARMONY.md)
//
// Aucune couleur ne se décide ici : ce fichier RECOPIE le livre de marque.
// Si vous êtes sur le point d'écrire un hexadécimal dans un écran : ne le faites
// pas. Ajoutez-le au livre de marque d'abord, puis recopiez-le ici.
//
// Web et mobile lisent tous les deux ce fichier — c'est ce qui garantit qu'il n'y
// a plus « deux encres », « deux canvas » et « quatre yeux de baleine ».
// ============================================================================

/** L'eau : les neutres. Identiques dans tous les produits Kogia. */
export const N = {
  abyss:   '#071726', // fond sombre
  ink:     '#0E2135', // texte principal — 16.3:1 sur blanc
  slate:   '#5B6B7D', // texte secondaire — 5.46:1 sur blanc, 5.08:1 sur canvas
  line:    '#DCE3EB',
  canvas:  '#F4F7FA', // marine et froid, jamais un gris neutre
  surface: '#FFFFFF',
  pearl:   '#FDF6F0', // la lumière du croissant — la seule surface CHAUDE (loi 4)
}

/** Le corps vu à travers l'eau : la marque. */
export const BRAND = {
  indigo: '#4F57DE', // LA primaire. 5.60:1 en texte ET 5.60:1 en blanc-sur-elle
  violet: '#8B5CF6', // 4.23:1 — grands textes, aplats, partenaire de dégradé
  cyan:   '#22D3EE', // 1.81:1 — DÉCORATIF UNIQUEMENT. Jamais du texte.
}

/** Le nuage d'encre — la voie de Kogia Job. Coreon n'y touche que pour la chaleur. */
export const TERRA = {
  base: '#E85D2F', // 3.48:1 — aplats, marques
  deep: '#C2410C', // 5.18:1 — terracotta EN TEXTE
  ink:  '#7C2D12', // 9.37:1 sur blanc
}

/** Réservés. Jamais une couleur de marque, jamais une série. Toujours avec une icône ou un mot. */
export const STATUS = {
  ok:      '#12946F', okSoft:      '#E7F5F0',
  warn:    '#C97C1E', warnSoft:    '#FBF1E3',
  danger:  '#DC4B54', dangerSoft:  '#FBEBEC',
  info:    '#0E7FB8', infoSoft:    '#E6F1F8',
  neutral: '#7C879B', neutralSoft: '#F1F4F8',
}

/**
 * Données. Ordre FIXE, jamais recyclé. La 7ᵉ série n'existe pas : on regroupe en « Autre ».
 * Les quatre contrôles passent (bande de clarté, plancher de chroma, daltonisme, contraste).
 */
export const SERIES = ['#4361D0', '#0FA396', '#D2603A', '#9061F0', '#B07414', '#2F8050']
export const GRID = '#EEF1F6'

/** Type. Sora est le fil qui relie tous les produits ; Nunito est la voix de Coreon Edu. */
export const FONT = {
  display: 'Sora',   // tous les produits, sans exception
  text:    'Nunito', // Coreon Edu — une école n'est pas une banque
  bodyWeight: '500', // un cran au-dessus : tout paraît délibérément fabriqué
}

/** Quatre rayons. Il n'y en a pas un cinquième. */
export const R = { control: 12, card: 16, tile: 24, pill: 999 }

/** Grille de 4 px. */
export const SP = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40 }

/** Une seule lumière, au-dessus de l'eau. (Props d'ombre React Native.) */
export const SH = {
  1: { shadowColor: N.ink, shadowOpacity: 0.05, shadowRadius: 2,  shadowOffset: { width: 0, height: 1 },  elevation: 1 },
  2: { shadowColor: N.ink, shadowOpacity: 0.12, shadowRadius: 18, shadowOffset: { width: 0, height: 8 },  elevation: 4 },
  3: { shadowColor: N.ink, shadowOpacity: 0.20, shadowRadius: 30, shadowOffset: { width: 0, height: 16 }, elevation: 10 },
}

/** L'immobilité est l'état de repos. Le mouvement explique un changement, il ne décore pas. */
export const T = { micro: 160, standard: 220, deliberate: 320, welcome: 600 }
export const EASE = 'cubic-bezier(.2,.8,.2,1)'

/** La voie de Coreon Edu : confiance, soin, famille. Froid, calme, parental. */
export const EDU = { accent: BRAND.indigo, accent2: BRAND.violet, tint: '#EEF0FE' }

// ── Utilitaires de dérivation ───────────────────────────────────────────────
// Éclaircir une couleur de marque vers le blanc n'INVENTE pas une couleur : cela
// produit une teinte de la même couleur. C'est ainsi qu'on obtient les aplats des
// rôles sans ajouter sept hexadécimaux au livre de marque.
const hx = n => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0')
export const mix = (hex, pct, towards = N.surface) => {
  const a = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16))
  const b = [1, 3, 5].map(i => parseInt(towards.slice(i, i + 2), 16))
  return '#' + a.map((v, i) => hx(v + (b[i] - v) * pct)).join('').toUpperCase()
}
/** L'aplat très pâle d'une couleur : le fond d'une pastille, d'une tuile d'icône.
 *  0.95 n'est pas un chiffre esthétique : c'est le seuil mesuré à partir duquel
 *  les SEPT accents de rôle gardent ≥ 4.5:1 en texte sur leur propre aplat. */
export const soften = hex => mix(hex, 0.95)
/** Assombrir vers l'encre : sert à donner du relief SANS jamais baisser le contraste. */
export const deepen = hex => mix(hex, 0.18, N.ink)

/** Raccourci : la palette qu'un écran importe réellement. */
export const C = { ...N, ...BRAND, ...STATUS }
