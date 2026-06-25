import { useState } from 'react'
import { Heart, Star } from 'lucide-react'
import PortalShell from '../components/PortalShell.jsx'
import { loadEvals } from '../store.js'
import { studentSummary } from '../results.js'
import { STUDENTS, studentColor } from '../data.js'

export default function Parent(){
  const evals = loadEvals()
  // parent sees their child — pick from students that have an evaluation, default first
  const evaluated = [...new Set(evals.flatMap(e=>Object.values(e.placements).flatMap(p=>Object.keys(p))))]
  const options = STUDENTS.filter(s=>evaluated.includes(s.id))
  const [childId,setChildId] = useState(options[0]?.id)
  if(!evals.length || !options.length) return <PortalShell portal="parent" title="My child"><div className="bg-white rounded-2xl border border-line p-10 text-center text-muted">No evaluations yet. Once a teacher evaluates the class, your child's performance shows here.</div></PortalShell>

  const child = STUDENTS.find(s=>s.id===childId)
  const latest = evals.find(e=>Object.values(e.placements).some(p=>p[childId]))
  const sum = studentSummary(latest, childId)
  return (
    <PortalShell portal="parent" title="My child's performance" subtitle="A friendly snapshot from today's class."
      right={options.length>1 && (
        <select value={childId} onChange={e=>setChildId(e.target.value)} className="text-sm border border-line rounded-lg px-2 py-1 bg-white">
          {options.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}
        </select>)}>
      <div className="max-w-[680px] mx-auto">
        <div className="bg-white rounded-2xl border border-line p-6 text-center">
          <span className="w-16 h-16 rounded-full grid place-items-center text-white text-xl font-bold mx-auto" style={{background:studentColor(child.id)}}>{child.initials}</span>
          <h2 className="text-xl font-bold mt-3">{child.name}</h2>
          <p className="text-muted text-sm">{latest.grade} · {latest.classroom} · {latest.subject}</p>
          <div className="mt-4 inline-flex items-end gap-1">
            <span className="text-5xl font-extrabold accent-text">{sum.score}</span><span className="text-muted mb-2">/100 today</span>
          </div>
          {sum.badge && <div className="mt-2"><span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full accent-soft accent-text text-sm font-semibold"><Star size={14}/> {sum.badge.emoji} {sum.badge.label}</span></div>}
        </div>
        <div className="bg-white rounded-2xl border border-line p-5 mt-4">
          <h3 className="font-semibold mb-3">How {child.name.split(' ')[0]} did</h3>
          <div className="space-y-2">
            {sum.perQ.map((x,i)=>(
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm">{x.q}</span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{background:x.bucket.color}}>{x.bucket.emoji} {x.bucket.label}</span>
              </div>
            ))}
          </div>
          {latest.note && <p className="text-sm text-muted mt-4 border-t border-line pt-3"><b className="text-ink">Teacher note:</b> {latest.note}</p>}
        </div>
        <p className="text-center text-xs text-muted mt-4 flex items-center justify-center gap-1"><Heart size={12}/> Shared privately with you by the school</p>
      </div>
    </PortalShell>
  )
}
