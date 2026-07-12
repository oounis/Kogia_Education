// ── Langage visuel des graphiques ───────────────────────────────────────────
//
// Une seule source pour les couleurs, la grille, les axes et les infobulles :
// tous les graphiques de l'application doivent se lire comme un même système.
//
// Les valeurs ne sont plus décidées ici : elles viennent de tokens.js, qui recopie
// KOGIA_HARMONY.md §3.4. La palette a été VALIDÉE (bande de clarté, plancher de
// chroma, séparation daltonisme, contraste) — pas choisie à l'œil.
//
// Règles tenues ici :
//  • les teintes catégorielles sont attribuées dans un ORDRE FIXE, jamais recyclées ;
//  • la 7ᵉ série n'existe pas : on regroupe en « Autre » ;
//  • la couleur suit l'entité, pas son rang (un filtre ne repeint pas les survivants) ;
//  • jamais deux axes Y ; jamais d'arc-en-ciel pour une échelle de grandeur ;
//  • LE TEXTE PORTE LES COULEURS DE TEXTE, jamais celle de la série ;
//  • les statuts ne servent JAMAIS de couleur de série.
import { SERIES as S, STATUS, N, GRID as G, BRAND } from './tokens.js'

// Ordre fixe. La 7ᵉ série n'existe pas : on regroupe en « Autre ».
export const SERIES = S
export const OTHER_LABEL = 'Autre'

// Statuts réservés — jamais réutilisés comme « série 4 ».
export const OK = STATUS.ok
export const WARN = STATUS.warn
export const DANGER = STATUS.danger
export const INFO = STATUS.info
export const NEUTRAL = STATUS.neutral

// Niveaux d'évaluation, du meilleur au plus faible (toujours accompagnés d'une icône :
// la séparation tritan est en bande plancher, la couleur seule ne suffit jamais).
export const LEVELS = [OK, INFO, WARN, DANGER]

// Fonds très pâles, pour les pastilles et les aplats.
export const SOFT = {
  [OK]: STATUS.okSoft, [WARN]: STATUS.warnSoft, [DANGER]: STATUS.dangerSoft,
  [INFO]: STATUS.infoSoft, [NEUTRAL]: STATUS.neutralSoft,
}

// ── Éléments récessifs ──────────────────────────────────────────────────────
export const INK = N.ink
export const MUTED = STATUS.neutral   // #7C879B — le gris de texte secondaire des graphiques
export const GRID = G
export const SURFACE = N.surface

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
// Infobulle douce : coins arrondis (16 = rayon « carte »), ombre sh-2, pas de bordure dure.
export const tooltip = {
  cursor: { fill: BRAND.indigo + '0D' },
  contentStyle: {
    borderRadius: 16,
    border: `1px solid ${GRID}`,
    background: SURFACE,
    fontSize: 12,
    padding: '8px 12px',
    boxShadow: '0 10px 30px -12px rgb(14 33 53 / .12)',
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
