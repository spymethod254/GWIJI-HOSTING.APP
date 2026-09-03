import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { useState } from 'react'
import Navbar from './components/Navbar'
import CheckinPopup from './components/CheckinPopup'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import Tasks from './pages/Tasks'
import Dashboard from './pages/Dashboard'
import Hosting from './pages/Hosting'
import Checkin from './pages/Checkin'

function Protected({children}){ 
  const {user, loading} = useAuth(); 
  if(loading) return <div style={{padding:20, color:'white', background:'#000', minHeight:'100vh'}}>Loading...</div>; 
  if(!user) return <Navigate to="/login"/>; 
  return children 
}

function Layout(){
  const [show, setShow] = useState(false)
  return <>
    <Navbar show={show} setShow={setShow}/>
    <CheckinPopup/>
    <Routes>
      <Route path="/" element={<Protected><Dashboard/></Protected>}/>
      <Route path="/checkin" element={<Protected><Checkin/></Protected>}/>
      <Route path="/profile" element={<Protected><Profile/></Protected>}/>
      <Route path="/tasks" element={<Protected><Tasks/></Protected>}/>
      <Route path="/main" element={<Protected><Dashboard/></Protected>}/>
      <Route path="/all" element={<Protected><Dashboard/></Protected>}/>
      <Route path="/hosting" element={<Protected><Hosting/></Protected>}/>
      <Route path="/boosting" element={<Protected>
        <div style={{padding:14, maxWidth:420, margin:'0 auto', background:'#000', minHeight:'100vh', color:'white'}}>
          <h3>🚀 Social Boosting</h3>
          <div style={{background:'#111', border:'1px solid #222', padding:14, borderRadius:16, marginTop:10}}>
            <b>70 followers 200 KSH</b><br/><small style={{color:'#888'}}>Contact admin via WhatsApp</small><br/>
            <a href="https://wa.me/254789320869" style={{display:'block', marginTop:10, padding:12, background:'linear-gradient(90deg, #0f7f8a 0%, #6a3db5 100%)', color:'white', textAlign:'center', borderRadius:12, textDecoration:'none', fontWeight:'bold'}}>Order Now</a>
          </div>
        </div>
      </Protected>}/>
      <Route path="/gwijigram" element={<Protected><div style={{padding:20, background:'#000', minHeight:'100vh', textAlign:'center'}}><a href="https://gwijitech-linkup-gules.vercel.app" style={{color:'white', background:'linear-gradient(90deg, #0f7f8a 0%, #6a3db5 100%)', padding:'12px 20px', borderRadius:12, textDecoration:'none', fontWeight:'bold'}}>💜 Open GWIJIGRAM WEB</a></div></Protected>}/>
      <Route path="/whatsapp" element={<Protected><div style={{padding:20, background:'#000', minHeight:'100vh'}}><a href="https://wa.me/254789320869" style={{background:'#25D366', padding:14, color:'white', borderRadius:12, textDecoration:'none', display:'block', textAlign:'center', fontWeight:'bold'}}>💬 WhatsApp Support</a></div></Protected>}/>
      <Route path="/support" element={<Protected><div style={{padding:20, background:'#000', minHeight:'100vh', color:'white'}}>support@gwijigram.com<br/><small style={{color:'#888'}}>Mombasa, KE</small></div></Protected>}/>
    </Routes>
  </>
}

export default function App(){
  return <AuthProvider><BrowserRouter><Routes>
    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    <Route path="/*" element={<Layout/>}/>
  </Routes></BrowserRouter></AuthProvider>
}