// v2 « Le Cachalot » : chaque portail = un accent + un dégradé (accent → accent2)
export const ROLE={
  owner:{label:'Plateforme',color:'#0D9488',color2:'#14B8A6',soft:'#DFF4F3'},   // compte Kogia Group (fournisseur SaaS)
  schooladmin:{label:'Direction',color:'#6366F1',color2:'#8B5CF6',soft:'#EEF2FF'},
  admin:{label:'Administration',color:'#36C5F0',color2:'#22D3EE',soft:'#E4F7FE'},
  teacher:{label:'Enseignant',color:'#2BD9A8',color2:'#34D399',soft:'#E2FBF3'},
  supervisor:{label:'Surveillant',color:'#FFA62B',color2:'#FBBF24',soft:'#FFF1DD'},
  security:{label:'Sécurité',color:'#475569',color2:'#0E7FB8',soft:'#EEF1F6'},   // agent de sécurité : portail, visiteurs, soirées
  parent:{label:'Parent',color:'#FF6B81',color2:'#FB7185',soft:'#FFE8EC'},
}
export function applyAccent(role){const r=ROLE[role]||ROLE.admin
  const st=document.documentElement.style
  st.setProperty('--accent',r.color); st.setProperty('--accent-2',r.color2||r.color); st.setProperty('--accent-soft',r.soft)}
