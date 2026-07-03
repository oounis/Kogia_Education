import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { current } from '../auth.js'
import { db, studentById, classById } from '../db.js'
import { DAYS, PERIODS, timetableFor } from '../data.js'
import { PageHead, Card, Select } from '../components/ui.jsx'
import { studentColor } from '../data.js'
import { Radio, Clock, MapPin, GraduationCap } from 'lucide-react'

// ── avatar target (feet position, % of scene) + colour/label per activity ──
const AREAS={
  class:      {label:'Salle de classe',    color:'#6C5CE7', pos:{x:18,y:37}},
  infirmerie: {label:'Infirmerie',          color:'#FF6B81', pos:{x:41,y:37}},
  cour:       {label:'Cour de récréation',  color:'#22C55E', pos:{x:83,y:60}},
  cantine:    {label:'Cantine',             color:'#F59E0B', pos:{x:35,y:78}},
  entree:     {label:'Entrée / Sortie',     color:'#8A93A6', pos:{x:34,y:85}},
}
// ── rooms drawn inside the school building (atmosphere) ──
const ROOMS=[
  {label:'Salle de classe', x:4, y:7,  w:28, h:32, color:'#6C5CE7', items:['🪑','🪑','📚','🧑‍🏫']},
  {label:'Infirmerie',      x:34,y:7,  w:14, h:32, color:'#FF6B81', items:['🛏️','💊']},
  {label:'Bibliothèque',    x:50,y:7,  w:14, h:32, color:'#0EA5E9', items:['📚','📖']},
  {label:'Couloir',         x:4, y:41, w:60, h:6,  color:'#CBD5E1', corridor:true},
  {label:'Direction',       x:4, y:49, w:18, h:33, color:'#36C5F0', items:['🖥️','📁']},
  {label:'Cantine',         x:24,y:49, w:22, h:33, color:'#F59E0B', items:['🍽️','🥗','🧃']},
  {label:'WC',              x:48,y:49, w:16, h:33, color:'#94A3B8', items:['🚻','🚰']},
]
const COUR={x:68,y:5,w:30,h:80}

const toMin=hhmm=>{const[h,m]=hhmm.split(':').map(Number);return h*60+m}
const fmt=min=>`${String(Math.floor(min/60)).padStart(2,'0')}:${String(min%60).padStart(2,'0')}`

function daySegments(classId, dayIdx){
  const tt=timetableFor(classId); const segs=[]
  PERIODS.forEach(([s,e],pi)=>{
    const cell=tt[pi].cells[dayIdx]
    segs.push({start:toMin(s),end:toMin(e),kind:cell?'class':'free',cell})
    if(pi===1) segs.push({start:toMin('10:00'),end:toMin('10:15'),kind:'cour'})
    if(pi===3) segs.push({start:toMin('12:15'),end:toMin('13:00'),kind:'cantine'})
  })
  return segs.sort((a,b)=>a.start-b.start)
}
function statusAt(classId, dayIdx, min, sick){
  const segs=daySegments(classId,dayIdx); const open=segs[0].start, close=segs[segs.length-1].end
  if(sick){ const seg=segs.find(s=>min>=s.start&&min<s.end)||{start:open,end:close}; return {place:'infirmerie',title:'À l’infirmerie',sub:'Sous la surveillance de l’infirmière',seg,special:true} }
  if(min<open) return {place:'entree',title:'Avant l’école',sub:`Cours à ${fmt(open)}`,seg:{start:min,end:open}}
  if(min>=close) return {place:'entree',title:'Journée terminée',sub:'Sortie des classes',seg:{start:close,end:close+1}}
  const seg=segs.find(s=>min>=s.start&&min<s.end)||segs[segs.length-1]
  if(seg.kind==='class'&&seg.cell) return {place:'class',title:'En classe',sub:`${seg.cell.subject} · ${seg.cell.room}`,seg}
  if(seg.kind==='cour') return {place:'cour',title:'En récréation',sub:'Pause dans la cour',seg}
  if(seg.kind==='cantine') return {place:'cantine',title:'Pause déjeuner',sub:'À la cantine',seg}
  return {place:'class',title:'Étude',sub:'Salle de classe',seg}
}

