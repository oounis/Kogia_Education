import { useState } from 'react'
import { jsPDF } from 'jspdf'
import { current } from '../auth.js'
import { db, studentById, classById, settings } from '../db.js'
import { PageHead, Card, Btn, Modal, Field, Select } from '../components/ui.jsx'
import { Tag, Mail, Bookmark, Download, Gift, Check, Award, DoorOpen, PartyPopper, Star } from 'lucide-react'
import toast from 'react-hot-toast'

const img=n=>`${import.meta.env.BASE_URL}library/${n}.jpg`
// library holds 1..50 and 52..109 (51 unused)
const IMGS=[...Array.from({length:50},(_,i)=>i+1), ...Array.from({length:58},(_,i)=>i+52)]
const IN='w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm accent-ring'

function loadImg(src){ return new Promise((res,rej)=>{ const i=new Image(); i.onload=()=>res(i); i.onerror=rej; i.src=src }) }
async function toData(src){ const i=await loadImg(src); const c=document.createElement('canvas'); c.width=i.naturalWidth; c.height=i.naturalHeight; c.getContext('2d').drawImage(i,0,0); return {url:c.toDataURL('image/jpeg',0.86), w:i.naturalWidth, h:i.naturalHeight} }
const fit=(iw,ih,bw,bh)=>{ const r=Math.min(bw/iw,bh/ih); return {w:iw*r,h:ih*r} }
const rgb=hex=>{const n=parseInt(hex.slice(1),16);return [(n>>16)&255,(n>>8)&255,n&255]}
// draw a 5-point star; style 'F' fill, 'S' stroke
function star(doc,cx,cy,R,rr,style,col){
  const pts=[]; for(let i=0;i<10;i++){ const a=-Math.PI/2+i*Math.PI/5, r=i%2?rr:R; pts.push([cx+Math.cos(a)*r, cy+Math.sin(a)*r]) }
  const segs=pts.slice(1).map((p,i)=>[p[0]-pts[i][0], p[1]-pts[i][1]]); segs.push([pts[0][0]-pts[9][0], pts[0][1]-pts[9][1]])
  if(style==='F') doc.setFillColor(col[0],col[1],col[2]); else { doc.setDrawColor(col[0],col[1],col[2]); doc.setLineWidth(0.5) }
  doc.lines(segs, pts[0][0], pts[0][1], [1,1], style, true)
}

const GIFTS=[
  {key:'labels',  title:'Étiquettes de cahiers', desc:'Une planche de 10 étiquettes à coller sur les cahiers et le cartable.', Icon:Tag, color:'#6C5CE7', defImg:42, fmt:'A4 · 10 étiquettes'},
  {key:'card',    title:'Carte de vœux', desc:'Une jolie carte personnalisée : Aïd, anniversaire, bravo…', Icon:Mail, color:'#FF6B81', defImg:12, fmt:'A5', inputs:[{name:'occ',type:'occ'}]},
  {key:'bookmark',title:'Marque-pages', desc:'4 marque-pages à imprimer et découper pour la lecture.', Icon:Bookmark, color:'#22C55E', defImg:16, fmt:'A4 · 4 marque-pages'},
  {key:'diploma', title:'Diplôme de réussite', desc:'Un beau diplôme à encadrer pour féliciter votre enfant.', Icon:Award, color:'#F59E0B', defImg:77, fmt:'A4 paysage',
    inputs:[{name:'mention',label:'Mention',type:'select',default:'pour sa belle réussite cette année',options:['pour sa belle réussite cette année','pour ses progrès remarquables','pour son excellent comportement','pour sa gentillesse et son entraide','élève du mois']}]},
  {key:'door',    title:'Affiche de porte', desc:'Une affiche « La chambre de… » à coller sur la porte.', Icon:DoorOpen, color:'#0EA5E9', defImg:86, fmt:'A4 portrait'},
  {key:'invite',  title:'Invitation d’anniversaire', desc:'Des invitations à distribuer aux copains de classe.', Icon:PartyPopper, color:'#EC4899', defImg:100, fmt:'A4 · 2 invitations',
    inputs:[{name:'age',label:'Âge',type:'number',default:'8'},{name:'date',label:'Quand',type:'text',placeholder:'samedi 12 juillet, 15h'},{name:'lieu',label:'Où',type:'text',placeholder:'à la maison'}]},
  {key:'reward',  title:'Tableau de récompenses', desc:'Une semaine d’étoiles à colorier pour encourager votre enfant.', Icon:Star, color:'#8B5CF6', defImg:81, fmt:'A4 portrait'},
]
const OCC={
  bravo:   {t:'Bravo',              m:'Félicitations pour tes beaux efforts, continue comme ça !'},
  aid:     {t:'Joyeux Aïd',         m:'Que cette fête t’apporte joie et bonheur.'},
  anniv:   {t:'Joyeux anniversaire',m:'Passe une merveilleuse journée pleine de surprises !'},
  nouvelan:{t:'Bonne année',        m:'Plein de réussite et de sourires pour cette nouvelle année.'},
  vacances:{t:'Bonnes vacances',    m:'Repose-toi bien et amuse-toi comme il faut !'},
}

