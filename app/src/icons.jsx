// Résolution des icônes du cœur, côté web.
//
// `core/` désigne ses icônes par leur NOM ("Star", "Radio", …) pour ne dépendre
// d'aucune bibliothèque de rendu. Ce fichier est la moitié web de ce contrat ;
// l'application Android a le sien, qui pointe sur `lucide-react-native`.
// Les deux exposent la même chose : <Ic n="Star"/>.
import * as L from 'lucide-react'

export const iconOf = name => L[name] || L.Circle

export function Ic({ n, ...rest }) {
  const C = iconOf(n)
  return <C {...rest} />
}
