import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PORTALS } from '../theme.js'
import { GraduationCap, LayoutDashboard, LineChart, Heart, Building2, Zap, ArrowRight } from 'lucide-react'
const ICON = { GraduationCap, LayoutDashboard, LineChart, Heart, Building2 }
const ROLES = ['teacher','admin','owner','parent']

export default function Login(){
  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto w-[94vw] max-w-[1000px] py-12">
        <div className="flex items-center gap-3 mb-10">
          <span className="w-11 h-11 rounded-2xl grid place-items-center text-white font-bold text-lg" style={{background:'#16A34A'}}>K</span>
          <div>
            <div className="text-xl font-bold">Coreon <span style={{color:'#16A34A'}}>Edu</span></div>
            <div className="text-xs text-muted">by Kogia Group</div>
          </div>
        </div>

        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.5}}>
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full mb-4" style={{background:'#E9F8EF',color:'#16A34A'}}>
            <Zap size={13}/> Quick classroom evaluation
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight max-w-[18ch]">Evaluate the whole class in <span style={{color:'#16A34A'}}>seconds</span>.</h1>
          <p className="text-lg text-muted mt-4 max-w-[60ch]">Teachers open the portal and their current class is already there. Drag each student onto an answer — done. Performance is shared instantly with admins and parents.</p>
        </motion.div>

        <div className="mt-10 grid sm:grid-cols-2 gap-4">
          {ROLES.map((k,i)=>{
            const p=PORTALS[k]; const Icon=ICON[p.icon]
            return (
              <motion.div key={k} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.1+i*.07}}>
                <Link to={`/${k}`} className="group flex items-center gap-4 bg-white rounded-2xl border border-line p-5 hover:shadow-lg hover:-translate-y-0.5 transition"
                      style={{['--accent']:p.color,['--accent-soft']:p.soft}}>
                  <span className="w-12 h-12 rounded-xl grid place-items-center text-white shrink-0" style={{background:p.color}}><Icon size={22}/></span>
                  <div className="flex-1">
                    <div className="font-semibold">{p.label}</div>
                    <div className="text-sm text-muted">Open the {p.label.toLowerCase()} portal</div>
                  </div>
                  <ArrowRight size={18} className="text-muted group-hover:translate-x-1 transition" style={{color:p.color}}/>
                </Link>
              </motion.div>
            )
          })}
        </div>
        <p className="text-center text-xs text-muted mt-10">Demo build · pick any role to explore · each portal = white + one colour</p>
      </div>
    </div>
  )
}
