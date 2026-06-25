import { QUESTIONS, BUCKETS, BADGES, STUDENTS } from './data.js'
export const bucketOf = k => BUCKETS.find(b=>b.key===k)
export const badgeOf  = k => BADGES.find(b=>b.key===k)
// aggregate one evaluation -> counts per bucket (across all questions)
export function bucketTotals(ev){
  const t = Object.fromEntries(BUCKETS.map(b=>[b.key,0]))
  for(const q of QUESTIONS){ const pl=ev.placements[q.id]||{}; for(const sid in pl){ t[pl[sid]]=(t[pl[sid]]||0)+1 } }
  return BUCKETS.map(b=>({ name:b.label, value:t[b.key], color:b.color }))
}
// per-student summary for one evaluation
export function studentSummary(ev, studentId){
  const perQ = QUESTIONS.map(q=>({ q:q.text, bucket: bucketOf((ev.placements[q.id]||{})[studentId]) })).filter(x=>x.bucket)
  const score = perQ.length ? Math.round(perQ.reduce((s,x)=>s+({excellent:100,good:75,average:50,weak:25}[x.bucket.key]||0),0)/perQ.length) : null
  return { perQ, score, badge: badgeOf(ev.badges[studentId]) }
}
export function studentName(id){ return (STUDENTS.find(s=>s.id===id)||{}).name }
