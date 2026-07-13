// ════════════════════════════════════════════════════════════════════════════
// LA MARQUE KOGIA — un K. Et, dans son négatif, une nageoire caudale.
//
// ON VOIT D'ABORD UN K. Puis on remarque que les deux bras ne sont pas des bras :
// ce sont les deux LOBES d'une queue de cachalot, réunis sur un pédoncule, avec
// l'encoche médiane en espace négatif. Comme la flèche de FedEx : rien n'est
// dessiné, tout est suggéré — et une fois vue, on ne peut plus la « dé-voir ».
//
// CE QU'IL N'Y A PAS, ET C'EST VOULU :
//   • PAS D'ŒIL. Un œil fait une créature, donc une mascotte. C'était le défaut
//     de TOUTES les versions précédentes de ce logo.
//   • Pas de corps, pas de sourire, pas de jet, pas de dégradé, rien de mignon.
//     Kogia Group est une entreprise de technologie.
//
// L'animal est présent par ses QUALITÉS — compact, calme, intelligent, courbes
// lisses, mouvement minimal, eaux profondes — jamais par son portrait.
//
// Aplat. Prend la couleur de la FAMILLE du produit (currentColor). Grille 64.
// Testé à 16 px, en monochrome et en NOIR PUR avant d'être retenu.
// Source : brand/KOGIA_HARMONY.md §4
// ════════════════════════════════════════════════════════════════════════════

export const MARK_VIEWBOX = '0 0 64 64'

/** Les trois tracés de la marque : la hampe, le lobe haut, le lobe bas. */
export const MARK_PARTS = [
  'M10 14.25 a4.25 4.25 0 0 1 8.5 0 v35.5 a4.25 4.25 0 0 1 -8.5 0 Z',
  'M21 32 C34 29 45 21 54 9 L58.5 14.5 C50 27 39 34.5 26 35.5 Z',
  'M21 32 C34 35 45 43 54 55 L58.5 49.5 C50 37 39 29.5 26 28.5 Z',
]
