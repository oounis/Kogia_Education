import { useState, useMemo } from 'react'
import { current } from '../auth.js'
import { db, mutate, studentById, classById } from '../db.js'
import { notify } from '../notify.js'
import { PageHead, Card, StatCard, SectionCard, Avatar, Btn, Badge, EmptyState, STATUS } from '../components/ui.jsx'
import { currentClass } from '../data.js'
import { Check, CalendarCheck, UserX, Clock, AlertTriangle, BellRing, TrendingUp, Users, BriefcaseBusiness } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import toast from 'react-hot-toast'

const CYCLE={present:'absent',absent:'late',late:'present'}
const COL={present:STATUS.ok,absent:STATUS.danger,late:STATUS.warn}
const FR={present:'Présent',absent:'Absent',late:'Retard'}

export default function Attendance(){
  const u=current()
  if(['schooladmin','admin'].includes(u.role)) return <SchoolView/>
  return <MarkView/>
}

/* ── Direction / Administration : vue école (élèves) ────────────────────── */
function SchoolView(){
  return (<>
    <PageHead title="Présence — vue école" sub="Le suivi de présence des élèves. La présence du personnel a son propre module."
      action={<Btn variant="soft" onClick={()=>{location.hash='#/app/staff'}}><BriefcaseBusiness size={15}/> Personnel</Btn>}/>
    <StudentsInsights/>
  </>)
}