async function pdfLabels(name, cls, n){
  const doc=new jsPDF({unit:'mm',format:'a4'}); const im=await toData(img(n))
  const W=210,H=297,M=12,gx=8,gy=6,cols=2,rows=5
  const lw=(W-2*M-gx)/cols, lh=(H-2*M-(rows-1)*gy)/rows
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
    const x=M+c*(lw+gx), y=M+r*(lh+gy)
    doc.setDrawColor(220,224,232); doc.setFillColor(250,250,253); doc.roundedRect(x,y,lw,lh,3,3,'FD')
    const s=lh-16; doc.addImage(im.url,'JPEG',x+5,y+(lh-s)/2,s,s,undefined,'FAST')
    const tx=x+5+s+7, tw=lw-s-20
    doc.setTextColor(120,125,140); doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.text('Ce cahier appartient à',tx,y+13)
    doc.setTextColor(30,36,51); doc.setFont('helvetica','bold'); doc.setFontSize(13); doc.text(doc.splitTextToSize(name,tw),tx,y+21)
    doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(140,145,160); doc.text(cls||'',tx,y+lh-7)
  }
  doc.save(`etiquettes-${name}.pdf`)
}
async function pdfCard(name, occ, n, color){
  const doc=new jsPDF({orientation:'landscape',unit:'mm',format:'a5'}); const W=210,H=148,[R,G,B]=rgb(color)
  doc.setFillColor(R,G,B); doc.rect(0,0,W,H,'F')
  doc.setFillColor(255,255,255); doc.roundedRect(7,7,W-14,H-14,5,5,'F')
  const im=await toData(img(n)); const f=fit(im.w,im.h,W*0.4,H-36); doc.addImage(im.url,'JPEG',16,(H-f.h)/2,f.w,f.h,undefined,'FAST')
  const tx=16+W*0.4+8, o=OCC[occ]
  doc.setTextColor(R,G,B); doc.setFont('helvetica','bold'); doc.setFontSize(24); doc.text(o.t,tx,H/2-8,{maxWidth:W-tx-14})
  doc.setFontSize(28); doc.text(`${name.split(' ')[0]} !`,tx,H/2+6,{maxWidth:W-tx-14})
  doc.setTextColor(90,95,110); doc.setFont('helvetica','normal'); doc.setFontSize(12); doc.text(o.m,tx,H/2+20,{maxWidth:W-tx-14})
  doc.setFontSize(8); doc.setTextColor(160,165,180); doc.text(`Avec toute l’affection de ${settings().schoolName}`,tx,H-18,{maxWidth:W-tx-14})
  doc.save(`carte-${occ}-${name}.pdf`)
}
async function pdfBookmarks(name, cls, n, color){
  const doc=new jsPDF({unit:'mm',format:'a4'}); const im=await toData(img(n)); const W=210,H=297,[R,G,B]=rgb(color)
  const M=14, gap=10, cols=4, bw=(W-2*M-(cols-1)*gap)/cols, bh=H-2*M
  for(let c=0;c<cols;c++){ const x=M+c*(bw+gap), y=M
    doc.setFillColor(R,G,B); doc.roundedRect(x,y,bw,bh,4,4,'F')
    doc.setFillColor(255,255,255); doc.roundedRect(x+3,y+3,bw-6,bh-6,3,3,'F')
    const s=bw-14; doc.addImage(im.url,'JPEG',x+7,y+8,s,s,undefined,'FAST')
    doc.setTextColor(R,G,B); doc.setFont('helvetica','bold'); doc.setFontSize(12); doc.text(doc.splitTextToSize(name,bw-10),x+bw/2,y+16+s,{align:'center'})
    doc.setTextColor(120,125,140); doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.text('Bonne lecture !',x+bw/2,y+30+s,{align:'center'})
    for(let k=0;k<9;k++){ doc.setFillColor(R,G,B); doc.circle(x+bw/2,y+50+s+k*22,1.4,'F') }
    doc.setFontSize(7); doc.setTextColor(170); doc.text(cls||'',x+bw/2,bh+M-6,{align:'center'})
  }
  doc.save(`marque-pages-${name}.pdf`)
}
async function pdfDiploma(name, cls, n, mention, color){
  const doc=new jsPDF({orientation:'landscape',unit:'mm',format:'a4'}); const W=297,H=210,[R,G,B]=rgb(color), s=settings()
  doc.setFillColor(255,255,255); doc.rect(0,0,W,H,'F')
  doc.setDrawColor(R,G,B); doc.setLineWidth(3); doc.roundedRect(9,9,W-18,H-18,6,6,'S')
  doc.setLineWidth(0.6); doc.roundedRect(13,13,W-26,H-26,5,5,'S')
  ;[[23,23],[W-23,23],[23,H-23],[W-23,H-23]].forEach(([x,y])=>star(doc,x,y,4,1.7,'F',[R,G,B]))
  doc.setTextColor(R,G,B); doc.setFont('helvetica','bold'); doc.setFontSize(34); doc.text('DIPLÔME',W/2,44,{align:'center'})
  doc.setTextColor(120,125,140); doc.setFont('helvetica','normal'); doc.setFontSize(12); doc.text('est fièrement décerné à',W/2,60,{align:'center'})
  doc.setTextColor(30,36,51); doc.setFont('helvetica','bold'); doc.setFontSize(30); doc.text(doc.splitTextToSize(name,W-80),W/2,78,{align:'center'})
  doc.setTextColor(90,95,110); doc.setFont('helvetica','normal'); doc.setFontSize(13); doc.text(doc.splitTextToSize(mention,W-90),W/2,96,{align:'center'})
  doc.setTextColor(140,145,160); doc.setFontSize(11); doc.text(`Classe de ${cls||'—'}   ·   ${s.schoolName}   ·   ${s.year}`,W/2,110,{align:'center'})
  const im=await toData(img(n)); const f=fit(im.w,im.h,70,48); doc.addImage(im.url,'JPEG',(W-f.w)/2,116,f.w,f.h,undefined,'FAST')
  star(doc,50,182,12,5,'F',[R,G,B]); doc.setTextColor(255,255,255); doc.setFont('helvetica','bold'); doc.setFontSize(7); doc.text('BRAVO',50,183.5,{align:'center'})
  doc.setDrawColor(185); doc.setLineWidth(0.4); doc.line(W-96,184,W-30,184)
  doc.setTextColor(140); doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.text('La direction',W-63,190,{align:'center'})
  doc.save(`diplome-${name}.pdf`)
}
async function pdfDoor(name, n, color){
  const doc=new jsPDF({unit:'mm',format:'a4'}); const W=210,H=297,[R,G,B]=rgb(color), fn=name.split(' ')[0]
  doc.setFillColor(R,G,B); doc.rect(0,0,W,H,'F')
  doc.setFillColor(255,255,255); doc.roundedRect(12,12,W-24,H-24,8,8,'F')
  const im=await toData(img(n)); const f=fit(im.w,im.h,W-56,124); doc.addImage(im.url,'JPEG',(W-f.w)/2,32,f.w,f.h,undefined,'FAST')
  doc.setTextColor(120,125,140); doc.setFont('helvetica','normal'); doc.setFontSize(20); doc.text('La chambre de',W/2,182,{align:'center'})
  doc.setTextColor(R,G,B); doc.setFont('helvetica','bold'); doc.setFontSize(50); doc.text(doc.splitTextToSize(fn,W-44),W/2,208,{align:'center'})
  doc.setTextColor(150,155,170); doc.setFont('helvetica','normal'); doc.setFontSize(13); doc.text('Entrée réservée aux super copains !',W/2,232,{align:'center'})
  ;[[34,252],[W-34,252],[W/2-26,264],[W/2+26,264]].forEach(([x,y])=>star(doc,x,y,5,2.1,'F',[R,G,B]))
  doc.save(`affiche-${fn}.pdf`)
}
async function pdfInvite(name, age, date, lieu, n, color){
  const doc=new jsPDF({unit:'mm',format:'a4'}); const W=210,[R,G,B]=rgb(color); const im=await toData(img(n)); const fn=name.split(' ')[0]
  for(let i=0;i<2;i++){ const oy=12+i*140, ph=128
    doc.setFillColor(R,G,B); doc.roundedRect(12,oy,W-24,ph,6,6,'F')
    doc.setFillColor(255,255,255); doc.roundedRect(16,oy+4,W-32,ph-8,4,4,'F')
    const f=fit(im.w,im.h,58,ph-24); doc.addImage(im.url,'JPEG',24,oy+(ph-f.h)/2,f.w,f.h,undefined,'FAST')
    const tx=24+62
    doc.setTextColor(R,G,B); doc.setFont('helvetica','bold'); doc.setFontSize(21); doc.text('Tu es invité(e) !',tx,oy+30)
    doc.setTextColor(30,36,51); doc.setFontSize(15); doc.text(doc.splitTextToSize(`${fn} fête ses ${age||'?'} ans`,W-tx-22),tx,oy+46)
    doc.setTextColor(90,95,110); doc.setFont('helvetica','normal'); doc.setFontSize(11)
    doc.text(`Quand :  ${date||'..........................'}`,tx,oy+64,{maxWidth:W-tx-22})
    doc.text(`Où :  ${lieu||'..........................'}`,tx,oy+76,{maxWidth:W-tx-22})
    doc.setTextColor(150,155,170); doc.setFontSize(9.5); doc.text('On compte sur toi !',tx,oy+94)
  }
  doc.save(`invitation-${fn}.pdf`)
}
async function pdfReward(name, n, color){
  const doc=new jsPDF({unit:'mm',format:'a4'}); const W=210,H=297,[R,G,B]=rgb(color), fn=name.split(' ')[0]
  doc.setFillColor(255,255,255); doc.rect(0,0,W,H,'F')
  doc.setDrawColor(R,G,B); doc.setLineWidth(2); doc.roundedRect(10,10,W-20,H-20,6,6,'S')
  const im=await toData(img(n)); const f=fit(im.w,im.h,40,40); doc.addImage(im.url,'JPEG',W-22-f.w,20,f.w,f.h,undefined,'FAST')
  doc.setTextColor(R,G,B); doc.setFont('helvetica','bold'); doc.setFontSize(22); doc.text('Mes étoiles de la semaine',22,34,{maxWidth:W-78})
  doc.setTextColor(90,95,110); doc.setFont('helvetica','normal'); doc.setFontSize(14); doc.text(fn,22,47)
  const days=['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']
  days.forEach((d,i)=>{ const y=70+i*26
    doc.setFillColor(247,247,250); doc.roundedRect(18,y-8,W-36,22,4,4,'F')
    doc.setTextColor(50,55,70); doc.setFont('helvetica','bold'); doc.setFontSize(12); doc.text(d,26,y+5)
    for(let k=0;k<5;k++) star(doc,98+k*20,y+3,6,2.5,'S',[R,G,B])
  })
  doc.setDrawColor(205); doc.setLineWidth(0.4); doc.line(22,266,W-22,266)
  doc.setTextColor(120); doc.setFont('helvetica','normal'); doc.setFontSize(11); doc.text('Objectif de la semaine :',22,277)
  doc.save(`etoiles-${fn}.pdf`)
}

