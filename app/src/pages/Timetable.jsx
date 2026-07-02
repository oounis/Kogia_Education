import { useState } from 'react'
import { current } from '../auth.js'
import { db, studentById } from '../db.js'
import { DAYS, PERIODS, timetableFor, teacherTimetable } from '../data.js'
import { PageHead, Card, Select, Field } from '../components/ui.jsx'
import { CalendarClock } from 'lucide-react'

export default function Timetable(){
  const u=current(); const d=db()
  // which classes can this user browse?
  let classes=d.classes
  let teacher=null
  if(u.role==='teacher'){ teacher=d.teachers.find(t=>t.id===(u.teacherId||u.id)); classes=d.classes.filter(c=>(teacher?.classes||[]).includes(c.id)) }
  if(u.role==='parent'){ const kids=(u.childIds||[]).map(studentById).filter(Boolean); classes=d.classes.filter(c=>kids.some(k=>k.classId===c.id)) }

  const [mode,setMode]=useState(u.role==='teacher'?'me':'class')
  const [classId,setClassId]=useState(classes[0]?.id||d.classes[0]?.id)
  const grid = mode==='me'&&teacher ? teacherTimetable(teacher) : timetableFor(classId)
  const clsName = d.classes.find(c=>c.id===classId)?.name

  return (<>
    <PageHead title="Emploi du temps" sub="La semaine, d’un coup d’œil."
      action={
        <div className="flex items-end gap-3">
          {u.role==='teacher' && <Field label="Vue"><Select value={mode} onChange={e=>setMode(e.target.value)}><option value="me">Mon emploi du temps</option><option value="class">Par classe</option></Select></Field>}
          {(mode==='class') && <Field label="Classe"><Select value={classId} onChange={e=>setClassId(e.target.value)}>{classes.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</Select></Field>}
        </div>
      }/>

    <Card className="p-4 overflow-x-auto scroll-thin">
      <div className="min-w-[720px]">
        <div className="grid" style={{gridTemplateColumns:'84px repeat(5,1fr)',gap:'6px'}}>
          <div/>
          {DAYS.map(day=><div key={day} className="text-center text-sm font-bold py-2 rounded-lg bg-canvas">{day}</div>)}
          {grid.map((row,pi)=>(
            <FragmentRow key={pi} row={row}/>
          ))}
        </div>
        <div className="text-xs text-muted mt-3">
          {mode==='me'&&teacher ? <>Emploi du temps de <b className="text-ink">{teacher.name}</b> · {teacher.subject}</> : <>Classe <b className="text-ink">{clsName}</b> · récréation 10:00–10:15 · déjeuner 12:15–13:00</>}
        </div>
      </div>
    </Card>

    <div className="grid sm:grid-cols-3 gap-4 mt-5">
      <Card className="p-4 flex items-center gap-3"><span className="w-11 h-11 rounded-2xl grid place-items-center accent-soft accent-text"><CalendarClock size={20}/></span>
        <div><div className="text-xl font-extrabold">{grid.reduce((n,r)=>n+r.cells.filter(Boolean).length,0)}</div><div className="text-xs text-muted">séances / semaine</div></div></Card>
      <Card className="p-4 flex items-center gap-3"><span className="w-11 h-11 rounded-2xl grid place-items-center" style={{background:'#E2FBF3',color:'#10B981'}}><CalendarClock size={20}/></span>
        <div><div className="text-xl font-extrabold">6</div><div className="text-xs text-muted">périodes / jour</div></div></Card>
      <Card className="p-4 flex items-center gap-3"><span className="w-11 h-11 rounded-2xl grid place-items-center" style={{background:'#FFF4DD',color:'#E59A12'}}><CalendarClock size={20}/></span>
        <div><div className="text-xl font-extrabold">Lun–Ven</div><div className="text-xs text-muted">jours d’école</div></div></Card>
    </div>
  </>)
}

function FragmentRow({ row }){
  return (<>
    <div className="text-[11px] text-muted font-semibold py-3 pr-1 text-right leading-tight">{row.start}<br/>{row.end}</div>
    {row.cells.map((c,di)=> c ? (
      <div key={di} className="rounded-xl p-2.5 text-left min-h-[64px]" style={{background:c.color+'14',borderLeft:'3px solid '+c.color}}>
        <div className="text-[13px] font-bold leading-tight" style={{color:c.color}}>{c.subject}</div>
        <div className="text-[11px] text-muted mt-0.5">{c.room}{c.className?` · ${c.className}`:''}</div>
      </div>
    ) : (
      <div key={di} className="rounded-xl min-h-[64px] grid place-items-center text-[11px] text-muted bg-canvas/60">—</div>
    ))}
  </>)
}
