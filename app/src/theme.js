export const ROLE={
  owner:{label:'Propriétaire',color:'#6C5CE7',soft:'#EEEBFF'},
  schooladmin:{label:'Direction',color:'#6C5CE7',soft:'#EEEBFF'},
  admin:{label:'Administration',color:'#36C5F0',soft:'#E4F7FE'},
  teacher:{label:'Enseignant',color:'#2BD9A8',soft:'#E2FBF3'},
  supervisor:{label:'Surveillant',color:'#FFA62B',soft:'#FFF1DD'},
  parent:{label:'Parent',color:'#FF6B81',soft:'#FFE8EC'},
}
export function applyAccent(role){const r=ROLE[role]||ROLE.admin;document.documentElement.style.setProperty('--accent',r.color);document.documentElement.style.setProperty('--accent-soft',r.soft)}
