import { mentionFor } from '../results.js'

// La carte « par matière & leçon » — le cœur du produit, réutilisée partout
// (fiche élève Direction, tableau de bord Parent, vue matière).
// data = [{subject, avg, lessons:[{lesson, avg, count}]}]
export default function LessonMap({ data, compact=false }){
  if(!data?.length) return null
  return (
    <div className={`grid gap-2.5 ${compact?'sm:grid-cols-2':'sm:grid-cols-2 lg:grid-cols-3'}`}>
      {data.map(s=>{ const m=mentionFor(s.avg); return (
        <div key={s.subject} className="rounded-xl border border-line bg-white p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-sm truncate">{s.subject}</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0" style={{background:m.color+'1E',color:m.color}}>{s.avg}/100</span></div>
          <div className="space-y-1">
            {s.lessons.map(l=>{ const lm=mentionFor(l.avg); return (
              <div key={l.lesson} className="flex items-center gap-2 text-xs" title={`${l.lesson} · ${l.count} évaluation(s)`}>
                <span className="w-24 truncate text-muted shrink-0">{l.lesson}</span>
                <div className="flex-1 h-1.5 rounded-full bg-canvas overflow-hidden"><div className="h-full rounded-full" style={{width:`${l.avg}%`,background:lm.color}}/></div>
                <span className="font-bold w-8 text-right shrink-0" style={{color:lm.color}}>{l.avg}</span>
              </div>)})}
          </div>
        </div>)})}
    </div>
  )
}
