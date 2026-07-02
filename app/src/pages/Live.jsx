import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { current } from '../auth.js'
import { db, studentById, classById } from '../db.js'
import { DAYS, PERIODS, timetableFor } from '../data.js'
import { PageHead, Card, Avatar, Select } from '../components/ui.jsx'
import { studentColor } from '../data.js'
import { BookOpen, Coffee, Utensils, Stethoscope, DoorOpen, Radio, Clock, MapPin, GraduationCap } from 'lucide-react'

// school "map" — rooms placed on a floor plan (percent coords), with a scene emoji
const PLACES={
  class:      {label:'Salle de classe',   x:26, y:34, color:'#6C5CE7', Icon:BookOpen,     emoji:'🏫'},
  cour:       {label:'Cour de récréation', x:76, y:30, color:'#2BD9A8', Icon:Coffee,       emoji:'🌳'},
  cantine:    {label:'Cantine',            x:78, y:74, color:'#FFA62B', Icon:Utensils,     emoji:'🍽️'},
  infirmerie: {label:'Infirmerie',         x:50, y:16, color:'#FF6B81', Icon:Stethoscope,  emoji:'🏥'},
  entree:     {label:'Entrée / Sortie',    x:50, y:90, color:'#8A93A6', Icon:DoorOpen,     emoji:'🚪'},
}
const face=s=>s.gender==='Fille'?'👧':s.gender==='Garçon'?'👦':'🧑'
const toMin=hhmm=>{const[h,m]=hhmm.split(':').map(Number);return h*60+m}
const fmt=min=>`${String(Math.floor(min/60)).padStart(2,'0')}:${String(min%60).padStart(2,'0')}`

// build the day's segments (classes + breaks) from a class timetable for a weekday
function daySegments(classId, dayIdx){
  const tt=timetableFor(classId)
  const segs=[]
  PERIODS.forEach(([s,e],pi)=>{
    const cell=tt[pi].cells[dayIdx]
    segs.push({start:toMin(s),end:toMin(e),kind:cell?'class':'free',cell})
    // insert breaks after specific periods
    if(pi===1) segs.push({start:toMin('10:00'),end:toMin('10:15'),kind:'cour'})
    if(pi===3) segs.push({start:toMin('12:15'),end:toMin('13:00'),kind:'cantine'})
  })
  return segs.sort((a,b)=>a.start-b.start)
}
function statusAt(classId, dayIdx, min, sick){
  const segs=daySegments(classId,dayIdx)
  const open=segs[0].start, close=segs[segs.length-1].end
  if(sick) { const seg=segs.find(s=>min>=s.start&&min<s.end)||{start:open,end:close}; return {place:'infirmerie',title:'À l’infirmerie',sub:'Sous la surveillance de l’infirmière',seg,special:true} }
  if(min<open) return {place:'entree',title:'Avant l’école',sub:`Cours à ${fmt(open)}`,seg:{start:min,end:open}}
  if(min>=close) return {place:'entree',title:'Journée terminée',sub:'Sortie des classes',seg:{start:close,end:close+1}}
  const seg=segs.find(s=>min>=s.start&&min<s.end)||segs[segs.length-1]
  if(seg.kind==='class'&&seg.cell) return {place:'class',title:'En classe',sub:`${seg.cell.subject} · ${seg.cell.room}`,seg}
  if(seg.kind==='cour') return {place:'cour',title:'En récréation',sub:'Pause dans la cour',seg}
  if(seg.kind==='cantine') return {place:'cantine',title:'Pause déjeuner',sub:'À la cantine',seg}
  return {place:'class',title:'Étude',sub:'Salle de classe',seg}
}

