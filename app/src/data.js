import { db, studentsOfClass } from './db.js'
export const BUCKETS=[
  {key:"excellent",label:"Excellent",color:"#2BD9A8",soft:"#E2FBF3",emoji:"🌟"},
  {key:"good",label:"Bien",color:"#36C5F0",soft:"#E4F7FE",emoji:"👍"},
  {key:"average",label:"Moyen",color:"#FFA62B",soft:"#FFF1DD",emoji:"➖"},
  {key:"weak",label:"Insuffisant",color:"#FF6B81",soft:"#FFE8EC",emoji:"📌"},
]
export const QUESTIONS=[
  {id:"q1",text:"Participation en classe aujourd'hui"},
  {id:"q2",text:"Compréhension de la leçon"},
  {id:"q3",text:"Comportement & discipline"},
  {id:"q4",text:"Devoirs & préparation"},
  {id:"q5",text:"Performance générale du jour"},
]
export const BADGES=[
  {key:"star",label:"Élève du jour",emoji:"⭐"},{key:"improved",label:"Plus grand progrès",emoji:"📈"},
  {key:"team",label:"Esprit d'équipe",emoji:"🤝"},{key:"idea",label:"Bonne idée",emoji:"💡"},{key:"focus",label:"Très concentré",emoji:"🎯"},
]
export const SCHEDULE=[
  {day:1,start:"08:00",end:"10:00",classId:"c5a",subject:"Mathématiques"},
  {day:1,start:"10:15",end:"12:00",classId:"c6a",subject:"Mathématiques"},
]
export function studentColor(id){const pal=["#36C5F0","#8B5CF6","#FF6B81","#FFA62B","#2BD9A8","#6C5CE7","#0BA5D8","#14B8A6"];let h=0;for(const c of String(id))h=(h*31+c.charCodeAt(0))>>>0;return pal[h%pal.length]}
export function currentClass(now){const hhmm=now.toTimeString().slice(0,5);const slot=SCHEDULE.find(s=>hhmm>=s.start&&hhmm<=s.end)||SCHEDULE[0];const cls=db().classes.find(c=>c.id===slot.classId);return{slot,isLive:hhmm>=slot.start&&hhmm<=slot.end,cls,students:studentsOfClass(slot.classId)}}
