// Role / person illustrations (public/people) used as avatars for staff & teachers.
export const people = n => `${import.meta.env.BASE_URL}people/${n}.png`
export function teacherAvatar(t){
  if((t.subject||'').toLowerCase().includes('sport')) return people('teacher-sport')
  return people(t.gender==='Fille' ? 'teacher-f' : 'teacher-m')
}
export function roleAvatar(role, gender){
  const map = { owner:'director', schooladmin:'director', admin:'admin', supervisor:'supervisor',
    teacher: gender==='Fille'?'teacher-f':'teacher-m', parent:'nursery' }
  return people(map[role] || 'admin')
}
