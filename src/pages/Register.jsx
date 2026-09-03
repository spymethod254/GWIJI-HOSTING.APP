import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
const GoogleLogo = () => <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>

export default function Register(){
  const [phone,setPhone]=useState(''); const [email,setEmail]=useState(''); const [pass,setPass]=useState(''); const [show,setShow]=useState(false); const [loading,setLoading]=useState(false)
  const {setUser}=useAuth(); const nav=useNavigate()
  const register=async()=>{ if(!phone||!email||!pass) return alert('Fill all'); setLoading(true); const {data,error}=await supabase.from('profiles').insert([{phone,email,password:pass,main_balance:0}]).select().single(); setLoading(false); if(error) return alert(error.message); setUser(data); nav('/') }
  const googleLogin=async()=>{ const {error}=await supabase.auth.signInWithOAuth({provider:'google', options:{redirectTo:window.location.origin}}); if(error) alert(error.message) }
  const inputStyle={width:'100%', padding:13, background:'#222', color:'white', border:'1px solid #333', borderRadius:12, boxSizing:'border-box', outline:'none'}
  const cyanBtn={width:'100%', padding:13, background:'linear-gradient(90deg, #0f7f8a 0%, #6a3db5 100%)', color:'white', border:'none', borderRadius:12, fontWeight:'bold', boxSizing:'border-box'}
  return <div style={{minHeight:'100vh', background:'#000', color:'white', display:'flex', alignItems:'center', justifyContent:'center', padding:16, boxSizing:'border-box'}}>
    <div style={{background:'#111', padding:20, borderRadius:16, width:'100%', maxWidth:340, boxSizing:'border-box', overflow:'hidden', border:'1px solid #222'}}>
      <h2 style={{textAlign:'center', margin:'0 0 16px'}}>Create Account</h2>
      <div style={{display:'flex', flexDirection:'column', gap:10}}>
        <input placeholder="Full Name (optional)" style={inputStyle}/>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={inputStyle}/>
        <input placeholder="Phone 07xx" value={phone} onChange={e=>setPhone(e.target.value)} style={inputStyle}/>
        <div style={{position:'relative', width:'100%'}}><input type={show?'text':'password'} placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)} style={{...inputStyle, paddingRight:42}}/><span onClick={()=>setShow(!show)} style={{position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', cursor:'pointer'}}>{show?'🙈':'👁️'}</span></div>
        <button onClick={register} disabled={loading} style={cyanBtn}>{loading?'Creating...':'Register'}</button>
        <div style={{display:'flex', alignItems:'center', gap:10, margin:'4px 0'}}><div style={{flex:1, height:1, background:'#333'}}/><small style={{opacity:0.6}}>OR</small><div style={{flex:1, height:1, background:'#333'}}/></div>
        <button onClick={googleLogin} style={{width:'100%', padding:12, background:'#1c1c1c', color:'white', border:'1px solid #333', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxSizing:'border-box'}}><GoogleLogo/> Continue with Google</button>
        <p style={{fontSize:13, textAlign:'center', margin:'6px 0 0'}}>Have account? <Link to="/login" style={{color:'#60a5fa'}}>Login</Link></p>
      </div>
    </div>
  </div>
}