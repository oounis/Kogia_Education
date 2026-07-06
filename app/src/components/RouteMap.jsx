import { motion } from 'framer-motion'

const KM = {
  entree:  { c:'#7C8698', e:'🚪' },
  class:   { c:'#6C5CE7', e:'📚' },
  cour:    { c:'#22C55E', e:'⚽' },
  cantine: { c:'#F59E0B', e:'🍽️' },
}
const trunc = (s,n=13)=> s && s.length>n ? s.slice(0,n-1)+'…' : s

// Light, elegant "school-day route" diagram: a metro-style line of stops with
// the pupil travelling along it. curIndex = current stop, done = 0..1 within it.
export default function RouteMap({ stops, curIndex, done=0, remain, name='' }){
  const n=stops.length, COLS=4
  const rows=Math.ceil(n/COLS), MX=48, MY=50, colGap=(400-2*MX)/(COLS-1), rowGap=94
  const VBH=MY+(rows-1)*rowGap+54
  const pos=i=>{ const row=Math.floor(i/COLS), inRow=i%COLS, col=row%2===0?inRow:(COLS-1-inRow); return {x:MX+col*colGap, y:MY+row*rowGap} }
  const P=stops.map((_,i)=>pos(i))
  const cur=P[curIndex]||P[0]
  const curColor=(KM[stops[curIndex]?.kind]||KM.class).c
  const R=15, CIRC=2*Math.PI*R

  return (
    <div style={{background:'radial-gradient(130% 100% at 50% -10%, #F5F4FF 0%, #FBFBFE 55%, #FFFFFF 100%)'}}>
      <svg viewBox={`0 0 400 ${VBH}`} className="w-full h-auto block">
        <defs>
          <filter id="rmShadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="1.4" stdDeviation="1.6" floodColor="#1E2433" floodOpacity="0.13"/>
          </filter>
        </defs>
        <style>{`@keyframes df{to{stroke-dashoffset:-16}} .flow{stroke-dasharray:0.5 7;stroke-linecap:round;animation:df 0.9s linear infinite}`}</style>

        {/* connectors — light */}
        {stops.slice(0,-1).map((_,i)=>{ const a=P[i], b=P[i+1]
          const doneSeg=(i+1)<=curIndex, flowing=i===curIndex
          const col=(KM[stops[i].kind]||KM.class).c
          if(flowing) return <line key={'c'+i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={curColor} strokeWidth="3" className="flow" opacity="0.8"/>
          if(doneSeg) return <line key={'c'+i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={col} strokeWidth="3.2" strokeLinecap="round" opacity="0.42"/>
          return <line key={'c'+i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#E4E9F1" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="0.5 7"/>
        })}

        {/* stations */}
        {stops.map((s,i)=>{ const p=P[i], m=KM[s.kind]||KM.class
          const isDone=i<curIndex, isCur=i===curIndex, isFut=i>curIndex
          return <g key={i}>
            <text x={p.x} y={p.y-R-9} textAnchor="middle" fontSize="8" fontWeight="700" fill="#AAB3C2">{s.time}</text>
            <circle cx={p.x} cy={p.y} r={R} fill="#fff" filter="url(#rmShadow)"/>
            {isDone && <circle cx={p.x} cy={p.y} r={R} fill={m.c} opacity="0.11"/>}
            <circle cx={p.x} cy={p.y} r={R} fill="none" stroke={isFut?'#DDE3EC':m.c} strokeWidth={isCur?3:2.2} opacity={isFut?1:isDone?0.6:1}/>
            {isDone
              ? <text x={p.x} y={p.y+4.5} textAnchor="middle" fontSize="13" fontWeight="900" fill={m.c}>✓</text>
              : <text x={p.x} y={p.y+5} textAnchor="middle" fontSize="14" opacity={isFut?0.4:1}>{m.e}</text>}
            {isCur && <>
              <motion.circle cx={p.x} cy={p.y} r={R} fill="none" stroke={m.c} strokeWidth="2"
                animate={{r:[R,R+10],opacity:[.5,0]}} transition={{repeat:Infinity,duration:1.9,ease:'easeOut'}}/>
              <circle cx={p.x} cy={p.y} r={R} fill="none" stroke={m.c} strokeWidth="3" strokeDasharray={CIRC}
                strokeDashoffset={CIRC*(1-done)} strokeLinecap="round" transform={`rotate(-90 ${p.x} ${p.y})`}/>
            </>}
            <text x={p.x} y={p.y+R+13} textAnchor="middle" fontSize="8.4" fontWeight={isCur?'800':'600'} fill={isFut?'#B2BAC8':'#333B4C'}>{trunc(s.label)}</text>
            {s.sub && i<=curIndex && <text x={p.x} y={p.y+R+22} textAnchor="middle" fontSize="7" fill="#A6AFBE">{trunc(s.sub,15)}</text>}
          </g>
        })}

        {/* pupil marker — light pill that glides between stops */}
        <motion.g initial={false} animate={{x:cur.x, y:cur.y-R-15}} transition={{type:'spring',stiffness:120,damping:16}}>
          <rect x={-34} y={-15} width="68" height="19" rx="9.5" fill="#fff" filter="url(#rmShadow)"/>
          <circle cx={-24} cy={-5.5} r="3.2" fill={curColor}/>
          <path d="M-5 4 L5 4 L0 9 Z" fill="#fff"/>
          <text x="4" y="-2" textAnchor="middle" fontSize="8.4" fontWeight="800" fill="#2B3242">{name}{remain>0?` · ${remain}m`:''}</text>
        </motion.g>
      </svg>

      {/* legend */}
      <div className="flex items-center justify-center gap-4 pb-3 -mt-1 text-[11px] text-muted">
        <span className="flex items-center gap-1.5"><i className="w-2.5 h-2.5 rounded-full bg-brand/70"/> Fait</span>
        <span className="flex items-center gap-1.5"><i className="w-2.5 h-2.5 rounded-full ring-2 ring-brand"/> En cours</span>
        <span className="flex items-center gap-1.5"><i className="w-2.5 h-2.5 rounded-full border-2 border-line"/> À venir</span>
      </div>
    </div>
  )
}
