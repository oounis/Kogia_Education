import { HashRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Teacher from './pages/Teacher.jsx'
import Admin from './pages/Admin.jsx'
import Owner from './pages/Owner.jsx'
import Parent from './pages/Parent.jsx'
export default function App(){
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/teacher" element={<Teacher/>} />
        <Route path="/admin" element={<Admin/>} />
        <Route path="/owner" element={<Owner/>} />
        <Route path="/parent" element={<Parent/>} />
      </Routes>
    </HashRouter>
  )
}
