// ── Les matières, côté web : un simple ADAPTATEUR ───────────────────────────
//
// La table des matières (regex → icône → teinte) vit UNE seule fois, dans
// core/src/subjects.js, partagée mot pour mot par le web et le natif. Avant, la
// teinte d'une matière était décidée ici ET dans db.js, et les deux n'étaient pas
// d'accord : « Mathématiques » n'avait pas la même couleur au web et sur mobile.
//
// Ce fichier ne fait plus qu'une chose : traduire la clé d'icône du cœur en
// composant lucide-react. Aucune couleur ne se décide ici.
// Source : brand/KOGIA_HARMONY.md §3.4
import { Calculator, FlaskConical, BookOpen, BookText, Languages, Music, Palette, Monitor,
  Dumbbell, MoonStar, Landmark, UtensilsCrossed, Trees, LogIn, LogOut, NotebookPen } from 'lucide-react'
import { subjectMeta as coreSubjectMeta, PLACES as CORE_PLACES } from '@core/subjects.js'

const ICONS = { Calculator, FlaskConical, BookOpen, BookText, Languages, Music, Palette,
  Monitor, Dumbbell, MoonStar, Landmark, UtensilsCrossed, Trees, LogIn, LogOut, NotebookPen }

/** {Icon, color} — la teinte vient du cœur, jamais d'ici. */
export function subjectMeta(label = '') {
  const { icon, color } = coreSubjectMeta(label)
  return { Icon: ICONS[icon] || NotebookPen, color }
}

export const PLACES = Object.fromEntries(
  Object.entries(CORE_PLACES).map(([k, { icon, color }]) =>
    [k, { Icon: ICONS[icon] || NotebookPen, color }])
)

// La pastille d'une matière. La teinte est une MARQUE (fond + icône), jamais du
// texte : le libellé se compose en encre. C'est ce qui permet d'utiliser la palette
// catégorielle validée sans casser l'AA.
export function SubjectDot({ label, size = 36, iconSize = 17, radius = 'rounded-xl', className = '' }) {
  const { Icon, color } = subjectMeta(label)
  return <span className={`${radius} grid place-items-center shrink-0 ${className}`}
    style={{ width: size, height: size, background: color + '16', color }}><Icon size={iconSize} /></span>
}
