import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { useState } from 'react'
import Navbar from './components/Navbar'
import CheckinPopup from './components/CheckinPopup'
import Login from './pages/Login'
import Register from './pages/Register'
import Tasks from './pages/Tasks'
import { supabase } from './lib/supabase'
import { useEffect } from 'react'

function Dashboard(){
  const {user} = useAuth()
  const [bal, setBal] = useState(0)
  useEffect(()=>{ supabase.from('task_submissions').select('*').eq('user_id', user.id).eq('status','approved').then(({data})=>setBal(data?.reduce((a,b)=>a+b.earned,0)||0)) },[])
  return <div style={{padding:15, maxWidth:600, margin:'auto'}}><h2>Dashboard</h2><div style={{background:'#1a1a1a', padding:15, borderRadius:12}}><p>Main Balance</p><h1>{bal} KSH</h1><small>{user.phone}</small></div></div>
}
function Protected({children}){ const {user, loading} = useAuth(); if(loading) return <p>Loading...</p>; if(!user) return <Navigate to="/login"/>; return children }

function Layout(){
  const [show, setShow] = useState(false)
  return <><Navbar show={show} setShow={setShow}/><CheckinPopup/><Routes>
    <Route path="/" element={<Protected><Dashboard/></Protected>}/>
    <Route path="/tasks" element={<Protected><Tasks/></Protected>}/>
    <Route path="/main" element={<Protected><Dashboard/></Protected>}/>
    <Route path="/all" element={<Protected><Dashboard/></Protected>}/>
    <Route path="/hosting" element={<Protected><div style={{padding:15}}>Buy Domains Coming Soon - Hosting works via?site=xxx</div></Protected>}/>
    <Route path="/boosting" element={<Protected><div style={{padding:15}}>Social Boosting - 100 followers 200 KSH</div></Protected>}/>
    <Route path="/gwijigram" element={<Protected><div style={{padding:15}}><a href="https://gwijigram.com" style={{color:'#60a5fa'}}>Open GWIJIGRAM</a></div></Protected>}/>
    <Route path="/whatsapp" element={<Protected><div style={{padding:15}}><a href="https://wa.me/254700000000" style={{background:'#25D366', padding:12, color:'white', borderRadius:8, textDecoration:'none', display:'block', textAlign:'center'}}>WhatsApp Support</a></div></Protected>}/>
    <Route path="/support" element={<Protected><div style={{padding:15}}>support@gwijigram.com</div></Protected>}/>
  </Routes></>
}

export default function App(){
  return <AuthProvider><BrowserRouter><Routes>
    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    <Route path="/*" element={<Layout/>}/>
  </Routes></BrowserRouter></AuthProvider>
}