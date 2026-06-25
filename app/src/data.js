// ---- Coreon Edu — mock school data (clean start, no old files reused) ----
export const SCHOOL = { name: "Al-Noor International School", year: "2026 / 2027", city: "Tunis" }

export const TEACHER = { id:"t1", name:"Othman Ounis", subject:"Mathematics", avatar:"OO" }

export const GRADES = [{ id:"g7", name:"Grade 7" }, { id:"g8", name:"Grade 8" }]
export const CLASSROOMS = [{ id:"c7a", grade:"g7", name:"7-A" }, { id:"c8b", grade:"g8", name:"8-B" }]

const N = (id, first, last, classroom) => ({ id, name:`${first} ${last}`, initials:`${first[0]}${last[0]}`, classroom })
export const STUDENTS = [
  N("s1","Amira","Ben Salah","c7a"), N("s2","Youssef","Trabelsi","c7a"), N("s3","Leila","Khelifi","c7a"),
  N("s4","Karim","Gharbi","c7a"),   N("s5","Sarra","Mejri","c7a"),     N("s6","Hamza","Bouazizi","c7a"),
  N("s7","Nour","Jlassi","c7a"),    N("s8","Bilel","Chaabane","c7a"),  N("s9","Rania","Sassi","c7a"),
  N("s10","Aziz","Hammami","c7a"),  N("s11","Ines","Dridi","c7a"),     N("s12","Mehdi","Ayari","c7a"),
  // grade 8
  N("s13","Salma","Ferchichi","c8b"), N("s14","Wassim","Oueslati","c8b"), N("s15","Dorra","Belhadj","c8b"),
  N("s16","Anis","Saidi","c8b"),      N("s17","Maha","Toumi","c8b"),       N("s18","Firas","Zouari","c8b"),
]

// weekly schedule for the teacher (start/end as "HH:MM", 24h)
export const SCHEDULE = [
  { id:"sc1", day:1, start:"08:00", end:"10:00", grade:"g7", classroom:"c7a", subject:"Mathematics" },
  { id:"sc2", day:1, start:"10:15", end:"12:00", grade:"g8", classroom:"c8b", subject:"Mathematics" },
  { id:"sc3", day:2, start:"08:00", end:"10:00", grade:"g7", classroom:"c7a", subject:"Mathematics" },
  { id:"sc4", day:3, start:"09:00", end:"11:00", grade:"g8", classroom:"c8b", subject:"Mathematics" },
]

// the 5 quick questions + shared answer buckets (drag targets)
export const BUCKETS = [
  { key:"excellent", label:"Excellent", color:"#16A34A", soft:"#E9F8EF", emoji:"🌟" },
  { key:"good",      label:"Good",      color:"#2563EB", soft:"#E8F0FE", emoji:"👍" },
  { key:"average",   label:"Average",   color:"#D97706", soft:"#FDF1E0", emoji:"➖" },
  { key:"weak",      label:"Needs work",color:"#DC2626", soft:"#FCE9E9", emoji:"📌" },
]
export const QUESTIONS = [
  { id:"q1", text:"Participation in class today" },
  { id:"q2", text:"Understanding of the lesson" },
  { id:"q3", text:"Behaviour & discipline" },
  { id:"q4", text:"Homework & preparation" },
  { id:"q5", text:"Overall performance today" },
]
export const BADGES = [
  { key:"star",    label:"Star of the day", emoji:"⭐" },
  { key:"improved",label:"Most improved",   emoji:"📈" },
  { key:"team",    label:"Team player",     emoji:"🤝" },
  { key:"idea",    label:"Bright idea",     emoji:"💡" },
  { key:"focus",   label:"Super focused",   emoji:"🎯" },
]

// deterministic soft colour for a student chip
export function studentColor(id){
  const palette = ["#0EA5E9","#8B5CF6","#EC4899","#F59E0B","#10B981","#EF4444","#6366F1","#14B8A6"]
  let h=0; for(const c of id) h=(h*31+c.charCodeAt(0))>>>0
  return palette[h % palette.length]
}

// find the class scheduled "now" (matches by time-of-day so the demo always shows one)
export function currentClass(now){
  const hhmm = now.toTimeString().slice(0,5)
  const within = SCHEDULE.find(s => hhmm >= s.start && hhmm <= s.end)
  const slot = within || SCHEDULE[0]
  return {
    slot,
    isLive: !!within,
    grade: GRADES.find(g=>g.id===slot.grade),
    classroom: CLASSROOMS.find(c=>c.id===slot.classroom),
    students: STUDENTS.filter(s=>s.classroom===slot.classroom),
  }
}
