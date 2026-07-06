import { useMemo } from 'react'
import { ReactFlow, Background, BackgroundVariant, Handle, Position } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Check } from 'lucide-react'

const COLOR = { entree:'#7C8698', class:'#6C5CE7', cour:'#22C55E', cantine:'#F59E0B' }
const rmap = s => `${import.meta.env.BASE_URL}rmap/${s}.jpg`
// map a stop to one of the user's room-scene illustrations
function slugFor(kind, label){
  if(kind==='entree') return label==='Sortie' ? 'sortie' : 'arrivee'
  if(kind==='cour') return 'recre'
  if(kind==='cantine') return 'cantine'
  const l=(label||'').toLowerCase()
  if(l.includes('sport')) return 'sport'
  if(l.includes('musi')) return 'musique'
  if(l.includes('art')) return 'arts'
  if(l.includes('info')) return 'informatique'
  if(l.includes('arabe')) return 'arabe'
  if(l.includes('fran')) return 'francais'
  if(l.includes('angl')) return 'anglais'
  if(l.includes('math')) return 'maths'
  if(l.includes('scien')||l.includes('éveil')||l.includes('eveil')) return 'sciences'
  return 'arabe' // generic classroom (islamique / civique / étude…)
}
const H = { opacity:0, width:1, height:1, minWidth:0, minHeight:0, border:0 }
const HC = { ...H, top:49 } // align L/R handles to thumbnail centre

function StationNode({ data }){
  const { color, img, label, time, sub, state, name, remain, done=0 } = data
  const isDone=state==='done', isCur=state==='current', isFut=state==='future'
  const ring = isCur?`0 0 0 3.5px ${color}` : isDone?`0 0 0 2.5px ${color}` : '0 0 0 2px #DFE4EC'
  const D=2*Math.PI*33
  return (
    <div className="relative flex flex-col items-center" style={{width:130}}>
      <div className="text-[10px] font-extrabold mb-1.5" style={{color:'#AAB3C2'}}>{time}</div>
      <div className="relative grid place-items-center">
        {isCur && <span className="absolute w-16 h-16 rounded-full animate-ping" style={{background:color,opacity:.22}}/>}
        {isCur && <svg className="absolute" width="72" height="72" viewBox="0 0 72 72"><circle cx="36" cy="36" r="33" fill="none" stroke={color} strokeWidth="3.5" strokeDasharray={D} strokeDashoffset={D*(1-done)} strokeLinecap="round" transform="rotate(-90 36 36)"/></svg>}
        <div className="w-16 h-16 rounded-full overflow-hidden bg-white relative" style={{boxShadow:`${ring}, 0 5px 14px rgba(30,36,51,.14)`}}>
          <img src={img} alt="" className="w-full h-full object-cover" style={{filter:isFut?'grayscale(.65) opacity(.62)':'none'}}/>
          {isDone && <div className="absolute inset-0 grid place-items-center" style={{background:color+'9E'}}><Check size={22} strokeWidth={3.4} className="text-white"/></div>}
        </div>
        {isCur && <div className="absolute -top-6 whitespace-nowrap bg-white rounded-full shadow-lg px-2.5 py-1 flex items-center gap-1.5 border border-line z-10">
          <span className="w-2 h-2 rounded-full" style={{background:color}}/>
          <span className="text-[11px] font-extrabold text-ink">{name}{remain>0?` · ${remain}m`:''}</span>
        </div>}
      </div>
      <div className={`text-[11px] mt-2 text-center leading-tight ${isCur?'font-extrabold':'font-semibold'}`} style={{color:isFut?'#B2BAC8':'#333B4C'}}>{label}</div>
      {sub && !isFut && <div className="text-[9.5px]" style={{color:'#A6AFBE'}}>{sub}</div>}
      <Handle id="r" type="source" position={Position.Right} style={HC}/>
      <Handle id="l" type="target" position={Position.Left} style={HC}/>
      <Handle id="l2" type="source" position={Position.Left} style={HC}/>
      <Handle id="r2" type="target" position={Position.Right} style={HC}/>
      <Handle id="b" type="source" position={Position.Bottom} style={H}/>
      <Handle id="t" type="target" position={Position.Top} style={H}/>
    </div>
  )
}
const nodeTypes = { station: StationNode }

export default function RouteMapFlow({ stops, curIndex, done=0, remain, name='' }){
  const COLS=4, COLW=205, ROWH=172
  const curColor=COLOR[stops[curIndex]?.kind]||COLOR.class
  const P = useMemo(()=> stops.map((_,i)=>{ const row=Math.floor(i/COLS), inRow=i%COLS, col=row%2===0?inRow:(COLS-1-inRow); return {x:col*COLW, y:row*ROWH} }),[stops.length])

  const nodes = stops.map((s,i)=>({ id:String(i), type:'station', position:P[i], draggable:false, selectable:false,
    data:{ ...s, color:COLOR[s.kind]||COLOR.class, img:rmap(slugFor(s.kind,s.label)),
      state: i<curIndex?'done':i===curIndex?'current':'future', name, remain, done } }))

  const edges = stops.slice(0,-1).map((_,i)=>{ const a=P[i], b=P[i+1]
    let sh,th; if(a.y===b.y){ if(b.x>a.x){sh='r';th='l'} else {sh='l2';th='r2'} } else { sh='b'; th='t' }
    const doneSeg=(i+1)<=curIndex, flowing=i===curIndex, col=COLOR[stops[i].kind]||COLOR.class
    return { id:'e'+i, source:String(i), target:String(i+1), sourceHandle:sh, targetHandle:th, type:'straight', animated:flowing,
      style:{ stroke:doneSeg?col:flowing?curColor:'#DEE3EC', strokeWidth:doneSeg?3.5:flowing?3.5:2.5, opacity:doneSeg?0.5:1,
        strokeDasharray:(!doneSeg&&!flowing)?'1 7':undefined, strokeLinecap:'round' } }
  })

  const rows=Math.ceil(stops.length/COLS)
  return (
    <div className="rounded-b-2xl overflow-hidden" style={{height:Math.max(320,rows*172+40), background:'radial-gradient(120% 100% at 50% 0%, #F5F4FF, #FFFFFF 60%)'}}>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView fitViewOptions={{padding:0.14}}
        nodesDraggable={false} nodesConnectable={false} elementsSelectable={false} nodesFocusable={false} edgesFocusable={false}
        panOnDrag={false} panOnScroll={false} zoomOnScroll={false} zoomOnPinch={false} zoomOnDoubleClick={false}
        preventScrolling={false} minZoom={0.2} maxZoom={1.4} proOptions={{hideAttribution:true}} style={{background:'transparent'}}>
        <Background variant={BackgroundVariant.Dots} gap={22} size={1.3} color="#E9EBF3"/>
      </ReactFlow>
    </div>
  )
}