function StudentsInsights(){
  const d=db(); const [,force]=useState(0)
  const A=useMemo(()=>{
    const days={} // iso → {present,absent,late, absents:[{sid,classId,status}]}
    for(const key in (d.attendance||{})){
      const i=key.indexOf('_'); const classId=key.slice(0,i), iso=key.slice(i+1)
      const day=days[iso]=days[iso]||{present:0,absent:0,late:0,absents:[]}
      for(const [sid,st] of Object.entries(d.attendance[key])){
        day[st]!=null&&day[st]++
        if(st!=='present') day.absents.push({sid,classId,status:st})
      }
    }
    const dates=Object.keys(days).sort()
    const latest=dates[dates.length-1]
    // 30 derniers jours : cumuls par élève et par classe
    const cutoff=new Date(Date.now()-30*86400000).toISOString().slice(0,10)
    const perStudent={}, perClass={}
    for(const key in (d.attendance||{})){
      const i=key.indexOf('_'); const classId=key.slice(0,i), iso=key.slice(i+1)
      if(iso<cutoff) continue
      const pc=perClass[classId]=perClass[classId]||{present:0,absent:0,late:0}
      for(const [sid,st] of Object.entries(d.attendance[key])){
        pc[st]!=null&&pc[st]++
        const ps=perStudent[sid]=perStudent[sid]||{present:0,absent:0,late:0}
        ps[st]!=null&&ps[st]++
      }
    }
    const chronic=Object.entries(perStudent)
      .map(([sid,c])=>({s:studentById(sid),...c,total:c.present+c.absent+c.late}))
      .filter(x=>x.s&&x.absent>=4)
      .sort((a,b)=>b.absent-a.absent)
    const trend=dates.slice(-20).map(iso=>{ const x=days[iso]; const t=x.present+x.absent+x.late
      return {name:format(new Date(iso),'d MMM',{locale:fr}), taux:t?Math.round(x.present/t*100):100} })
    return {days,latest,chronic,perClass,trend}
  },[d])

  if(!A.latest) return <Card><EmptyState icon={<CalendarCheck size={26}/>} title="Aucun appel enregistré" sub="Les appels des enseignants alimenteront cette vue."/></Card>

  const today=A.days[A.latest]
  const total=today.present+today.absent+today.late
  const rate=total?Math.round(today.present/total*100):100
  const dayLabel=format(new Date(A.latest),'EEEE d MMMM',{locale:fr})

  const notifyParent=(s,body)=>{
    const parent=d.users.find(x=>x.id===s.parentId)
    if(!parent) return toast.error(`${s.name} n'a pas de compte parent lié`)
    notify({to:parent.id,kind:'info',actor:'Direction',title:`Présence de ${s.name.split(' ')[0]}`,body})
    toast.success(`Parent de ${s.name.split(' ')[0]} prévenu`); force(x=>x+1)
  }

  return (<>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      <StatCard tint="mint"  icon={<CalendarCheck size={20}/>} value={`${rate}%`} label="Taux de présence" sub={dayLabel}/>
      <StatCard tint="coral" icon={<UserX size={20}/>}         value={today.absent} label="Absents"/>
      <StatCard tint="butter" icon={<Clock size={20}/>}        value={today.late} label="Retards"/>
      <StatCard tint="grape" icon={<AlertTriangle size={20}/>} value={A.chronic.length} label="Absences répétées" sub="≥ 4 sur 30 j"/>
    </div>

    <div className="grid lg:grid-cols-[1fr_360px] gap-4 mb-4">
      <SectionCard icon={<TrendingUp size={16}/>} tint="mint" title="Taux de présence de l'école" sub="20 derniers jours d'école">
        <div className="h-52"><ResponsiveContainer width="100%" height="100%">
          <AreaChart data={A.trend} margin={{top:6,right:6,left:-16,bottom:0}}>
            <defs><linearGradient id="gAtt" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={STATUS.ok} stopOpacity={.3}/><stop offset="100%" stopColor={STATUS.ok} stopOpacity={0}/></linearGradient></defs>
            <XAxis dataKey="name" tick={{fontSize:10,fill:'#8A93A6'}} axisLine={false} tickLine={false} interval="preserveStartEnd"/>
            <YAxis domain={[60,100]} tick={{fontSize:11,fill:'#8A93A6'}} axisLine={false} tickLine={false} unit="%"/>
            <Tooltip contentStyle={{borderRadius:12,border:'1px solid #EDEFF5',fontSize:12}} formatter={v=>[`${v}%`,'Présence']}/>
            <Area type="monotone" dataKey="taux" stroke={STATUS.ok} strokeWidth={2.5} fill="url(#gAtt)"/>
          </AreaChart>
        </ResponsiveContainer></div>
      </SectionCard>

      <SectionCard icon={<UserX size={16}/>} tint="coral" title={`Absents & retards · ${format(new Date(A.latest),'d MMM',{locale:fr})}`} sub="Un clic pour prévenir le parent" bodyClass="p-3 max-h-72 overflow-y-auto scroll-thin">
        {today.absents.length===0 ? <EmptyState icon={<Check size={22}/>} title="Personne ne manque" sub="Tous les élèves sont présents."/>
        : today.absents.map(({sid,classId,status})=>{ const s=studentById(sid); if(!s) return null
          return (
            <div key={sid} className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-canvas">
              <Avatar name={s.name} seed={s.id} size={30}/>
              <span className="min-w-0 flex-1"><span className="block text-sm font-semibold truncate leading-tight">{s.name}</span>
                <span className="block text-[11px] text-muted">{classById(classId)?.name}</span></span>
              <Badge status={status}/>
              <button onClick={()=>notifyParent(s,`${s.name} a été marqué(e) ${FR[status].toLowerCase()} le ${dayLabel}.`)}
                title="Prévenir le parent" className="w-7 h-7 grid place-items-center rounded-lg text-muted hover:accent-text hover:bg-white"><BellRing size={14}/></button>
            </div>) })}
      </SectionCard>
    </div>

    <div className="grid lg:grid-cols-2 gap-4">
      <SectionCard icon={<AlertTriangle size={16}/>} tint="butter" title="Absences répétées — 30 derniers jours" sub="Élèves à suivre de près (4 absences ou plus)" bodyClass="p-3">
        {A.chronic.length===0 ? <EmptyState icon={<Check size={22}/>} title="Aucun absentéisme répété" sub="Aucun élève n'a manqué 4 jours ou plus ce mois-ci."/>
        : A.chronic.map(x=>(
          <div key={x.s.id} className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-canvas">
            <Avatar name={x.s.name} seed={x.s.id} size={34}/>
            <span className="min-w-0 flex-1"><span className="block text-sm font-semibold truncate leading-tight">{x.s.name}</span>
              <span className="block text-[11px] text-muted">{classById(x.s.classId)?.name} · {x.absent} absences · {x.late} retards</span></span>
            <span className="text-sm font-extrabold" style={{color:STATUS.danger}}>{x.total?Math.round(x.absent/x.total*100):0}%</span>
            <Btn size="sm" variant="soft" onClick={()=>notifyParent(x.s,`${x.s.name} cumule ${x.absent} absences sur les 30 derniers jours. Merci de contacter la direction.`)}><BellRing size={13}/> Parent</Btn>
          </div>))}
      </SectionCard>

      <SectionCard icon={<Users size={16}/>} tint="sky" title="Présence par classe" sub="30 derniers jours">
        <div className="space-y-3">
          {Object.entries(A.perClass).map(([cid,c])=>{ const t=c.present+c.absent+c.late; const r=t?Math.round(c.present/t*100):100
            const col=r>=95?STATUS.ok:r>=90?STATUS.warn:STATUS.danger
            return (
              <div key={cid} className="flex items-center gap-3">
                <span className="w-20 text-sm font-bold shrink-0">{classById(cid)?.name||cid}</span>
                <div className="flex-1 h-2.5 rounded-full bg-canvas overflow-hidden"><div className="h-full rounded-full" style={{width:`${r}%`,background:col}}/></div>
                <span className="w-12 text-right text-sm font-extrabold" style={{color:col}}>{r}%</span>
                <span className="w-20 text-right text-xs text-muted">{c.absent} abs · {c.late} ret</span>
              </div>) })}
        </div>
      </SectionCard>
    </div>
  </>)
}

