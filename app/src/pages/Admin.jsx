import { useState } from 'react'
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Inbox, Users, Award } from 'lucide-react'
import PortalShell from '../components/PortalShell.jsx'
import { loadEvals } from '../store.js'
import { bucketTotals, studentSummary, studentName } from '../results.js'

export default function Admin(){
  const evals = loadEvals()
  const [sel,setSel] = useState(0)
  if(!evals.length) return <PortalShell portal="admin" title="Evaluations"><Empty/></PortalShell>
  const ev = evals[sel]
  const totals = bucketTotals(ev)
  const studs = [...new Set(Object.values(ev.placements).flatMap(p=>Object.keys(p)))]
  return (
    <PortalShell portal="admin" title="Evaluations" subtitle="Live student performance from teachers, as it happens.">
      <div className="grid lg:grid-cols-[280px_1fr] gap-5">
        <div className="bg-white rounded-2xl border border-line p-3 h-fit">
          <div className="text-xs font-semibold text-muted px-2 mb-2 flex items-center gap-1.5"><Inbox size={14}/> {evals.length} evaluations</div>
          {evals.map((e,i)=>(
            <button key={e.id} onClick={()=>setSel(i)} className={`w-full text-left p-3 rounded-xl mb-1 ${i===sel?'accent-soft':''}`}>
              <div className="font-semibold text-sm">{e.grade} · {e.classroom}</div>
              <div className="text-xs text-muted">{e.subject} · {new Date(e.at).toLocaleString()}</div>
            </button>
          ))}
        </div>
        <div className="space-y-5">
          <div className="grid sm:grid-cols-3 gap-3">
            <Stat icon={<Users size={18}/>} label="Students" value={studs.length}/>
            <Stat icon={<Award size={18}/>} label="Badges given" value={Object.keys(ev.badges||{}).length}/>
            <Stat icon={<Inbox size={18}/>} label="Subject" value={ev.subject}/>
          </div>
          <div className="bg-white rounded-2xl border border-line p-5">
            <h3 className="font-semibold mb-3">Performance distribution</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={totals}>
                  <XAxis dataKey="name" tick={{fontSize:12,fill:'#64748B'}}/><YAxis tick={{fontSize:11,fill:'#64748B'}} allowDecimals={false}/>
                  <Tooltip/><Bar dataKey="value" radius={[6,6,0,0]}>{totals.map((t,i)=><Cell key={i} fill={t.color}/>)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-line p-5">
            <h3 className="font-semibold mb-3">Students</h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {studs.map(sid=>{ const s=studentSummary(ev,sid); return (
                <div key={sid} className="flex items-center justify-between border border-line rounded-xl px-3 py-2">
                  <div className="text-sm font-medium">{studentName(sid)} {s.badge&&<span title={s.badge.label}>{s.badge.emoji}</span>}</div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 rounded-full bg-canvas overflow-hidden"><div className="h-full accent-bg" style={{width:`${s.score}%`}}/></div>
                    <span className="text-xs font-bold w-9 text-right">{s.score}%</span>
                  </div>
                </div>) })}
            </div>
          </div>
          {ev.note && <div className="bg-white rounded-2xl border border-line p-4 text-sm"><b>Teacher note:</b> {ev.note}</div>}
        </div>
      </div>
    </PortalShell>
  )
}
function Stat({icon,label,value}){ return (
  <div className="bg-white rounded-2xl border border-line p-4">
    <div className="w-9 h-9 rounded-lg grid place-items-center accent-soft accent-text mb-2">{icon}</div>
    <div className="text-xs text-muted">{label}</div><div className="text-lg font-bold">{value}</div>
  </div>) }
function Empty(){ return <div className="bg-white rounded-2xl border border-line p-10 text-center text-muted">No evaluations yet. Open the <b>Teacher</b> portal and submit one — it appears here instantly.</div> }