// ── full-body child character (boy / girl) ──
function Kid({ gender }){
  const girl=gender==='Fille'
  const skin='#F2C9A0', hair=girl?'#4A2E1E':'#3B2A1E', shirt=girl?'#EC6A86':'#5B8DEF', bottom='#33415C'
  return (
    <svg viewBox="0 0 44 78" width="36" height="64" style={{overflow:'visible',filter:'drop-shadow(0 4px 4px rgba(30,36,51,.18))'}}>
      {/* legs + shoes */}
      <rect x="16" y="52" width="5" height="15" rx="2.5" fill={skin}/><rect x="23" y="52" width="5" height="15" rx="2.5" fill={skin}/>
      <rect x="14.5" y="65" width="8" height="5" rx="2.5" fill="#333"/><rect x="21.5" y="65" width="8" height="5" rx="2.5" fill="#333"/>
      {/* body */}
      {girl ? <path d="M14 30 h16 l5 24 h-26 z" fill={shirt}/> : <>
        <rect x="14" y="30" width="16" height="16" rx="3" fill={shirt}/><rect x="15" y="45" width="14" height="9" rx="2" fill={bottom}/></>}
      {/* arms */}
      <rect x="9" y="31" width="4.5" height="15" rx="2.2" fill={girl?shirt:skin}/><rect x="30.5" y="31" width="4.5" height="15" rx="2.2" fill={girl?shirt:skin}/>
      {/* head + hair */}
      <ellipse cx="22" cy="16" rx="12" ry="11" fill={hair}/>
      {girl && <><circle cx="10" cy="21" r="4.5" fill={hair}/><circle cx="34" cy="21" r="4.5" fill={hair}/></>}
      <circle cx="22" cy="19" r="9.5" fill={skin}/>
      <circle cx="18.5" cy="19" r="1.3" fill="#3a2a20"/><circle cx="25.5" cy="19" r="1.3" fill="#3a2a20"/>
      <path d="M18.5 23.5 q3.5 2.6 7 0" stroke="#3a2a20" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <circle cx="14.5" cy="22" r="1.6" fill="#F7A9A0" opacity=".55"/><circle cx="29.5" cy="22" r="1.6" fill="#F7A9A0" opacity=".55"/>
      {girl && <path d="M32 12 a3 3 0 1 1 4 3" stroke="#EC6A86" strokeWidth="2" fill="none"/>}
    </svg>
  )
}

