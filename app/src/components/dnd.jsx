import { useDraggable, useDroppable } from '@dnd-kit/core'
import { Avatar } from './ui.jsx'

// Le glisser-déposer est le cœur du produit : il doit rester utilisable au clavier
// et annoncé aux lecteurs d'écran. dnd-kit fournit un KeyboardSensor (branché dans
// Evaluate.jsx) : espace/entrée saisit l'élève, les flèches le déplacent d'une zone
// à l'autre, espace/entrée le dépose, échap annule.
export function StudentChip({ student, overlay = false, bucketLabel = null }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: student.id, data: { student } })
  const where = bucketLabel ? `, actuellement dans « ${bucketLabel} »` : ', pas encore placé'
  return (
    <button ref={setNodeRef} {...listeners} {...attributes}
      aria-roledescription="élève déplaçable"
      aria-label={`${student.name}${where}. Appuyez sur espace pour saisir, puis les flèches pour choisir une réponse.`}
      className={`no-select flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-line bg-white shadow-sm hover:shadow text-sm font-medium cursor-grab active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${isDragging && !overlay ? 'opacity-30' : ''} ${overlay ? 'shadow-xl scale-105' : ''}`}>
      <Avatar name={student.name} seed={student.id} size={28} />
      {student.name}
    </button>
  )
}

export function DropZone({ id, children, className = '', label }) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <div ref={setNodeRef} role="group" aria-label={label}
      data-over={isOver || undefined}
      className={`${className} ${isOver ? 'drop-hot' : ''}`}>{children}</div>
  )
}

// Messages lus par les lecteurs d'écran pendant un déplacement au clavier.
export const dndAnnouncements = buckets => {
  const zone = id => id === 'pool' ? 'la liste des élèves' : `« ${buckets.find(b => b.key === id)?.label || id} »`
  return {
    onDragStart: ({ active }) => `${active.data.current?.student?.name || 'Élève'} saisi. Utilisez les flèches pour choisir une réponse, espace pour déposer.`,
    onDragOver: ({ active, over }) => over ? `${active.data.current?.student?.name || 'Élève'} au-dessus de ${zone(over.id)}.` : '',
    onDragEnd: ({ active, over }) => over
      ? `${active.data.current?.student?.name || 'Élève'} déposé dans ${zone(over.id)}.`
      : `Déplacement annulé, ${active.data.current?.student?.name || "l'élève"} revient à sa place.`,
    onDragCancel: ({ active }) => `Déplacement annulé, ${active.data.current?.student?.name || "l'élève"} revient à sa place.`,
  }
}
