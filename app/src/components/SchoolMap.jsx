import { motion } from 'framer-motion'

// viewBox space
export const VB={w:800,h:520}
// avatar waypoints (feet position) on the school grounds
export const SPOTS={
  class:      {x:175,y:250},   // in front of the school
  cour:       {x:400,y:300},   // playground
  cantine:    {x:600,y:430},   // canteen
  infirmerie: {x:650,y:250},   // infirmary
  entree:     {x:395,y:485},   // main gate
}

// ── a cute cartoon building ──
function House({x,y,w,h,wall='#FBF3E4',roof='#E1584C',door='#9A6B45',accent}){
  const rh=h*0.5
  return (<g>
    <ellipse cx={x+w/2} cy={y+h+4} rx={w*0.52} ry={7} fill="#1E2433" opacity=".08"/>
    <rect x={x} y={y+rh*0.72} width={w} height={h-rh*0.72} rx="7" fill={wall}/>
    <path d={`M ${x-9} ${y+rh} L ${x+w/2} ${y} L ${x+w+9} ${y+rh} Z`} fill={roof}/>
    <path d={`M ${x-9} ${y+rh} L ${x+w+9} ${y+rh} L ${x+w+9} ${y+rh+7} L ${x-9} ${y+rh+7} Z`} fill="#00000018"/>
    {/* windows */}
    {[0,1].map(i=>(<g key={i}>
      <rect x={x+w*(0.16+i*0.5)} y={y+rh*0.95} width={w*0.2} height={h*0.22} rx="3" fill="#BFE6F7" stroke="#fff" strokeWidth="2"/>
      <line x1={x+w*(0.26+i*0.5)} y1={y+rh*0.95} x2={x+w*(0.26+i*0.5)} y2={y+rh*0.95+h*0.22} stroke="#fff" strokeWidth="1.5"/>
    </g>))}
    {/* door */}
    <rect x={x+w*0.4} y={y+h-h*0.34} width={w*0.2} height={h*0.34} rx="4" fill={door}/>
    <circle cx={x+w*0.55} cy={y+h-h*0.17} r="1.8" fill="#FFE08A"/>
    {accent}
  </g>)
}
function Tree({x,y,s=1}){return(<g transform={`translate(${x} ${y}) scale(${s})`}>
  <ellipse cx="0" cy="36" rx="20" ry="6" fill="#1E2433" opacity=".08"/>
  <rect x="-5" y="8" width="10" height="30" rx="4" fill="#9A6B45"/>
  <circle cx="0" cy="-2" r="22" fill="#5FA83C"/><circle cx="-16" cy="8" r="15" fill="#6FBB4A"/><circle cx="16" cy="8" r="15" fill="#6FBB4A"/><circle cx="0" cy="12" r="17" fill="#68B143"/>
</g>)}
function Bush({x,y}){return(<g transform={`translate(${x} ${y})`}><circle cx="-9" cy="0" r="10" fill="#6FBB4A"/><circle cx="6" cy="-3" r="12" fill="#5FA83C"/><circle cx="16" cy="2" r="9" fill="#6FBB4A"/></g>)}
function Flower({x,y,c}){return(<g transform={`translate(${x} ${y})`}>{[0,72,144,216,288].map(a=><circle key={a} cx={Math.cos(a*Math.PI/180)*4} cy={Math.sin(a*Math.PI/180)*4} r="3" fill={c}/>)}<circle cx="0" cy="0" r="2.4" fill="#FFD54A"/></g>)}
function Pond({x,y,w,h}){return(<g><ellipse cx={x} cy={y} rx={w} ry={h} fill="#7EC8E3"/><ellipse cx={x} cy={y} rx={w*0.82} ry={h*0.78} fill="#9AD7ED"/><path d={`M ${x-w*0.4} ${y-h*0.2} q 10 -6 20 0`} stroke="#fff" strokeWidth="2" fill="none" opacity=".7"/></g>)}

