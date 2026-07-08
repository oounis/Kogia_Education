import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

// Horloge du tableau de bord — le pendant temporel de la météo :
// heure en direct (les secondes battent), jour et date, teintées par le portail.
export default function ClockCorner(){
  const [now,setNow]=useState(()=>new Date())
  useEffect(()=>{ const t=setInterval(()=>setNow(new Date()),1000); return ()=>clearInterval(t) },[])
  const hm=format(now,'HH:mm'), ss=format(now,'ss')
  return (
    <div className="hidden lg:flex items-center gap-2.5 pl-3 pr-3.5 py-1.5 rounded-2xl select-none"
      title={format(now,'EEEE d MMMM yyyy · HH:mm:ss',{locale:fr})}
      style={{background:'linear-gradient(135deg, color-mix(in srgb, var(--accent) 14%, #fff), color-mix(in srgb, var(--accent-2, var(--accent)) 22%, #fff))'}}>
      <div className="leading-none text-right">
        <div className="font-extrabold text-sm tabular-nums accent-text">{hm}<span className="text-[10px] font-bold opacity-60">:{ss}</span></div>
        <div className="text-[10px] font-semibold text-muted capitalize">{format(now,'EEE d MMM',{locale:fr})}</div>
      </div>
      <span className="relative w-2 h-2" aria-hidden="true">
        <span className="absolute inset-0 rounded-full accent-bg opacity-30 animate-ping"/>
        <span className="absolute inset-0 rounded-full accent-bg"/>
      </span>
    </div>
  )
}
