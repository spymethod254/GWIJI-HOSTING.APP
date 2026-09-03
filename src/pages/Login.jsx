import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
export default function Login(){
  const [phone, setPhone] = useState(''), [pass, setPass] = useState('')
  const {setUser} = useAuth()
  const nav = useNavigate()
  const login = async ()=>{
    const {data} = await supabase.from('profiles').select('*').eq('phone', phone).single()
    if(!data || data.password!==pass) return alert('Wrong phone or password')
    setUser(data); nav('/')
  }
  return <div style={{minHeight:'100vh', background:'#000', color:'white', display:'flex', alignItems:'center', justifyContent:'center', padding:20}}>
    <div style={{background:'#111', padding:25, borderRadius:15, width:'100%', maxWidth:380}}>
      <h2>Welcome Back</h2><input placeholder="Phone 07xx" value={phone} onChange={e=>setPhone(e.target.value)} style={{width:'100%', padding:12, marginTop:10, background:'#222', color:'white', border:'1px solid #333', borderRadius:8}}/>
      <input type="password" placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)} style={{width:'100%', padding:12, marginTop:10, background:'#222', color:'white', border:'1px solid #333', borderRadius:8}}/>
      <button onClick={login} style={{width:'100%', padding:12, marginTop:15, background:'white', color:'black', border:'none', borderRadius:8, fontWeight:'bold'}}>Login</button>
      <p style={{marginTop:10, fontSize:13}}>No account? <Link to="/register" style={{color:'#60a5fa'}}>Register</Link></p>
    </div>
  </div>
}