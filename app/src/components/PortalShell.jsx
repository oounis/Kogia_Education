import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { applyAccent, PORTALS } from '../theme.js'
import { SCHOOL } from '../data.js'
import { LogOut } from 'lucide-react'

export default function PortalShell({ portal, title, subtitle, right, children }){
  const p = PORTALS[portal]
  useEffect(()=>{ applyAccent(p) },[p])
  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-20 bg-white border-b border-line">
        <div className="mx-auto w-[94vw] max-w-[1200px] flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl grid place-items-center text-white font-bold accent-bg">K</span>
            <div>
              <div className="font-semibold leading-tight">Coreon <span className="accent-text">Edu</span></div>
              <div className="text-[11px] text-muted leading-tight">{SCHOOL.name}</div>
            </div>
            <span className="ml-2 text-xs font-semibold px-2.5 py-1 rounded-full accent-soft accent-text">{p.label} portal</span>
          </div>
          <div className="flex items-center gap-3">
            {right}
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"><LogOut size={15}/> Switch role</Link>
          </div>
        </div>
      </header>
      <main className="mx-auto w-[94vw] max-w-[1200px] py-6">
        {(title||subtitle) && (
          <div className="mb-5">
            {title && <h1 className="text-2xl font-bold">{title}</h1>}
            {subtitle && <p className="text-muted mt-0.5">{subtitle}</p>}
          </div>
        )}
        {children}
      </main>
    </div>
  )
}
