import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
export default function Register(){
  const [phone, setPhone] = useState(''), [pass, setPass] = useState('')
  const {setUser} = useAuth()
  const nav = useNavigate()
  const register = async ()=>{
    if(!phone ||!pass) return alert('Fill all')
    const {data, error} = await supabase.from('profiles').insert([{phone, password:pass, main_balance:0}]).select().single()
    if(error) return alert(error.message)
    setUser(data); nav('/')
  }
  return <div style={{minHeight:'100vh', background:'#000', color:'white', display:'flex', alignItems:'center', justifyContent:'center', padding:20}}>
    <div style={{background:'#111', padding:25, borderRadius:15, width:'100%', maxWidth:380}}>
      <h2>Create Account</h2><input placeholder="Phone 07xx" value={phone} onChange={e=>setPhone(e.target.value)} style={{width:'100%', padding:12, marginTop:10, background:'#222', color:'white', border:'1px solid #333', borderRadius:8}}/>
      <input type="password" placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)} style={{width:'100%', padding:12, marginTop:10, background:'#222', color:'white', border:'1px solid #333', borderRadius:8}}/>
      <button onClick={register} style={{width:'100%', padding:12, marginTop:15, background:'white', color:'black', border:'none', borderRadius:8, fontWeight:'bold'}}>Register</button>
      <p style={{marginTop:10, fontSize:13}}>Have account? <Link to="/login" style={{color:'#60a5fa'}}>Login</Link></p>
    </div>
  </div>
}