/* ── Enseignant / Surveillant : faire l'appel ───────────────────────────── */
function MarkView(){
  const cls=currentClass(new Date()); const today=new Date().toISOString().slice(0,10); const key=cls.cls.id+'_'+today
  const [marks,setMarks]=useState(()=> db().attendance[key] || Object.fromEntries(cls.students.map(s=>[s.id,'present'])))
  const [,setTick]=useState(0)
  const counts=Object.values(marks).reduce((a,v)=>{a[v]++;return a},{present:0,absent:0,late:0})
  const history=Object.keys(db().attendance||{}).filter(k=>k.startsWith(cls.cls.id+'_')).map(k=>{
    const m=db().attendance[k]; const c={present:0,absent:0,late:0}; Object.values(m).forEach(v=>c[v]!=null&&c[v]++)
    return {date:k.split('_').slice(1).join('_'),...c}
  }).sort((a,b)=>b.date.localeCompare(a.date))
  const save=()=>{
    mutate(db=>{db.attendance[key]=marks})
    setTick(x=>x+1)
    const flagged=cls.students.filter(s=>marks[s.id]!=='present')
    notify({role:'admin',kind:'info',title:`Appel — ${cls.cls.name}`,body:`${counts.present} présents · ${counts.absent} absents · ${counts.late} retards (${cls.slot.subject})`,link:'/app/attendance'})
    notify({role:'schooladmin',kind:'info',title:`Appel — ${cls.cls.name}`,body:`${counts.absent} absent(s), ${counts.late} retard(s)`,link:'/app/attendance'})
    flagged.forEach(s=>{ if(s.parentId) notify({to:s.parentId,kind:'info',title:`Présence de ${s.name.split(' ')[0]}`,body:`${s.name} a été marqué(e) ${FR[marks[s.id]].toLowerCase()} aujourd'hui (${cls.slot.subject}).`,link:'/app'}) })
    toast.success('Appel enregistré · direction et parents notifiés')
  }
  return (<>
    <PageHead title="Appel / Présence" sub={`${cls.cls.name} · ${cls.slot.subject} · ${today}`} action={<Btn onClick={save}><Check size={16}/> Enregistrer</Btn>}/>
    <div className="flex gap-3 mb-4">{Object.entries(counts).map(([k,v])=><div key={k} className="card px-4 py-2 text-sm"><span className="font-bold" style={{color:COL[k]}}>{v}</span> <span className="text-muted">{FR[k]}</span></div>)}</div>
    <Card className="p-3"><div className="grid sm:grid-cols-2 gap-2">
      {cls.students.map(s=>(<button key={s.id} onClick={()=>setMarks(m=>({...m,[s.id]:CYCLE[m[s.id]]}))} className="flex items-center gap-3 p-2 rounded-xl border border-line hover:bg-canvas">
        <Avatar name={s.name} seed={s.id} size={32}/><span className="flex-1 text-left text-sm font-medium">{s.name}</span>
        <Badge status={marks[s.id]}/></button>))}
    </div><p className="text-xs text-muted mt-2 px-1">Touchez un élève pour changer : présent → absent → retard. La direction et les parents concernés sont notifiés à l'enregistrement.</p></Card>
    <Card className="p-4 mt-4"><h3 className="font-bold mb-2 text-sm">Appels enregistrés · {cls.cls.name}</h3>
      {history.length? <div className="space-y-1.5 max-h-64 overflow-y-auto scroll-thin">{history.map(h=>(<div key={h.date} className="flex items-center justify-between text-sm border-b border-line pb-1.5 last:border-0">
        <span className="text-muted">{h.date}</span>
        <span className="flex gap-3"><b style={{color:COL.present}}>{h.present}</b> présents · <b style={{color:COL.absent}}>{h.absent}</b> absents · <b style={{color:COL.late}}>{h.late}</b> retards</span></div>))}</div>
       : <EmptyState icon={<CalendarCheck size={26}/>} title="Aucun appel enregistré" sub="Les appels de cette classe apparaîtront ici après le premier enregistrement."/>}
    </Card>
  </>)
}
