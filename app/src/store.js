// evaluations persisted in localStorage (mock backend)
const KEY="coreon_evaluations"
export function loadEvals(){ try { return JSON.parse(localStorage.getItem(KEY)||"[]") } catch { return [] } }
export function saveEval(ev){
  const all=loadEvals(); all.unshift(ev); localStorage.setItem(KEY, JSON.stringify(all)); return ev
}
export function clearEvals(){ localStorage.removeItem(KEY) }
