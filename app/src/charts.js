// ── Langage visuel des graphiques ───────────────────────────────────────────
//
// Une seule source pour les couleurs, la grille, les axes et les infobulles :
// tous les graphiques de l'application doivent se lire comme un même système,
// clair, doux, reposant pour les yeux.
//
// Les palettes ci-dessous ont été VALIDÉES (bande de clarté, plancher de chroma,
// séparation daltonisme, contraste sur le fond), pas choisies à l'œil :
//   catégorielle : pire paire adjacente ΔE 18.1 (deutan) · 18.6 (tritan) — contraste ≥ 3:1
//   statuts       : ΔE 26.9 (deutan) · 30.6 (tritan) — contraste ≥ 3:1
//   niveaux       : ΔE 26.9 (deutan) · 10.8 (tritan) → la séparation tritan est dans la
//                   bande plancher : elle n'est acceptable QUE parce que chaque niveau
//                   porte aussi une icône et un libellé (jamais la couleur seule).
//
// Règles tenues ici :
//  • les teintes catégorielles sont attribuées dans un ORDRE FIXE, jamais recyclées ;
//  • la couleur suit l'entité, pas son rang (un filtre ne repeint pas les survivants) ;
//  • jamais deux axes Y ; jamais d'arc-en-ciel pour une échelle de grandeur ;
//  • le texte porte les couleurs de texte, jamais celle de la série ;
//  • grille et axes sont discrets ; les marques sont fines.

// Ordre fixe. La 7ᵉ série n'existe pas : on regroupe en « Autre ».
export const SERIES = ['#5B6EE1', '#0E9488', '#C97C1E', '#DC4B54', '#7C5CD6', '#0E7FB8']

// Statuts réservés — jamais réutilisés comme « série 4 ».
export const OK = '#12946F'
export const WARN = '#C97C1E'
export const DANGER = '#DC4B54'
export const INFO = '#0E7FB8'
export const NEUTRAL = '#94A3B8'

// Niveaux d'évaluation, du meilleur au plus faible (toujours accompagnés d'une icône).
export const LEVELS = [OK, INFO, WARN, DANGER]

// Fonds très pâles, pour les pastilles et les aplats.
export const SOFT = {
  [OK]: '#E7F5F0', [WARN]: '#FBF1E3', [DANGER]: '#FBEBEC', [INFO]: '#E6F1F8', [NEUTRAL]: '#F1F4F8',
}

// ── Éléments récessifs ──────────────────────────────────────────────────────
export const INK = '#1E2433'
export const MUTED = '#7C879B'
export const GRID = '#EEF1F6'
export const SURFACE = '#FFFFFF'

// À étaler sur les composants Recharts : axes sans ligne, graduations discrètes.
export const axis = {
  tick: { fontSize: 11, fill: MUTED },
  axisLine: false,
  tickLine: false,
}
// Grille horizontale seule, très pâle : elle guide sans jamais concurrencer la donnée.
export const grid = {
  stroke: GRID,
  strokeDasharray: '0',
  vertical: false,
}
// Infobulle douce : coins arrondis, ombre légère, pas de bordure dure.
export const tooltip = {
  cursor: { fill: 'rgba(91,110,225,.05)' },
  contentStyle: {
    borderRadius: 14,
    border: `1px solid ${GRID}`,
    background: SURFACE,
    fontSize: 12,
    padding: '8px 12px',
    boxShadow: '0 10px 30px -12px rgba(30,36,51,.18)',
  },
  labelStyle: { color: MUTED, fontWeight: 600, marginBottom: 2 },
  itemStyle: { color: INK, fontWeight: 700 },
}

// Marques fines, extrémités arrondies côté valeur, ancrées à la ligne de base.
export const BAR_RADIUS = [6, 6, 0, 0]
export const BAR_RADIUS_H = [0, 6, 6, 0]
export const BAR_SIZE = 22
export const LINE_WIDTH = 2
export const DOT_SIZE = 8

// Dégradé d'aire : opaque à 22 % en haut, transparent en bas.
export const areaGradient = (id, color) => ({ id, color })
