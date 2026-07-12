// ════════════════════════════════════════════════════════════════════════════
// LA MARQUE KOGIA — un seul tracé, partagé mot pour mot par le web et le natif.
//
// Le K ET le cachalot sont la MÊME silhouette : tête busquée → œil → corps →
// pédoncule → nageoire caudale, où la caudale EST le bras du K et le creux entre
// les deux lobes EST le creux du K. Comme la flèche de FedEx : on voit la lettre,
// puis on voit l'animal, et on ne peut plus le « dé-voir ».
//
// L'ŒIL EST UN TROU (fill-rule evenodd), jamais un point blanc : un point blanc
// trahit le logo dès qu'on le pose sur une couleur.
//
// APLAT, jamais de dégradé — un logo doit tenir sur un tampon, une facture, une
// icône monochrome, en impression. Il prend la couleur de la FAMILLE du produit.
//
// Ce fichier ne contient PLUS la baleine dessinée (corps, sourire, nageoire, jet,
// croissant) : la mascotte cartoon est retirée. Une entreprise, une illustration.
// Source : brand/KOGIA_HARMONY.md §4
// ════════════════════════════════════════════════════════════════════════════

export const MARK_VIEWBOX = '0 0 64 64'

export const MARK_PATH = {
  d: 'M18 10 a10 10 0 0 1 10 10 v8.5 L51 9 L55.5 13.5 Q43.5 25 40.5 32 Q43.5 39 55.5 50.5 L51 55 L28 35.5 V44 a10 10 0 0 1 -20 0 V20 A10 10 0 0 1 18 10 Z M18 17.5 a3.6 3.6 0 1 0 0 7.2 a3.6 3.6 0 0 0 0 -7.2 Z',
  rule: 'evenodd',
}