const ROAD="M 395 500 C 395 450 300 452 300 405 C 300 358 415 356 415 312 C 415 262 250 268 205 252 C 150 232 205 188 300 200 C 430 216 470 250 560 256 C 660 262 690 300 672 350 C 656 396 640 420 606 432"

export default function SchoolMap({ area, spot, kid, title, Kid }){
  const px=(spot.x/VB.w)*100, py=(spot.y/VB.h)*100
  return (
    <div className="relative w-full" style={{aspectRatio:`${VB.w}/${VB.h}`}}>
      <svg viewBox={`0 0 ${VB.w} ${VB.h}`} width="100%" height="100%" className="absolute inset-0 block">
        <defs>
          <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#93D64E"/><stop offset="1" stopColor="#7FC53F"/></linearGradient>
        </defs>
        {/* grass */}
        <rect x="0" y="0" width={VB.w} height={VB.h} rx="20" fill="url(#grass)"/>
        {[[120,90,60],[640,120,70],[520,470,80],[90,430,55],[720,420,45]].map(([cx,cy,r],i)=><ellipse key={i} cx={cx} cy={cy} rx={r} ry={r*0.6} fill="#88CE46" opacity=".7"/>)}
        {/* ponds */}
        <Pond x={690} y={150} w={78} h={50}/>
        <Pond x={130} y={470} w={80} h={44}/>
        {/* road */}
        <path d={ROAD} fill="none" stroke="#A9AFB8" strokeWidth="34" strokeLinecap="round" strokeLinejoin="round"/>
        <path d={ROAD} fill="none" stroke="#C3C8CF" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round"/>
        <path d={ROAD} fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="3 16" strokeLinecap="round"/>

        {/* SCHOOL (classroom) */}
        <House x={40} y={40} w={230} h={150} wall="#FCEFD6" roof="#C0413A"
          accent={<g><rect x={130} y={18} width={22} height={30} fill="#FCEFD6"/><path d="M119 22 L141 4 L163 22 Z" fill="#C0413A"/><rect x={70} y={95} width={150} height={20} rx="10" fill="#fff" opacity=".85"/><text x={145} y={110} textAnchor="middle" fontSize="13" fontWeight="800" fill="#C0413A">ÉCOLE</text></g>}/>
        {/* school bus */}
        <g transform="translate(40 205)"><rect x="0" y="0" width="70" height="30" rx="6" fill="#FFC02E"/><rect x="8" y="6" width="14" height="10" rx="2" fill="#CDEBFB"/><rect x="26" y="6" width="14" height="10" rx="2" fill="#CDEBFB"/><rect x="44" y="6" width="14" height="10" rx="2" fill="#CDEBFB"/><circle cx="16" cy="31" r="6" fill="#333"/><circle cx="54" cy="31" r="6" fill="#333"/></g>

        {/* BIBLIOTHÈQUE */}
        <House x={560} y={30} w={190} h={120} wall="#E6DcF8" roof="#7C5CE0" accent={<text x={655} y={92} textAnchor="middle" fontSize="20">📚</text>}/>
        {/* INFIRMERIE */}
        <House x={585} y={175} w={165} h={120} wall="#FFFFFF" roof="#FF6B81" accent={<g><rect x={655} y={192} width="18" height="6" fill="#fff"/><rect x={661} y={186} width="6" height="18" fill="#fff"/></g>}/>
        {/* CANTINE */}
        <House x={520} y={360} w={200} h={125} wall="#FDEFD6" roof="#F39A22" accent={<text x={620} y={415} textAnchor="middle" fontSize="20">🍽️</text>}/>
        {/* DIRECTION */}
        <House x={30} y={300} w={155} h={110} wall="#E4F6FE" roof="#36A6D0" accent={<text x={107} y={352} textAnchor="middle" fontSize="18">🏛️</text>}/>
        {/* WC */}
        <House x={40} y={430} w={80} h={72} wall="#EEF1F6" roof="#94A3B8" accent={<text x={80} y={470} textAnchor="middle" fontSize="14">🚻</text>}/>

        {/* COUR / playground */}
        <ellipse cx={385} cy={300} rx={110} ry={72} fill="#B9E88C" opacity=".9"/>
        <text x={385} y={252} textAnchor="middle" fontSize="11" fontWeight="800" fill="#3F7A22">COUR DE RÉCRÉATION</text>
        <Tree x={330} y={300} s={0.9}/>
        <g transform="translate(430 300)"><rect x="-4" y="-2" width="8" height="26" fill="#8F9BB3"/><path d="M4 -2 q26 6 26 30" stroke="#F39A22" strokeWidth="8" fill="none" strokeLinecap="round"/></g>{/* slide */}
        <g transform="translate(392 330)"><ellipse cx="0" cy="0" rx="16" ry="6" fill="#6C5CE7"/></g>{/* trampoline */}

        {/* entrance gate */}
        <g transform="translate(360 470)"><rect x="0" y="0" width="70" height="10" rx="4" fill="#9A6B45"/><rect x="2" y="8" width="8" height="26" fill="#9A6B45"/><rect x="60" y="8" width="8" height="26" fill="#9A6B45"/><text x="35" y="52" textAnchor="middle" fontSize="10" fontWeight="700" fill="#5b6b4a">ENTRÉE</text></g>

        {/* deco */}
        <Tree x={470} y={110} s={0.85}/><Tree x={250} y={430} s={1}/><Tree x={700} y={330} s={0.8}/><Tree x={150} y={210} s={0.7}/>
        <Bush x={300} y={150}/><Bush x={520} y={200}/><Bush x={430} y={430}/>
        {[[210,120,'#FF6B81'],[560,320,'#FFC02E'],[480,380,'#7C5CE0'],[200,360,'#FF6B81'],[640,470,'#FFC02E']].map(([x,y,c],i)=><Flower key={i} x={x} y={y} c={c}/>)}
        {/* flag on the school */}
        <g transform="translate(153 34)"><rect x="0" y="-18" width="3" height="32" fill="#7A5A3A"/><path d="M3 -18 L24 -11 L3 -4 Z" fill="#22C55E"/></g>
        {/* benches */}
        {[[300,362],[470,362]].map(([x,y],i)=><g key={i} transform={`translate(${x} ${y})`}><rect x="-15" y="0" width="30" height="5" rx="2" fill="#C08A4C"/><rect x="-13" y="5" width="3" height="7" fill="#8C6B45"/><rect x="10" y="5" width="3" height="7" fill="#8C6B45"/></g>)}
        {/* lamp posts */}
        {[[212,238],[556,338],[430,150]].map(([x,y],i)=><g key={i} transform={`translate(${x} ${y})`}><rect x="-1.5" y="0" width="3" height="22" fill="#8F9BB3"/><circle cx="0" cy="-2" r="5" fill="#FFE08A"/><circle cx="0" cy="-2" r="8" fill="#FFE08A" opacity=".25"/></g>)}
      </svg>

      {/* the walking child (HTML overlay, positioned in % of the same box) */}
      <motion.div className="absolute z-20" style={{left:0,top:0,translateX:'-50%',translateY:'-100%'}}
        animate={{left:`${px}%`,top:`${py}%`}} transition={{type:'spring',stiffness:44,damping:14}}>
        <motion.div animate={{y:[0,-3,0]}} transition={{repeat:Infinity,duration:.62}} className="relative flex flex-col items-center">
          {Kid}
          <motion.span className="absolute -bottom-1 rounded-full" style={{width:26,height:8,background:area.color,opacity:.3}} animate={{scale:[1,1.5,1],opacity:[.3,.08,.3]}} transition={{repeat:Infinity,duration:1.7}}/>
          <div className="mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow-md whitespace-nowrap" style={{background:area.color}}>{kid.name.split(' ')[0]} · {title}</div>
        </motion.div>
      </motion.div>
    </div>
  )
}
