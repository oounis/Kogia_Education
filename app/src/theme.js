export const PORTALS = {
  teacher:    { key:'teacher',    label:'Teacher',    color:'#16A34A', soft:'#E9F8EF', icon:'GraduationCap' },
  admin:      { key:'admin',      label:'Admin',      color:'#2563EB', soft:'#E8F0FE', icon:'LayoutDashboard' },
  owner:      { key:'owner',      label:'Owner',      color:'#7C3AED', soft:'#F1EAFE', icon:'LineChart' },
  parent:     { key:'parent',     label:'Parent',     color:'#EA580C', soft:'#FDEBE0', icon:'Heart' },
  superadmin: { key:'superadmin', label:'Platform',   color:'#0F766E', soft:'#E2F4F1', icon:'Building2' },
}
export function applyAccent(p){
  const el = document.documentElement
  el.style.setProperty('--accent', p.color)
  el.style.setProperty('--accent-soft', p.soft)
}
