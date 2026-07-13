// LA MARQUE, côté natif : un adaptateur react-native-svg.
// La géométrie vit une seule fois dans core/src/mark.js, partagée avec le web.
// Un K ; dans son négatif, une nageoire caudale. Pas d'œil, pas de mascotte.
// Source : brand/KOGIA_HARMONY.md §4
import Svg, { Path } from 'react-native-svg'
import { MARK_VIEWBOX, MARK_PARTS } from '@core/mark.js'
import { BRAND } from '@core/tokens.js'

export function KogiaMark({ size = 64, color = BRAND.action }) {
  return (
    <Svg width={size} height={size} viewBox={MARK_VIEWBOX}>
      {MARK_PARTS.map((d, i) => <Path key={i} d={d} fill={color} />)}
    </Svg>
  )
}