export default function Cadeaux(){
  const u=current(); const d=db()
  const isParent=u.role==='parent'
  const students = isParent ? (u.childIds||[]).map(studentById).filter(Boolean) : d.students
  const [sid,setSid]=useState(students[0]?.id)
  const student=students.find(s=>s.id===sid)||students[0]
  const cls=student?classById(student.classId):null
  const [gift,setGift]=useState(null); const [pick,setPick]=useState(42); const [form,setForm]=useState({}); const [busy,setBusy]=useState(false)

  const openGift=g=>{ setGift(g); setPick(g.defImg)
    const f={}; (g.inputs||[]).forEach(inp=>{ f[inp.name]= inp.type==='occ' ? 'bravo' : (inp.default ?? '') }); setForm(f) }
  const set=(k,v)=>setForm(o=>({...o,[k]:v}))
  const make=async()=>{ if(!student)return; setBusy(true)
    const nm=student.name, cn=cls?.name, col=gift.color
    try{
      if(gift.key==='labels') await pdfLabels(nm,cn,pick)
      else if(gift.key==='card') await pdfCard(nm,form.occ,pick,col)
      else if(gift.key==='bookmark') await pdfBookmarks(nm,cn,pick,col)
      else if(gift.key==='diploma') await pdfDiploma(nm,cn,pick,form.mention,col)
      else if(gift.key==='door') await pdfDoor(nm,pick,col)
      else if(gift.key==='invite') await pdfInvite(nm,form.age,form.date,form.lieu,pick,col)
      else if(gift.key==='reward') await pdfReward(nm,pick,col)
      toast.success('Cadeau prêt — PDF téléchargé 🎁')
    }catch(e){ toast.error('Impossible de générer le PDF') }
    setBusy(false)
  }

  if(!student) return <Card className="p-10 text-center text-muted">Aucun enfant associé à ce compte.</Card>

  return (<>
    <PageHead title="Le Coin des Cadeaux" sub="De jolis cadeaux personnalisés à imprimer pour votre enfant."
      action={students.length>1&&<Field label={isParent?'Enfant':'Élève'}><Select value={sid} onChange={e=>setSid(e.target.value)}>{students.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</Select></Field>}/>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {GIFTS.map(g=>(
        <button key={g.key} onClick={()=>openGift(g)} className="card p-6 text-left hover:shadow-xl hover:-translate-y-0.5 transition relative overflow-hidden">
          <span className="absolute right-0 top-0 w-24 h-24 rounded-full -mr-8 -mt-8" style={{background:g.color+'14'}}/>
          <span className="relative w-12 h-12 rounded-2xl grid place-items-center text-white" style={{background:g.color}}><g.Icon size={22}/></span>
          <h3 className="relative font-extrabold text-lg mt-4">{g.title}</h3>
          <p className="relative text-sm text-muted mt-1">{g.desc}</p>
          <div className="relative flex items-center gap-1 text-xs font-bold mt-3" style={{color:g.color}}><Gift size={13}/> Créer pour {student.name.split(' ')[0]}</div>
        </button>
      ))}
    </div>

    <Modal open={!!gift} onClose={()=>setGift(null)} size="2xl"
      title={gift?<span className="flex items-center gap-2"><gift.Icon size={16} style={{color:gift.color}}/> {gift.title} · {student.name.split(' ')[0]}</span>:''}
      footer={gift&&<><div className="flex-1 text-xs text-muted self-center">{gift.fmt} · prêt à imprimer</div><Btn variant="ghost" onClick={()=>setGift(null)}>Fermer</Btn><Btn onClick={make} disabled={busy}><Download size={15}/> {busy?'…':'Télécharger le PDF'}</Btn></>}>
      {gift&&<div className="grid md:grid-cols-[1fr_260px] gap-5">
        <div>
          <div className="text-xs font-bold uppercase text-muted mb-2">Aperçu</div>
          <Preview gift={gift} name={student.name} cls={cls?.name} n={pick} form={form}/>
        </div>
        <div>
          {(gift.inputs||[]).map(inp=> inp.type==='occ'
            ? <Field key={inp.name} label="Occasion"><Select value={form.occ||'bravo'} onChange={e=>set('occ',e.target.value)}>{Object.entries(OCC).map(([k,v])=><option key={k} value={k}>{v.t}</option>)}</Select></Field>
            : inp.type==='select'
            ? <div key={inp.name} className="mb-2"><Field label={inp.label}><Select value={form[inp.name]||''} onChange={e=>set(inp.name,e.target.value)}>{inp.options.map(o=><option key={o} value={o}>{o.charAt(0).toUpperCase()+o.slice(1)}</option>)}</Select></Field></div>
            : <div key={inp.name} className="mb-2"><Field label={inp.label}><input type={inp.type} className={IN} value={form[inp.name]||''} placeholder={inp.placeholder||''} onChange={e=>set(inp.name,e.target.value)}/></Field></div>
          )}
          <div className="text-xs font-semibold text-muted mt-3 mb-1.5">Choisir l’illustration</div>
          <div className="grid grid-cols-4 gap-1.5 max-h-[260px] overflow-y-auto scroll-thin pr-1">
            {IMGS.map(n=>(
              <button key={n} onClick={()=>setPick(n)} className={`relative rounded-lg overflow-hidden border-2 ${pick===n?'':'border-transparent'}`} style={pick===n?{borderColor:gift.color}:{}}>
                <img src={img(n)} alt="" loading="lazy" className="w-full h-12 object-cover"/>
                {pick===n&&<span className="absolute inset-0 grid place-items-center" style={{background:gift.color+'55'}}><Check size={16} className="text-white"/></span>}
              </button>
            ))}
          </div>
        </div>
      </div>}
    </Modal>
  </>)
}

function Preview({ gift, name, cls, n, form }){
  const c=gift.color, fn=name.split(' ')[0], s=settings()
  if(gift.key==='card'){ const o=OCC[form.occ||'bravo']
    return (<div className="rounded-2xl p-3" style={{background:c}}>
      <div className="bg-white rounded-xl p-4 flex items-center gap-4 min-h-[200px]">
        <img src={img(n)} className="w-2/5 object-contain" alt=""/>
        <div><div className="text-2xl font-extrabold leading-tight" style={{color:c}}>{o.t}<br/>{fn} !</div>
          <div className="text-sm text-muted mt-2">{o.m}</div></div>
      </div></div>)
  }
  if(gift.key==='bookmark') return (<div className="flex gap-3 justify-center">
    {[0,1].map(i=><div key={i} className="rounded-xl p-1.5 w-24" style={{background:c}}><div className="bg-white rounded-lg p-2 text-center"><img src={img(n)} className="w-full aspect-square object-cover rounded" alt=""/><div className="font-bold text-sm mt-1" style={{color:c}}>{fn}</div><div className="text-[10px] text-muted">Bonne lecture !</div></div></div>)}
    <div className="self-center text-xs text-muted">…× 4 sur la planche</div></div>)
  if(gift.key==='diploma') return (<div className="rounded-2xl border-4 p-5 text-center" style={{borderColor:c}}>
    <div className="text-xl font-extrabold tracking-widest" style={{color:c}}>★ DIPLÔME ★</div>
    <div className="text-xs text-muted mt-3">est fièrement décerné à</div>
    <div className="text-2xl font-extrabold mt-1">{name}</div>
    <div className="text-sm text-muted mt-2">{form.mention}</div>
    <div className="text-[11px] text-muted mt-1">Classe de {cls||'—'} · {s.schoolName} · {s.year}</div>
    <img src={img(n)} className="h-20 mx-auto mt-3 object-contain" alt=""/></div>)
  if(gift.key==='door') return (<div className="rounded-2xl p-2" style={{background:c}}>
    <div className="bg-white rounded-xl p-4 text-center">
      <img src={img(n)} className="h-28 mx-auto object-contain" alt=""/>
      <div className="text-muted mt-3">La chambre de</div>
      <div className="text-4xl font-extrabold leading-tight" style={{color:c}}>{fn}</div>
      <div className="text-xs text-muted mt-2">Entrée réservée aux super copains !</div>
    </div></div>)
  if(gift.key==='invite') return (<div className="rounded-2xl p-2" style={{background:c}}>
    <div className="bg-white rounded-xl p-4 flex gap-3 items-center min-h-[150px]">
      <img src={img(n)} className="w-1/3 object-contain" alt=""/>
      <div><div className="font-extrabold text-lg" style={{color:c}}>Tu es invité(e) !</div>
        <div className="font-bold mt-1">{fn} fête ses {form.age||'?'} ans</div>
        <div className="text-sm text-muted mt-1">Quand : {form.date||'…'}</div>
        <div className="text-sm text-muted">Où : {form.lieu||'…'}</div></div>
    </div>
    <div className="text-center text-white text-xs mt-1 font-semibold">2 invitations par page</div></div>)
  if(gift.key==='reward') return (<div className="rounded-2xl border-2 p-4" style={{borderColor:c}}>
    <div className="flex justify-between items-center"><div><div className="font-extrabold" style={{color:c}}>Mes étoiles de la semaine</div><div className="text-sm text-muted">{fn}</div></div><img src={img(n)} className="h-12 object-contain" alt=""/></div>
    {['Lundi','Mardi','Mercredi'].map(d=><div key={d} className="flex items-center justify-between bg-canvas rounded-lg px-3 py-2 mt-2"><span className="text-sm font-semibold">{d}</span><span className="flex gap-1">{[0,1,2,3,4].map(k=><Star key={k} size={14} style={{color:c}}/>)}</span></div>)}
    <div className="text-xs text-muted text-center mt-2">…7 jours sur la feuille</div></div>)
  // labels
  return (<div className="grid grid-cols-2 gap-2">
    {[0,1,2,3].map(i=><div key={i} className="border border-line rounded-xl p-2 flex items-center gap-2 bg-canvas/40">
      <img src={img(n)} className="w-12 h-12 object-cover rounded-lg" alt=""/>
      <div><div className="text-[10px] text-muted">Ce cahier appartient à</div><div className="font-bold text-sm">{name}</div><div className="text-[10px] text-muted">{cls}</div></div>
    </div>)}
    <div className="col-span-2 text-xs text-muted text-center">La planche contient 10 étiquettes.</div>
  </div>)
}
