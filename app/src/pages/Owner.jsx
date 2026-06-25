import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { TrendingUp, ClipboardList, Award } from 'lucide-react'
import PortalShell from '../components/PortalShell.jsx'
import { loadEvals } from '../store.js'
import { bucketTotals } from '../results.js'
import { BUCKETS } from '../data.js'

export default function Owner(){
  const evals = loadEvals()
  const agg = Object.fromEntries(BUCKETS.map(b=>[b.label,0]))
  evals.forEach(ev=>bucketTotals(ev).forEach(t=>agg[t.name]+=t.value))
  const data = BUCKETS.map(b=>({name:b.label,value:agg[b.label],color:b.color})).filter(d=>d.value)
  const totalPlacements = data.reduce((s,d)=>s+d.value,0)
  const badges = evals.reduce((s,e)=>s+Object.keys(e.badges||{}).length,0)
  return (
    <PortalShell portal="owner" title="School performance" subtitle="Executive overview across all classes.">
      <div className="grid sm:grid-cols-3 gap-3 mb-5">
        <Stat icon={<ClipboardList size={18}/>} label="Evaluations" value={evals.length}/>
        <Stat icon={<TrendingUp size={18}/>} label="Data points" value={totalPlacements}/>
        <Stat icon={<Award size={18}/>} label="Badges awarded" value={badges}/>
      </div>
      <div className="bg-white rounded-2xl border border-line p-5">
        <h3 className="font-semibold mb-3">Overall performance mix</h3>
        {data.length? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={2}>
                  {data.map((d,i)=><Cell key={i} fill={d.color}/>)}
                </Pie><Tooltip/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : <p className="text-muted text-center py-12">No data yet — evaluations from teachers will appear here.</p>}
        <div className="flex flex-wrap gap-4 justify-center mt-2">
          {data.map(d=><span key={d.name} className="flex items-center gap-1.5 text-sm"><i className="w-3 h-3 rounded-full" style={{background:d.color}}/>{d.name} · {d.value}</span>)}
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
