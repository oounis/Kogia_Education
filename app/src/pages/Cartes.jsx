import { useState } from 'react'
import { jsPDF } from 'jspdf'
import { CARDS, art } from '../cards.js'
import { PageHead, Modal, Btn } from '../components/ui.jsx'
import { Mark } from '../components/ui.jsx'
import { Heart, Download, Printer, X } from 'lucide-react'
import toast from 'react-hot-toast'

const rgb=hex=>{const n=parseInt(hex.slice(1),16);return [(n>>16)&255,(n>>8)&255,n&255]}
function loadImg(src){ return new Promise((res,rej)=>{ const i=new Image(); i.onload=()=>res(i); i.onerror=rej; i.src=src }) }
async function toPNG(src){ const i=await loadImg(src); const c=document.createElement('canvas'); c.width=i.naturalWidth; c.height=i.naturalHeight; c.getContext('2d').drawImage(i,0,0); return {url:c.toDataURL('image/png'), w:i.naturalWidth, h:i.naturalHeight} }
const fit=(iw,ih,bw,bh)=>{ const r=Math.min(bw/iw,bh/ih); return {w:iw*r,h:ih*r} }
function heart(doc,cx,cy,s,c){ doc.setFillColor(c[0],c[1],c[2]); doc.circle(cx-s*0.45,cy-s*0.22,s*0.5,'F'); doc.circle(cx+s*0.45,cy-s*0.22,s*0.5,'F'); doc.triangle(cx-s*0.92,cy-s*0.02,cx+s*0.92,cy-s*0.02,cx,cy+s*0.95,'F') }

async function buildPDF(card){
  const doc=new jsPDF({unit:'mm',format:'a6'}); const W=105,H=148
  const a=rgb(card.accent), b=rgb(card.bg), k=rgb(card.ink)
  doc.setFillColor(b[0],b[1],b[2]); doc.rect(0,0,W,H,'F')
  doc.setDrawColor(a[0],a[1],a[2]); doc.setLineWidth(1.1); doc.roundedRect(7,7,W-14,H-14,5,5,'S')
  doc.setLineWidth(0.35); doc.roundedRect(10,10,W-20,H-20,4,4,'S')
  ;[[14,14],[W-14,14],[14,H-14],[W-14,H-14]].forEach(([x,y])=>heart(doc,x,y,2.3,a))
  for(let x=24;x<=W-24;x+=6){ doc.setFillColor(a[0],a[1],a[2]); doc.circle(x,13,0.5,'F'); doc.circle(x,H-13,0.5,'F') }
  const im=await toPNG(art(card.img)); const f=fit(im.w,im.h,W-34,70); doc.addImage(im.url,'PNG',(W-f.w)/2,19,f.w,f.h,undefined,'FAST')
  doc.setTextColor(k[0],k[1],k[2]); doc.setFont('times','italic'); doc.setFontSize(18)
  doc.text(doc.splitTextToSize(card.text,W-30),W/2,104,{align:'center'})
  doc.setFont('helvetica','bold'); doc.setFontSize(6.5); doc.setTextColor(a[0],a[1],a[2]); doc.setCharSpace(1)
  doc.text('KOGIA EDU',W/2,H-17,{align:'center'}); doc.setCharSpace(0)
  return doc
}

// on-screen card that mirrors the printed design
function CardFace({ card }){
  const dots=Array.from({length:11})
  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{aspectRatio:'105/148', background:card.bg}}>
      <div className="absolute rounded-xl" style={{inset:'6%', border:`2px solid ${card.accent}`}}/>
      <div className="absolute rounded-lg" style={{inset:'8.5%', border:`1px solid ${card.accent}66`}}/>
      {[['top-[4%] left-[4%]'],['top-[4%] right-[4%]'],['bottom-[4%] left-[4%]'],['bottom-[4%] right-[4%]']].map((p,i)=>
        <Heart key={i} size={13} className={`absolute ${p}`} style={{color:card.accent,fill:card.accent}}/>)}
      <div className="absolute top-[7.5%] inset-x-[18%] flex justify-between">{dots.map((_,i)=><span key={i} className="w-1 h-1 rounded-full" style={{background:card.accent}}/>)}</div>
      <div className="absolute bottom-[8%] inset-x-[18%] flex justify-between">{dots.map((_,i)=><span key={i} className="w-1 h-1 rounded-full" style={{background:card.accent}}/>)}</div>
      <div className="absolute inset-x-0 top-[12%] h-[48%] flex items-center justify-center px-[16%]"><img src={art(card.img)} alt="" className="max-h-full max-w-full object-contain drop-shadow-lg"/></div>
      <div className="absolute inset-x-0 top-[63%] px-[15%] text-center"><p className="font-serif italic leading-snug" style={{color:card.ink,fontSize:'clamp(13px,3.4vw,20px)'}}>{card.text}</p></div>
      <div className="absolute bottom-[10.5%] inset-x-0 flex justify-center items-center gap-1 opacity-90"><Mark size={13}/><span className="text-[9px] font-extrabold tracking-[.2em]" style={{color:card.accent}}>KOGIA EDU</span></div>
    </div>
  )
}

export default function Cartes(){
  const [open,setOpen]=useState(null); const [busy,setBusy]=useState(false)
  const download=async(card)=>{ setBusy(true); try{ (await buildPDF(card)).save(`carte-${card.id}.pdf`); toast.success('Carte prête — PDF téléchargé ✨') }catch{ toast.error('Impossible de générer le PDF') } setBusy(false) }
  const print=async(card)=>{ setBusy(true); try{ const url=(await buildPDF(card)).output('bloburl'); window.open(url,'_blank') }catch{ toast.error('Impossible d’ouvrir l’aperçu') } setBusy(false) }
  return (<>
    <PageHead title="Cartes à imprimer" sub="De jolies cartes illustrées, prêtes à imprimer ou à partager."/>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 max-w-4xl">
      {CARDS.map(c=>(
        <button key={c.id} onClick={()=>setOpen(c)} className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition">
          <CardFace card={c}/>
          <div className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition bg-black/20 pointer-events-none">
            <span className="flex items-center gap-2 bg-white text-ink font-bold text-sm px-4 py-2 rounded-full shadow"><Download size={15}/> Ouvrir</span>
          </div>
        </button>
      ))}
    </div>

    <Modal open={!!open} onClose={()=>setOpen(null)} size="lg"
      title={open?<span className="flex items-center gap-2"><Heart size={15} style={{color:open.accent,fill:open.accent}}/> Carte à imprimer</span>:''}
      footer={open&&<><div className="flex-1 text-xs text-muted self-center">Format carte A6 · prêt à imprimer</div>
        <Btn variant="ghost" onClick={()=>print(open)} disabled={busy}><Printer size={15}/> Imprimer</Btn>
        <Btn onClick={()=>download(open)} disabled={busy}><Download size={15}/> {busy?'…':'Télécharger le PDF'}</Btn></>}>
      {open&&<div className="max-w-[300px] mx-auto"><CardFace card={open}/></div>}
    </Modal>
  </>)
}
