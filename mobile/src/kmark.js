// LA MARQUE KOGIA, côté natif : un simple adaptateur react-native-svg.
// La géométrie vit dans core/src/mark.js, partagée avec le web.
// Une seule illustration dans tout l'écosystème : LA MARQUE. Les mascottes
// dessinées sont retirées — deux styles pour une entreprise, c'est zéro identité.
// Source : brand/KOGIA_HARMONY.md §4
import Svg, { Path } from 'react-native-svg'
import { MARK_VIEWBOX, MARK_PATH } from '@core/mark.js'
import { BRAND } from '@core/tokens.js'

export function KogiaMark({ size = 64, color = BRAND.indigo }) {
  return (
    <Svg width={size} height={size} viewBox={MARK_VIEWBOX}>
      <Path d={MARK_PATH.d} fillRule="evenodd" fill={color} />
    </Svg>
  )
}
