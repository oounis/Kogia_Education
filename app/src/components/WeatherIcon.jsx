// Self-drawn SVG weather icons (no image files). mode -> cute coloured glyph.
function Sun({cx=32,cy=30,r=13}){
  return (<g>
    {Array.from({length:8}).map((_,i)=>{const a=i*45*Math.PI/180;const x1=cx+Math.cos(a)*(r+5),y1=cy+Math.sin(a)*(r+5),x2=cx+Math.cos(a)*(r+11),y2=cy+Math.sin(a)*(r+11);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FBBF24" strokeWidth="3.4" strokeLinecap="round"/>})}
    <circle cx={cx} cy={cy} r={r} fill="url(#sunG)"/>
  </g>)
}
function Cloud({x=32,y=38,s=1,fill='url(#cloudG)'}){
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx="-9" cy="2" rx="11" ry="10" fill={fill}/><ellipse cx="7" cy="0" rx="13" ry="12" fill={fill}/>
    <ellipse cx="-1" cy="-6" rx="10" ry="9" fill={fill}/><rect x="-20" y="2" width="40" height="10" rx="6" fill={fill}/>
  </g>)
}
const Drop=({x,y,c='#3B82F6'})=><path d={`M ${x} ${y} q 3 4 0 7 a 2.6 2.6 0 0 1 0 -7 z`} fill={c}/>
const Flake=({x,y})=><g stroke="#93C5FD" strokeWidth="2" strokeLinecap="round"><line x1={x-3} y1={y} x2={x+3} y2={y}/><line x1={x} y1={y-3} x2={x} y2={y+3}/><line x1={x-2} y1={y-2} x2={x+2} y2={y+2}/><line x1={x-2} y1={y+2} x2={x+2} y2={y-2}/></g>

export default function WeatherIcon({ mode='clear', size=40 }){
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} style={{overflow:'visible',filter:'drop-shadow(0 2px 3px rgba(0,0,0,.14))'}}>
      <defs>
        <radialGradient id="sunG" cx="40%" cy="35%"><stop offset="0" stopColor="#FDE68A"/><stop offset="1" stopColor="#F59E0B"/></radialGradient>
        <linearGradient id="cloudG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF"/><stop offset="1" stopColor="#DCE3EC"/></linearGradient>
        <linearGradient id="darkG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9AA3B2"/><stop offset="1" stopColor="#6B7280"/></linearGradient>
      </defs>
      {mode==='clear' && <Sun/>}
      {mode==='partly' && <><Sun cx={24} cy={24} r={10}/><Cloud x={38} y={40} s={1}/></>}
      {mode==='cloudy' && <Cloud x={32} y={34} s={1.1}/>}
      {mode==='overcast' && <><Cloud x={24} y={30} s={0.9} fill="url(#darkG)"/><Cloud x={38} y={38} s={1.05}/></>}
      {mode==='rain' && <><Cloud x={32} y={30} s={1.05}/>{[[22,44],[32,46],[42,44]].map(([x,y],i)=><Drop key={i} x={x} y={y}/>)}</>}
      {mode==='drizzle' && <><Cloud x={32} y={30} s={1.05}/>{[[26,44],[38,44]].map(([x,y],i)=><Drop key={i} x={x} y={y} c="#60A5FA"/>)}</>}
      {mode==='sleet' && <><Cloud x={32} y={28} s={1.05}/><Drop x={24} y={44}/><Flake x={40} y={47}/></>}
      {mode==='snow' && <><Cloud x={32} y={28} s={1.05}/>{[[24,46],[32,50],[40,46]].map(([x,y],i)=><Flake key={i} x={x} y={y}/>)}</>}
      {mode==='thunder' && <><Cloud x={32} y={28} s={1.05} fill="url(#darkG)"/><path d="M32 40 L26 52 L31 52 L27 60 L40 48 L34 48 L38 40 Z" fill="#FBBF24"/></>}
      {mode==='fog' && <><Cloud x={32} y={26} s={1}/>{[40,46,52].map((y,i)=><line key={i} x1={16+i*2} y1={y} x2={48-i*2} y2={y} stroke="#B6BECB" strokeWidth="3.4" strokeLinecap="round"/>)}</>}
    </svg>
  )
}
