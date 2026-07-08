import { Sun } from 'lucide-react'
import { Whale } from './ui.jsx'
import { schoolPhase } from '../livestatus.js'

export const isSummer = () => schoolPhase() === 'vacances'
export const RENTREE = 'lundi 15 septembre'

// Chip d'ambiance (topbar) — l'école est en vacances, tout le produit le sait.
export function SummerChip(){
  if(!isSummer()) return null
  return (
    <div className="hidden xl:flex items-center gap-2 pl-3 pr-3.5 py-1.5 rounded-2xl select-none"
      style={{background:'linear-gradient(135deg,#FEF3C7,#FDE68A)'}} title={`Vacances d'été — reprise le ${RENTREE}`}>
      <Sun size={16} style={{color:'#B45309'}}/>
      <div className="leading-none">
        <div className="text-xs font-extrabold" style={{color:'#92400E'}}>Vacances d'été</div>
        <div className="text-[10px] font-semibold" style={{color:'#B45309'}}>reprise le 15 sept.</div>
      </div>
    </div>
  )
}

// Gel estival d'une fonctionnalité : même honnêteté que le Suivi en direct.
export function SummerFreeze({ feature, detail, children }){
  return (
    <div className="card p-8 text-center relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full" style={{background:'radial-gradient(circle,#FDE68A66,transparent 70%)'}}/>
      <div className="floaty mx-auto w-fit"><Whale size={52} from="#F59E0B" to="#FB7185"/></div>
      <div className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full mt-2" style={{background:'#FEF3C7',color:'#92400E'}}>
        <Sun size={12}/> VACANCES D'ÉTÉ</div>
      <h2 className="text-xl font-extrabold mt-2">{feature} reprend à la rentrée</h2>
      <p className="text-sm text-muted mt-1 max-w-md mx-auto">{detail} Rendez-vous le <b>{RENTREE}</b> — d'ici là, profitez de l'été !</p>
      {children && <div className="mt-4 flex justify-center gap-2 flex-wrap">{children}</div>}
    </div>
  )
}
