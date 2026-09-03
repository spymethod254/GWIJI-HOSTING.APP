import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register(){
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const {setUser} = useAuth()
  const nav = useNavigate()

  const register = async ()=>{
    if(!phone || !email || !pass) return alert('Fill all fields')
    setLoading(true)
    const {data, error} = await supabase.from('profiles').insert([{phone, email, password:pass, main_balance:0}]).select().single()
    setLoading(false)
    if(error) return alert(error.message)
    setUser(data); nav('/')
  }

  const googleLogin = async ()=>{
    const {error} = await supabase.auth.signInWithOAuth({ provider: 'google', options:{ redirectTo: window.location.origin } })
    if(error) alert(error.message)
  }

  return <div style={{minHeight:'100vh', background:'#000', color:'white', display:'flex', alignItems:'center', justifyContent:'center', padding:20}}>
    <div style={{background:'#111', padding:25, borderRadius:15, width:'100%', maxWidth:380}}>
      <h2 style={{textAlign:'center'}}>Create Account</h2>
      
      <input placeholder="Full Name (optional)" style={{width:'100%', padding:12, marginTop:15, background:'#222', color:'white', border:'1px solid #333', borderRadius:8}}/>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} type="email" style={{width:'100%', padding:12, marginTop:10, background:'#222', color:'white', border:'1px solid #333', borderRadius:8}}/>
      <input placeholder="Phone 07xx" value={phone} onChange={e=>setPhone(e.target.value)} style={{width:'100%', padding:12, marginTop:10, background:'#222', color:'white', border:'1px solid #333', borderRadius:8}}/>
      
      <div style={{position:'relative', marginTop:10}}>
        <input type={show ? 'text' : 'password'} placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)} style={{width:'100%', padding:'12px 40px 12px 12px', background:'#222', color:'white', border:'1px solid #333', borderRadius:8}}/>
        <button type="button" onClick={()=>setShow(!show)} style={{position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', fontSize:18}}>{show ? '🙈' : '👁️'}</button>
      </div>

      <button onClick={register} disabled={loading} style={{width:'100%', padding:12, marginTop:15, background:'white', color:'black', border:'none', borderRadius:8, fontWeight:'bold'}}>{loading?'Creating...':'Register'}</button>

      <div style={{display:'flex', alignItems:'center', gap:10, margin:'15px 0'}}><div style={{flex:1, height:1, background:'#333'}}/><small style={{opacity:0.6}}>OR</small><div style={{flex:1, height:1, background:'#333'}}/></div>

      <button onClick={googleLogin} style={{width:'100%', padding:12, background:'#222', color:'white', border:'1px solid #444', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', gap:8}}>🔵 Continue with Google</button>

      <p style={{marginTop:15, fontSize:13, textAlign:'center'}}>Have account? <Link to="/login" style={{color:'#60a5fa'}}>Login</Link></p>
    </div>
  </div>
}