export default function Live(){
  const u=current(); const d=db()
  const kids=(u.childIds||[]).map(studentById).filter(Boolean)
  const [kidId,setKidId]=useState(kids[0]?.id)
  const kid=kids.find(k=>k.id===kidId)||kids[0]
  const cls=kid?classById(kid.classId):null

  // weekday (Mon–Fri); weekend → simulate Monday for a live demo
  const now=new Date(); const wd=now.getDay(); const realWeekday=wd>=1&&wd<=5
  const dayIdx=realWeekday?wd-1:0
  const nowMin=now.getHours()*60+now.getMinutes()
  const inSchool=realWeekday&&nowMin>=480&&nowMin<=900
  const [min,setMin]=useState(inSchool?nowMin:630)   // default 10:30 for demo
  const [liveNow,setLiveNow]=useState(inSchool)

  // tick every 20s when following real time
  useEffect(()=>{ if(!liveNow) return; const t=setInterval(()=>{const n=new Date();setMin(n.getHours()*60+n.getMinutes())},20000); return ()=>clearInterval(t) },[liveNow])

  // sick today? (open health incident for this kid)
  const sick=useMemo(()=>d.incidents.some(i=>i.studentId===kid?.id&&i.type==='Santé'&&i.status==='open'&&(Date.now()-i.at)<86400000),[d,kid])
  const st=useMemo(()=>kid?statusAt(kid.classId,dayIdx,min,sick):null,[kid,dayIdx,min,sick])
  const place=st?PLACES[st.place]:PLACES.entree
  const segLen=Math.max(1,st.seg.end-st.seg.start)
  const done=Math.min(1,Math.max(0,(min-st.seg.start)/segLen))
  const remain=Math.max(0,st.seg.end-min)
  const segs=kid?daySegments(kid.classId,dayIdx):[]

  if(!kid) return <Card className="p-10 text-center text-muted">Aucun enfant associé à ce compte.</Card>

  return (<>
    <PageHead title="Suivi en direct" sub={`Où se trouve ${kid.name.split(' ')[0]} en ce moment.`}
      action={kids.length>1&&<Select value={kidId} onChange={e=>setKidId(e.target.value)}>{kids.map(k=><option key={k.id} value={k.id}>{k.name}</option>)}</Select>}/>

    <div className="grid lg:grid-cols-[1fr_340px] gap-5">
      {/* ── animated floor-plan ── */}
      <Card className="p-0 overflow-hidden relative">
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 text-xs font-bold px-2.5 py-1.5 rounded-full text-white" style={{background:liveNow?'#FF3B5C':'#8A93A6'}}>
          <motion.span animate={{opacity:[1,.3,1]}} transition={{repeat:Infinity,duration:1.4}}><Radio size={13}/></motion.span>
          {liveNow?'EN DIRECT':'Aperçu'} · {fmt(min)}
        </div>
        <div className="relative w-full" style={{height:420,background:'radial-gradient(120% 100% at 50% 0%, #EEF1FF 0%, #F6F7FB 60%)'}}>
          {/* subtle floor grid */}
          <div className="absolute inset-0 opacity-[0.5]" style={{backgroundImage:'linear-gradient(#E7EAF5 1px,transparent 1px),linear-gradient(90deg,#E7EAF5 1px,transparent 1px)',backgroundSize:'40px 40px'}}/>
          {/* rooms */}
          {Object.entries(PLACES).map(([k,p])=>{const active=st.place===k;return(
            <div key={k} className="absolute -translate-x-1/2 -translate-y-1/2 text-center" style={{left:`${p.x}%`,top:`${p.y}%`}}>
              <motion.div animate={active?{scale:1.08,y:-2}:{scale:1,y:0}} className="rounded-2xl px-3 pt-2.5 pb-2 border-2 shadow-sm w-[104px]"
                style={{borderColor:active?p.color:'#EDEFF5',background:active?`linear-gradient(160deg,#fff, ${p.color}14)`:'#fff'}}>
                <div className="text-2xl leading-none mb-1">{p.emoji}</div>
                <div className="text-[11px] font-bold leading-tight" style={{color:active?p.color:'#8A93A6'}}>{p.label}</div>
              </motion.div>
            </div>
          )})}
          {/* the student avatar — moves like an Uber car */}
          <motion.div className="absolute z-20" style={{translateX:'-50%',translateY:'-50%'}}
            animate={{left:`${place.x}%`,top:`${place.y+14}%`}} transition={{type:'spring',stiffness:55,damping:15}}>
            <div className="relative grid place-items-center">
              <motion.span className="absolute rounded-full" style={{background:place.color}} animate={{scale:[1,2.6],opacity:[.35,0]}} transition={{repeat:Infinity,duration:1.8}} initial={{width:44,height:44}}/>
              <span className="absolute rounded-full" style={{width:44,height:44,background:place.color,opacity:.18}}/>
              <div className="relative w-12 h-12 rounded-full grid place-items-center text-2xl border-4 border-white shadow-lg" style={{background:studentColor(kid.id)+'33'}}>{face(kid)}</div>
              <div className="absolute -bottom-6 whitespace-nowrap text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{background:place.color}}>{st.title}</div>
            </div>
          </motion.div>
        </div>
      </Card>

      {/* ── status + timeline ── */}
      <div className="space-y-5">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl grid place-items-center text-2xl shrink-0" style={{background:studentColor(kid.id)+'22'}}>{face(kid)}</span>
            <div><div className="font-bold">{kid.name}</div><div className="text-xs text-muted">{cls?.name} · {cls?.cycle}</div></div>
          </div>
          <div className="mt-4 rounded-2xl p-4" style={{background:place.color+'12'}}>
            <div className="flex items-center gap-2 text-sm font-bold" style={{color:place.color}}><MapPin size={15}/> {place.label}</div>
            <div className="text-lg font-extrabold mt-1">{st.title}</div>
            <div className="text-sm text-muted">{st.sub}</div>
            {/* progress + remaining (Uber-style) */}
            {remain>0 && st.title!=='Journée terminée' && st.title!=='Avant l’école' && <>
              <div className="mt-3 h-2 rounded-full bg-white/70 overflow-hidden"><motion.div className="h-full rounded-full" style={{background:place.color}} animate={{width:`${Math.round(done*100)}%`}} transition={{type:'spring',stiffness:80,damping:18}}/></div>
              <div className="flex items-center justify-between mt-1.5 text-xs"><span className="flex items-center gap-1 text-muted"><Clock size={12}/> Se termine à {fmt(st.seg.end)}</span><span className="font-bold" style={{color:place.color}}>{remain} min restantes</span></div>
            </>}
          </div>
          {!inSchool && <div className="text-[11px] text-muted mt-3">Hors des heures d’école — aperçu d’une journée type. Faites glisser pour explorer.</div>}
        </Card>

        {/* day scrubber */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2"><div className="font-bold text-sm">Explorer la journée</div>
            <button onClick={()=>{setMin(inSchool?nowMin:630);setLiveNow(inSchool)}} className="text-xs font-semibold accent-text">{inSchool?'Revenir à maintenant':'Réinitialiser'}</button></div>
          <input type="range" min={480} max={900} step={5} value={min} onChange={e=>{setMin(+e.target.value);setLiveNow(false)}} className="w-full accent-[var(--accent)]"/>
          <div className="flex justify-between text-[10px] text-muted mt-1"><span>08:00</span><span className="font-bold text-ink">{fmt(min)}</span><span>15:00</span></div>
        </Card>
      </div>
    </div>

    {/* horizontal day timeline */}
    <Card className="p-4 mt-5">
      <div className="font-bold text-sm mb-3 flex items-center gap-2"><GraduationCap size={16} className="accent-text"/> Journée de {kid.name.split(' ')[0]} · {realWeekday?DAYS[dayIdx]:'Lundi (aperçu)'}</div>
      <div className="flex gap-2 overflow-x-auto scroll-thin pb-1">
        {segs.map((s,i)=>{const isNow=min>=s.start&&min<s.end;const P=s.kind==='class'?PLACES.class:s.kind==='cour'?PLACES.cour:s.kind==='cantine'?PLACES.cantine:{color:'#C7CDDA',label:'Libre'};
          const label=s.kind==='class'?(s.cell?.subject||'Étude'):s.kind==='cour'?'Récréation':s.kind==='cantine'?'Déjeuner':'Libre'
          return <div key={i} className={`shrink-0 w-32 rounded-xl p-2.5 border ${isNow?'border-transparent':'border-line'}`} style={isNow?{boxShadow:`inset 0 0 0 2px ${P.color}`,background:P.color+'10'}:{}}>
            <div className="text-[10px] text-muted">{fmt(s.start)}–{fmt(s.end)}</div>
            <div className="text-[13px] font-bold mt-0.5 truncate" style={{color:isNow?P.color:'#1E2433'}}>{label}</div>
            {s.cell?.room&&<div className="text-[10px] text-muted">{s.cell.room}</div>}
            {isNow&&<div className="text-[10px] font-bold mt-1" style={{color:P.color}}>● maintenant</div>}
          </div>})}
      </div>
    </Card>
  </>)
}
