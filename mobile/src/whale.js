// La marque « Coreon Edu » — le cachalot du logo, dessiné au trait exact.
// Deux calques séparés (corps+œil / jet) pour que Welcome puisse faire
// apparaître le jet APRÈS le corps ; Whale() les réunit pour l'usage courant.
import Svg, { Path, Circle } from 'react-native-svg'

export const WHALE_VB = '0 0 132 96'
const BODY = 'M12 54 C12 34 28 22 52 22 C74 22 88 32 91 46 C94 38 99 30 107 25 C105 32 104 38 105 43 C110 41 117 41 124 44 C117 48 111 50 106 50 C102 62 92 70 76 73 C58 76 34 74 22 68 C14 64 12 60 12 54 Z'
const SPRAY_1 = 'M42 12 q-1 -7 5 -9'
const SPRAY_2 = 'M50 12 q4 -6 11 -6'

// Corps + œil (l'œil est « percé » dans la couleur du fond passé en `eye`).
export const WhaleBody = ({ size = 132, color = '#FFFFFF', eye = '#6366F1', style }) => (
  <Svg width={size} height={size * 96 / 132} viewBox={WHALE_VB} style={style}>
    <Path d={BODY} fill={color} />
    <Circle cx={34} cy={45} r={4.2} fill={eye} />
  </Svg>
)

// Le jet, seul — même viewBox pour se superposer pile sur le corps.
export const WhaleSpray = ({ size = 132, color = '#FFFFFF', style }) => (
  <Svg width={size} height={size * 96 / 132} viewBox={WHALE_VB} style={style}>
    <Path d={SPRAY_1} stroke={color} strokeWidth={3.4} strokeLinecap="round" fill="none" opacity={0.85} />
    <Path d={SPRAY_2} stroke={color} strokeWidth={3.4} strokeLinecap="round" fill="none" opacity={0.85} />
  </Svg>
)

// La marque complète, statique — pour Login et tout autre écran.
export const Whale = ({ size = 132, color = '#FFFFFF', eye = '#6366F1', style }) => (
  <Svg width={size} height={size * 96 / 132} viewBox={WHALE_VB} style={style}>
    <Path d={BODY} fill={color} />
    <Circle cx={34} cy={45} r={4.2} fill={eye} />
    <Path d={SPRAY_1} stroke={color} strokeWidth={3.4} strokeLinecap="round" fill="none" opacity={0.85} />
    <Path d={SPRAY_2} stroke={color} strokeWidth={3.4} strokeLinecap="round" fill="none" opacity={0.85} />
  </Svg>
)
