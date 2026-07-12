// La marque « Coreon Edu », côté natif : un simple ADAPTATEUR react-native-svg.
//
// Le dessin ne vit plus ici. Il vit UNE fois, dans core/src/mark.js, partagé mot
// pour mot avec le web. Avant, le web dessinait une baleine (avec sourire et
// nageoire), le mobile en dessinait une autre (sans), et l'œil avait QUATRE
// couleurs différentes selon l'écran (#6366F1, #6D60F2, #7360F3, #312E81).
//
// Et il manquait LE CROISSANT — la « fausse branchie » que l'animal porte
// derrière l'œil, le trait le plus distinctif de Kogia. Il est là maintenant.
//
// Deux calques restent séparés (corps / jet) pour que Welcome fasse apparaître le
// jet APRÈS le corps. Source : brand/KOGIA_HARMONY.md §4
import Svg, { Path, Circle } from 'react-native-svg'
import { VIEWBOX, RATIO, BODY, EYE, CRESCENT, SPOUT } from '@core/mark.js'

export const WHALE_VB = VIEWBOX

// Le croissant : posé sur le corps, dans la lumière perlée. C'est la signature.
const Crescent = ({ color = CRESCENT.stroke }) => (
  <Path d={CRESCENT.d} stroke={color} strokeWidth={CRESCENT.width}
    strokeLinecap="round" fill="none" opacity={CRESCENT.opacity} />
)

// Corps + œil + croissant (l'œil est « percé » dans la couleur passée en `eye`).
export const WhaleBody = ({ size = 132, color = '#FFFFFF', eye = EYE.fill, crescent, style }) => (
  <Svg width={size} height={size * RATIO} viewBox={WHALE_VB} style={style}>
    <Path d={BODY} fill={color} />
    <Circle cx={EYE.cx} cy={EYE.cy} r={EYE.r} fill={eye} />
    <Crescent color={crescent} />
  </Svg>
)

// Le jet, seul — même viewBox pour se superposer pile sur le corps.
export const WhaleSpray = ({ size = 132, color = '#FFFFFF', style }) => (
  <Svg width={size} height={size * RATIO} viewBox={WHALE_VB} style={style}>
    {SPOUT.d.map((d, i) => (
      <Path key={i} d={d} stroke={color} strokeWidth={SPOUT.width}
        strokeLinecap="round" fill="none" opacity={SPOUT.opacity} />
    ))}
  </Svg>
)

// La marque complète, statique — pour Login et tout autre écran.
export const Whale = ({ size = 132, color = '#FFFFFF', eye = EYE.fill, crescent, style }) => (
  <Svg width={size} height={size * RATIO} viewBox={WHALE_VB} style={style}>
    <Path d={BODY} fill={color} />
    <Circle cx={EYE.cx} cy={EYE.cy} r={EYE.r} fill={eye} />
    <Crescent color={crescent} />
    {SPOUT.d.map((d, i) => (
      <Path key={i} d={d} stroke={color} strokeWidth={SPOUT.width}
        strokeLinecap="round" fill="none" opacity={SPOUT.opacity} />
    ))}
  </Svg>
)
