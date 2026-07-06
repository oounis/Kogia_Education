import { useMemo } from 'react'
import { ReactFlow, Background, BackgroundVariant, Handle, Position } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Check } from 'lucide-react'

// activity meta — `icon` is a placeholder emoji; swap for the user's motifs later
const KM = {
  entree:  { c:'#7C8698', icon:'🚪' },
  class:   { c:'#6C5CE7', icon:'📚' },
  cour:    { c:'#22C55E', icon:'⚽' },
  cantine: { c:'#F59E0B', icon:'🍽️' },
}
const H = { opacity:0, width:1, height:1, minWidth:0, minHeight:0, border:0 }
const HC = { ...H, top:38 }  // align L/R handles to the circle centre

function StationNode({ data }){
  const { color, icon, label, time, sub, state, name, remain, done=0 } = data
  const isDone=state==='done', isCur=state==='current', isFut=state==='future'
  const ring = isCur?`0 0 0 3px ${color}` : isDone?`0 0 0 2px ${color}` : '0 0 0 2px #DFE4EC'
  return (
    <div className="relative flex flex-col items-center" style={{width:104}}>
      <div className="text-[10px] font-extrabold mb-1" style={{color:'#AAB3C2'}}>{time}</div>
      <div className="relative grid place-items-center">
        {isCur && <span className="absolute w-11 h-11 rounded-full animate-ping" style={{background:color,opacity:.25}}/>}
        {/* progress ring */}
        {isCur && <svg className="absolute" width="52" height="52" viewBox="0 0 52 52"><circle cx="26" cy="26" r="24" fill="none" stroke={color} strokeWidth="3" strokeDasharray={2*Math.PI*24} strokeDashoffset={2*Math.PI*24*(1-done)} strokeLinecap="round" transform="rotate(-90 26 26)"/></svg>}
        <div className="w-11 h-11 rounded-full grid place-items-center bg-white" style={{boxShadow:`${ring}, 0 4px 10px rgba(30,36,51,.10)`, opacity:isFut?.9:1}}>
          {isDone ? <Check size={18} strokeWidth={3} style={{color}}/> : <span className="text-[19px]" style={{opacity:isFut?.5:1}}>{icon}</span>}
        </div>
        {isCur && <div className="absolute -top-7 whitespace-nowrap bg-white rounded-full shadow-lg px-2.5 py-1 flex items-center gap-1.5 border border-line">
          <span className="w-2 h-2 rounded-full" style={{background:color}}/>
          <span className="text-[11px] font-extrabold text-ink">{name}{remain>0?` · ${remain}m`:''}</span>
        </div>}
      </div>
      <div className={`text-[11px] mt-1.5 text-center leading-tight ${isCur?'font-extrabold':'font-semibold'}`} style={{color:isFut?'#B2BAC8':'#333B4C'}}>{label}</div>
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
  const COLS=4, COLW=190, ROWH=150
  const curColor=(KM[stops[curIndex]?.kind]||KM.class).c
  const P = useMemo(()=> stops.map((_,i)=>{ const row=Math.floor(i/COLS), inRow=i%COLS, col=row%2===0?inRow:(COLS-1-inRow); return {x:col*COLW, y:row*ROWH} }),[stops.length])

  const nodes = stops.map((s,i)=>({ id:String(i), type:'station', position:P[i], draggable:false, selectable:false,
    data:{ ...s, color:(KM[s.kind]||KM.class).c, icon:(KM[s.kind]||KM.class).icon,
      state: i<curIndex?'done':i===curIndex?'current':'future', name, remain, done } }))

  const edges = stops.slice(0,-1).map((_,i)=>{ const a=P[i], b=P[i+1]
    let sh,th; if(a.y===b.y){ if(b.x>a.x){sh='r';th='l'} else {sh='l2';th='r2'} } else { sh='b'; th='t' }
    const doneSeg=(i+1)<=curIndex, flowing=i===curIndex, col=(KM[stops[i].kind]||KM.class).c
    return { id:'e'+i, source:String(i), target:String(i+1), sourceHandle:sh, targetHandle:th, type:'straight',
      animated:flowing,
      style:{ stroke:doneSeg?col:flowing?curColor:'#DEE3EC', strokeWidth:doneSeg?3.5:flowing?3.5:2.5, opacity:doneSeg?0.5:1,
        strokeDasharray:(!doneSeg&&!flowing)?'1 7':undefined, strokeLinecap:'round' } }
  })

  const rows=Math.ceil(stops.length/COLS)
  return (
    <div className="rounded-b-2xl overflow-hidden" style={{height: Math.max(300, rows*150+40), background:'radial-gradient(120% 100% at 50% 0%, #F5F4FF, #FFFFFF 60%)'}}>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView fitViewOptions={{padding:0.16}}
        nodesDraggable={false} nodesConnectable={false} elementsSelectable={false} nodesFocusable={false} edgesFocusable={false}
        panOnDrag={false} panOnScroll={false} zoomOnScroll={false} zoomOnPinch={false} zoomOnDoubleClick={false}
        preventScrolling={false} minZoom={0.2} maxZoom={1.4} proOptions={{hideAttribution:true}}
        style={{background:'transparent'}}>
        <Background variant={BackgroundVariant.Dots} gap={22} size={1.3} color="#E9EBF3"/>
      </ReactFlow>
    </div>
  )
}
