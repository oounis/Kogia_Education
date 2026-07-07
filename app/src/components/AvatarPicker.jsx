import { Modal } from './ui.jsx'
import { AVATAR_POOL, avatarSrc, avatarBg } from '../people.js'
import { Check } from 'lucide-react'

// Reusable gallery to pick an illustration avatar.
export default function AvatarPicker({ open, current, onClose, onSelect, title='Choisir un avatar', name }){
  const groups=[...new Set(AVATAR_POOL.map(a=>a.group))]
  return (
    <Modal open={open} onClose={onClose} size="2xl"
      title={title + (name?` · ${name}`:'')}>
      <div className="space-y-4">
        {groups.map(g=>(
          <div key={g}>
            <div className="text-[11px] font-extrabold uppercase tracking-wide text-muted mb-2">{g}</div>
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
              {AVATAR_POOL.filter(a=>a.group===g).map(a=>{ const on=a.rel===current
                return (
                  <button key={a.key} onClick={()=>onSelect(a.rel)} title={a.key}
                    className="relative rounded-2xl overflow-hidden aspect-square grid place-items-center transition hover:-translate-y-0.5"
                    style={{background:avatarBg(a.key), boxShadow:on?'0 0 0 3px var(--accent)':'0 0 0 1px var(--color-line)'}}>
                    <img src={avatarSrc(a.rel)} alt="" className="w-full h-full object-contain p-0.5"/>
                    {on&&<span className="absolute top-1 right-1 w-5 h-5 rounded-full accent-bg grid place-items-center shadow"><Check size={12} className="text-white"/></span>}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )
}
