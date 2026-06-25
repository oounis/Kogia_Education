import { useState, useMemo } from 'react'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, ChevronRight, ChevronLeft, Check, Zap, Star, RotateCcw } from 'lucide-react'
import PortalShell from '../components/PortalShell.jsx'
import { StudentChip, DropZone } from '../components/dnd.jsx'
import { currentClass, QUESTIONS, BUCKETS, BADGES, STUDENTS } from '../data.js'
import { saveEval } from '../store.js'
import { Link } from 'react-router-dom'

export default function Teacher(){
  const cls = useMemo(()=>currentClass(new Date()),[])
  const students = cls.students
  const [step, setStep] = useState(0)                 // 0..4 questions, 5 = badges, 6 = done
  const [placements, setPlacements] = useState({})    // {qid:{studentId:bucketKey}}
  const [badges, setBadges] = useState({})            // {studentId:badgeKey}
  const [note, setNote] = useState("")
  const [active, setActive] = useState(null)          // dragging student
  const sensors = useSensors(useSensor(PointerSensor,{ activationConstraint:{ distance:5 } }))

  const q = QUESTIONS[step]
  const place = placements[q?.id] || {}
  const placedCount = Object.keys(place).length
  const pool = students.filter(s => !place[s.id])

  function onDragEnd({active, over}){
    setActive(null)
    if(!over) return
    const sid = active.id
    setPlacements(prev=>{
      const cur = { ...(prev[q.id]||{}) }
      if(over.id === 'pool'){ delete cur[sid] }
      else { cur[sid] = over.id }
      return { ...prev, [q.id]: cur }
    })
  }
  const autoFill = (bucket)=> setPlacements(prev=>{
    const cur={...(prev[q.id]||{})}; pool.forEach(s=>cur[s.id]=bucket); return {...prev,[q.id]:cur}
  })
  const resetQ = ()=> setPlacements(prev=>({...prev,[q.id]:{}}))

  function submit(){
    const ev = {
      id:'ev_'+Date.now(), at:new Date().toISOString(),
      grade:cls.grade.name, classroom:cls.classroom.name, subject:cls.slot.subject,
      teacher:'Othman Ounis', placements, badges, note,
    }
    saveEval(ev); setStep(6)
  }

  // -------- DONE screen --------
  if(step===6){
    return (
      <PortalShell portal="teacher">
        <div className="max-w-[640px] mx-auto text-center pt-10">
          <div className="w-16 h-16 rounded-full grid place-items-center text-white mx-auto accent-bg pop"><Check size={30}/></div>
          <h1 className="text-2xl font-bold mt-4">Evaluation saved & shared 🎉</h1>
          <p className="text-muted mt-1">{cls.grade.name} · {cls.classroom.name} · {cls.slot.subject} — {students.length} students evaluated in one pass.</p>
          <p className="text-muted text-sm mt-1">Admins and parents can already see it.</p>
          <div className="flex gap-3 justify-center mt-6">
            <button onClick={()=>{setStep(0);setPlacements({});setBadges({});setNote("")}} className="px-5 py-2.5 rounded-full text-white font-semibold accent-bg">New evaluation</button>
            <Link to="/parent" className="px-5 py-2.5 rounded-full font-semibold border border-line bg-white">See parent view →</Link>
          </div>
        </div>
      </PortalShell>
    )
  }

  return (
    <PortalShell portal="teacher"
      right={<span className="hidden sm:inline text-sm text-muted">Mr. Othman · Mathematics</span>}>
      {/* live class banner */}
      <div className="rounded-2xl bg-white border border-line p-4 mb-5 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-xl grid place-items-center accent-soft accent-text"><Clock size={20}/></span>
          <div>
            <div className="font-semibold">{cls.grade.name} · {cls.classroom.name} · {cls.slot.subject}</div>
            <div className="text-sm text-muted">{cls.slot.start}–{cls.slot.end} · {students.length} students {cls.isLive && <span className="ml-1 text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{background:'#16A34A'}}>● LIVE NOW</span>}</div>
          </div>
        </div>
        <div className="text-sm text-muted">Loaded automatically from your schedule</div>
      </div>

      {/* stepper */}
      <div className="flex items-center gap-1.5 mb-4">
        {QUESTIONS.map((_,i)=>(
          <div key={i} className="h-1.5 flex-1 rounded-full" style={{background: i<=step?'var(--accent)':'#E8EDF2'}}/>
        ))}
        <div className="h-1.5 flex-1 rounded-full" style={{background: step>=5?'var(--accent)':'#E8EDF2'}}/>
      </div>

      {step<5 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter}
          onDragStart={({active})=>setActive(active.data.current.student)} onDragEnd={onDragEnd}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-wide accent-text">Question {step+1} of 5</div>
              <h2 className="text-xl font-bold">{q.text}</h2>
            </div>
            <div className="text-sm text-muted">{placedCount}/{students.length} placed</div>
          </div>

          {/* pool */}
          <DropZone id="pool" className="rounded-2xl border-2 border-dashed border-line bg-white p-3 mb-4 min-h-[64px]">
            <div className="flex flex-wrap gap-2">
              {pool.length? pool.map(s=><StudentChip key={s.id} student={s}/>) :
                <span className="text-sm text-muted px-2 py-1">All students placed ✓ — drag to move, or continue.</span>}
            </div>
            {pool.length>0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className="text-xs text-muted py-1">Quick:</span>
                {BUCKETS.map(b=><button key={b.key} onClick={()=>autoFill(b.key)} className="text-xs px-2 py-1 rounded-full border border-line hover:bg-canvas">all → {b.label}</button>)}
              </div>
            )}
          </DropZone>

          {/* buckets */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {BUCKETS.map(b=>{
              const inB = students.filter(s=>place[s.id]===b.key)
              return (
                <DropZone key={b.key} id={b.key} className="rounded-2xl bg-white border border-line p-3 min-h-[150px] transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold flex items-center gap-1.5"><span>{b.emoji}</span><span style={{color:b.color}}>{b.label}</span></span>
                    <span className="text-xs font-bold w-6 h-6 grid place-items-center rounded-full text-white" style={{background:b.color}}>{inB.length}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">{inB.map(s=><StudentChip key={s.id} student={s}/>)}</div>
                </DropZone>
              )
            })}
          </div>

          <div className="flex items-center justify-between mt-6">
            <button onClick={()=>step>0&&setStep(step-1)} disabled={step===0}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-line bg-white disabled:opacity-40"><ChevronLeft size={16}/> Back</button>
            <button onClick={resetQ} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"><RotateCcw size={14}/> reset this question</button>
            <button onClick={()=>setStep(step+1)}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-white font-semibold accent-bg">
              {step<4?'Next question':'Notes & badges'} <ChevronRight size={16}/>
            </button>
          </div>

          <DragOverlay>{active? <StudentChip student={active} overlay/> : null}</DragOverlay>
        </DndContext>
      ) : (
        // -------- badges + note step --------
        <div>
          <div className="text-xs font-bold uppercase tracking-wide accent-text">Final touch</div>
          <h2 className="text-xl font-bold mb-1">Badges & a quick note</h2>
          <p className="text-muted text-sm mb-4">Optional — tap a student, then a badge. Adds a friendly highlight for parents.</p>
          <BadgePicker students={students} badges={badges} setBadges={setBadges}/>
          <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Optional note for the class or admin…"
            className="w-full mt-4 rounded-xl border border-line p-3 text-sm bg-white h-24 outline-none focus:accent-border"/>
          <div className="flex items-center justify-between mt-6">
            <button onClick={()=>setStep(4)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-line bg-white"><ChevronLeft size={16}/> Back</button>
            <button onClick={submit} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white font-semibold accent-bg"><Zap size={17}/> Save & share</button>
          </div>
        </div>
      )}
    </PortalShell>
  )
}

function BadgePicker({ students, badges, setBadges }){
  const [sel, setSel] = useState(null)
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {students.map(s=>(
          <button key={s.id} onClick={()=>setSel(sel===s.id?null:s.id)}
            className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border bg-white text-sm ${sel===s.id?'accent-border':'border-line'}`}>
            <span className="w-6 h-6 rounded-full grid place-items-center text-white text-[10px] font-bold" style={{background:'#94A3B8'}}>{s.initials}</span>
            {s.name}{badges[s.id] && <span>{BADGES.find(b=>b.key===badges[s.id])?.emoji}</span>}
          </button>
        ))}
      </div>
      {sel && (
        <div className="flex flex-wrap gap-2 pop">
          {BADGES.map(b=>(
            <button key={b.key} onClick={()=>{ setBadges(p=>({...p,[sel]:b.key})); setSel(null) }}
              className="px-3 py-1.5 rounded-full border border-line bg-white text-sm hover:accent-soft">{b.emoji} {b.label}</button>
          ))}
          <button onClick={()=>{ setBadges(p=>{const n={...p};delete n[sel];return n}); setSel(null) }} className="px-3 py-1.5 rounded-full text-sm text-muted">remove</button>
        </div>
      )}
    </div>
  )
}