export default function Live(){
  const u=current(); const d=db()
  const kids=(u.childIds||[]).map(studentById).filter(Boolean)
  const [kidId,setKidId]=useState(kids[0]?.id)
  const kid=kids.find(k=>k.id===kidId)||kids[0]
  const cls=kid?classById(kid.classId):null

  const now=new Date(); const wd=now.getDay(); const realWeekday=wd>=1&&wd<=5
  const dayIdx=realWeekday?wd-1:0
  const nowMin=now.getHours()*60+now.getMinutes()
  const inSchool=realWeekday&&nowMin>=480&&nowMin<=900
  const [min,setMin]=useState(inSchool?nowMin:630)
  const [liveNow,setLiveNow]=useState(inSchool)
  useEffect(()=>{ if(!liveNow) return; const t=setInterval(()=>{const n=new Date();setMin(n.getHours()*60+n.getMinutes())},20000); return ()=>clearInterval(t) },[liveNow])

  const sick=useMemo(()=>d.incidents.some(i=>i.studentId===kid?.id&&i.type==='Santé'&&i.status==='open'&&(Date.now()-i.at)<86400000),[d,kid])
  const st=useMemo(()=>kid?statusAt(kid.classId,dayIdx,min,sick):null,[kid,dayIdx,min,sick])
  if(!kid) return <Card className="p-10 text-center text-muted">Aucun enfant associé à ce compte.</Card>
  const area=AREAS[st.place]
  const segLen=Math.max(1,st.seg.end-st.seg.start); const done=Math.min(1,Math.max(0,(min-st.seg.start)/segLen)); const remain=Math.max(0,st.seg.end-min)
  const segs=daySegments(kid.classId,dayIdx)

  return (<>
    <PageHead title="Suivi en direct" sub={`Où se trouve ${kid.name.split(' ')[0]} en ce moment.`}
      action={kids.length>1&&<Select value={kidId} onChange={e=>setKidId(e.target.value)}>{kids.map(k=><option key={k.id} value={k.id}>{k.name}</option>)}</Select>}/>

    <div className="grid lg:grid-cols-[1fr_340px] gap-5">
      {/* ── the school ── */}
      <Card className="p-0 overflow-hidden relative">
        <div className="absolute top-3 left-3 z-30 flex items-center gap-2 text-xs font-bold px-2.5 py-1.5 rounded-full text-white" style={{background:liveNow?'#FF3B5C':'#8A93A6'}}>
          <motion.span animate={{opacity:[1,.3,1]}} transition={{repeat:Infinity,duration:1.4}}><Radio size={13}/></motion.span>
          {liveNow?'EN DIRECT':'Aperçu'} · {fmt(min)}
        </div>
        <div className="relative w-full" style={{height:470,background:'linear-gradient(180deg,#EAF2FF 0%,#F6F7FB 100%)'}}>
          {/* outdoor playground */}
          <div className="absolute rounded-2xl overflow-hidden" style={{left:`${COUR.x}%`,top:`${COUR.y}%`,width:`${COUR.w}%`,height:`${COUR.h}%`,background:'linear-gradient(180deg,#D6F5DF,#B7ECC6)',border:'2px solid #A7E0B8'}}>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[11px] font-bold text-[#15803D]">Cour de récréation</div>
            <div className="absolute" style={{left:10,bottom:14,fontSize:30}}>🌳</div>
            <div className="absolute" style={{right:14,top:40,fontSize:22}}>⚽</div>
            <div className="absolute" style={{right:18,bottom:20,fontSize:22}}>🛝</div>
          </div>
          {/* school building shell */}
          <div className="absolute rounded-2xl" style={{left:'2%',top:'4%',width:'64%',height:'84%',background:'#E9ECF4',border:'3px solid #fff',boxShadow:'0 12px 30px -12px rgba(30,36,51,.25)'}}/>
          {/* rooms */}
          {ROOMS.map(r=>{const active=(st.place==='class'&&r.label==='Salle de classe')||(st.place==='infirmerie'&&r.label==='Infirmerie')||(st.place==='cantine'&&r.label==='Cantine');return(
            <div key={r.label} className="absolute rounded-xl overflow-hidden" style={{left:`${r.x}%`,top:`${r.y}%`,width:`${r.w}%`,height:`${r.h}%`,
              background:r.corridor?'#EEF1F7':(active?r.color+'26':r.color+'10'),border:`1.5px solid ${active?r.color:'#fff'}`}}>
              <div className="px-1.5 pt-1 text-[10px] font-bold leading-none" style={{color:active?r.color:'#64748B'}}>{r.label}</div>
              {!r.corridor&&<div className="absolute bottom-1 left-1 right-1 flex flex-wrap gap-0.5 justify-center text-[13px] opacity-80">{r.items?.map((it,i)=><span key={i}>{it}</span>)}</div>}
            </div>
          )})}
          {/* entrance door */}
          <div className="absolute rounded-t-lg" style={{left:'28%',top:'82%',width:'12%',height:'6%',background:'#8C6B4F',border:'2px solid #fff'}}>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-bold text-muted whitespace-nowrap">🚪 Entrée</div>
          </div>

          {/* ── the student, walking between rooms ── */}
          <motion.div className="absolute z-40" style={{translateX:'-50%',translateY:'-100%'}}
            animate={{left:`${area.pos.x}%`,top:`${area.pos.y}%`}} transition={{type:'spring',stiffness:46,damping:14}}>
            <motion.div animate={{y:[0,-3,0]}} transition={{repeat:Infinity,duration:.62}} className="relative flex flex-col items-center">
              <Kid gender={kid.gender}/>
              <motion.span className="absolute -bottom-1 rounded-full" style={{width:28,height:8,background:area.color,opacity:.3}} animate={{scale:[1,1.5,1],opacity:[.3,.1,.3]}} transition={{repeat:Infinity,duration:1.7}}/>
              <div className="mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow-md whitespace-nowrap" style={{background:area.color}}>{kid.name.split(' ')[0]} · {st.title}</div>
            </motion.div>
          </motion.div>
        </div>
      </Card>

      {/* ── status + scrubber ── */}
      <div className="space-y-5">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <span className="w-12 h-14 rounded-2xl grid place-items-end justify-center overflow-hidden shrink-0" style={{background:studentColor(kid.id)+'18'}}><Kid gender={kid.gender}/></span>
            <div><div className="font-bold">{kid.name}</div><div className="text-xs text-muted">{cls?.name} · {cls?.cycle}</div></div>
          </div>
          <div className="mt-4 rounded-2xl p-4" style={{background:area.color+'12'}}>
            <div className="flex items-center gap-2 text-sm font-bold" style={{color:area.color}}><MapPin size={15}/> {area.label}</div>
            <div className="text-lg font-extrabold mt-1">{st.title}</div>
            <div className="text-sm text-muted">{st.sub}</div>
            {remain>0 && st.title!=='Journée terminée' && st.title!=='Avant l’école' && <>
              <div className="mt-3 h-2 rounded-full bg-white/70 overflow-hidden"><motion.div className="h-full rounded-full" style={{background:area.color}} animate={{width:`${Math.round(done*100)}%`}} transition={{type:'spring',stiffness:80,damping:18}}/></div>
              <div className="flex items-center justify-between mt-1.5 text-xs"><span className="flex items-center gap-1 text-muted"><Clock size={12}/> Se termine à {fmt(st.seg.end)}</span><span className="font-bold" style={{color:area.color}}>{remain} min restantes</span></div>
            </>}
          </div>
          {!inSchool && <div className="text-[11px] text-muted mt-3">Hors des heures d’école — aperçu d’une journée type. Faites glisser pour explorer.</div>}
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2"><div className="font-bold text-sm">Explorer la journée</div>
            <button onClick={()=>{setMin(inSchool?nowMin:630);setLiveNow(inSchool)}} className="text-xs font-semibold accent-text">{inSchool?'Revenir à maintenant':'Réinitialiser'}</button></div>
          <input type="range" min={480} max={900} step={5} value={min} onChange={e=>{setMin(+e.target.value);setLiveNow(false)}} className="w-full accent-[var(--accent)]"/>
          <div className="flex justify-between text-[10px] text-muted mt-1"><span>08:00</span><span className="font-bold text-ink">{fmt(min)}</span><span>15:00</span></div>
        </Card>
      </div>
    </div>

    {/* day timeline */}
    <Card className="p-4 mt-5">
      <div className="font-bold text-sm mb-3 flex items-center gap-2"><GraduationCap size={16} className="accent-text"/> Journée de {kid.name.split(' ')[0]} · {realWeekday?DAYS[dayIdx]:'Lundi (aperçu)'}</div>
      <div className="flex gap-2 overflow-x-auto scroll-thin pb-1">
        {segs.map((s,i)=>{const isNow=min>=s.start&&min<s.end;const c=s.kind==='class'?AREAS.class.color:s.kind==='cour'?AREAS.cour.color:s.kind==='cantine'?AREAS.cantine.color:'#C7CDDA';
          const label=s.kind==='class'?(s.cell?.subject||'Étude'):s.kind==='cour'?'Récréation':s.kind==='cantine'?'Déjeuner':'Libre'
          return <div key={i} className={`shrink-0 w-32 rounded-xl p-2.5 border ${isNow?'border-transparent':'border-line'}`} style={isNow?{boxShadow:`inset 0 0 0 2px ${c}`,background:c+'10'}:{}}>
            <div className="text-[10px] text-muted">{fmt(s.start)}–{fmt(s.end)}</div>
            <div className="text-[13px] font-bold mt-0.5 truncate" style={{color:isNow?c:'#1E2433'}}>{label}</div>
            {s.cell?.room&&<div className="text-[10px] text-muted">{s.cell.room}</div>}
            {isNow&&<div className="text-[10px] font-bold mt-1" style={{color:c}}>● maintenant</div>}
          </div>})}
      </div>
    </Card>
  </>)
}
