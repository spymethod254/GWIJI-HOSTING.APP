// src/pages/Profile.jsx
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'

export default function Profile(){
  const {user, setUser} = useAuth()
  const [edit, setEdit] = useState(false)
  const [name, setName] = useState(user?.full_name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [saving, setSaving] = useState(false)

  const save = async ()=>{
    setSaving(true)
    const {data, error} = await supabase.from('profiles').update({ full_name:name, email, phone }).eq('id', user.id).select().single()
    setSaving(false)
    if(error) return alert(error.message)
    setUser(data); setEdit(false); alert('✅ Updated!')
  }

  const logout = async ()=>{
    localStorage.clear(); setUser(null)
    window.location.href='/login'
  }

  const inputStyle={width:'100%', padding:12, background:'#1c1c1c', color:'white', border:'1px solid #333', borderRadius:10, boxSizing:'border-box', outline:'none'}

  return <div style={{minHeight:'100vh', background:'#000', color:'white', padding:16, boxSizing:'border-box'}}>
    <div style={{maxWidth:400, margin:'0 auto'}}>

      {/* Header */}
      <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:20}}>
        <Link to="/" style={{color:'white', textDecoration:'none', fontSize:20}}>←</Link>
        <h2 style={{margin:0}}>My Profile</h2>
      </div>

      {/* Avatar Card */}
      <div style={{background:'#111', border:'1px solid #222', borderRadius:20, padding:20, textAlign:'center', boxSizing:'border-box'}}>
        <div style={{width:80, height:80, borderRadius:20, background:'linear-gradient(90deg, #0f7f8a 0%, #6a3db5 100%)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, fontWeight:'bold', margin:'0 auto 12px'}}>
          {(user?.full_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
        </div>
        <h3 style={{margin:'0 0 4px'}}>{user?.full_name || 'Gwiji User'}</h3>
        <p style={{margin:0, color:'#888', fontSize:13}}>{user?.email} • {user?.phone}</p>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:16}}>
          <div style={{background:'#1a1a1a', padding:12, borderRadius:12}}>
            <div style={{fontSize:11, color:'#888'}}>Main Balance</div>
            <div style={{fontWeight:'bold', color:'#0f7f8a'}}>{user?.main_balance||0} KSH</div>
          </div>
          <div style={{background:'#1a1a1a', padding:12, borderRadius:12}}>
            <div style={{fontSize:11, color:'#888'}}>Check-in Streak</div>
            <div style={{fontWeight:'bold'}}>{localStorage.getItem('streak')||1} Days 🔥</div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div style={{background:'#111', border:'1px solid #222', borderRadius:20, padding:16, marginTop:14, boxSizing:'border-box'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
          <h4 style={{margin:0}}>Personal Info</h4>
          <button onClick={()=>setEdit(!edit)} style={{background: edit? '#333' : 'linear-gradient(90deg, #0f7f8a 0%, #6a3db5 100%)', color:'white', border:'none', padding:'6px 12px', borderRadius:8, fontSize:12, fontWeight:'bold'}}>{edit? 'Cancel' : 'Edit'}</button>
        </div>

        {edit? (
          <div style={{display:'flex', flexDirection:'column', gap:10}}>
            <div><small style={{color:'#888'}}>Full Name</small><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" style={inputStyle}/></div>
            <div><small style={{color:'#888'}}>Email</small><input value={email} onChange={e=>setEmail(e.target.value)} style={inputStyle}/></div>
            <div><small style={{color:'#888'}}>Phone</small><input value={phone} onChange={e=>setPhone(e.target.value)} style={inputStyle}/></div>
            <button onClick={save} disabled={saving} style={{width:'100%', padding:12, background:'linear-gradient(90deg, #0f7f8a 0%, #6a3db5 100%)', color:'white', border:'none', borderRadius:12, fontWeight:'bold'}}>{saving? 'Saving...' : 'Save Changes'}</button>
          </div>
        ) : (
          <div style={{display:'flex', flexDirection:'column', gap:10, fontSize:14}}>
            <div style={{display:'flex', justifyContent:'space-between', background:'#1a1a1a', padding:12, borderRadius:10}}><span style={{color:'#888'}}>👤 Name</span><span>{user?.full_name || 'Not set'}</span></div>
            <div style={{display:'flex', justifyContent:'space-between', background:'#1a1a1a', padding:12, borderRadius:10}}><span style={{color:'#888'}}>📧 Email</span><span style={{fontSize:12}}>{user?.email}</span></div>
            <div style={{display:'flex', justifyContent:'space-between', background:'#1a1a1a', padding:12, borderRadius:10}}><span style={{color:'#888'}}>📱 Phone</span><span>{user?.phone}</span></div>
            <div style={{display:'flex', justifyContent:'space-between', background:'#1a1a1a', padding:12, borderRadius:10}}><span style={{color:'#888'}}>🆔 User ID</span><span style={{fontSize:10, opacity:0.6}}>{user?.id?.slice(0,8)}...</span></div>
          </div>
        )}
      </div>

      {/* More Options */}
      <div style={{background:'#111', border:'1px solid #222', borderRadius:20, padding:10, marginTop:14}}>
        {[
          {icon:'💳', label:'My Wallets', to:'/wallets'},
          {icon:'📜', label:'Transaction History', to:'/history'},
          {icon:'🔒', label:'Change Password', to:'/change-password'},
          {icon:'📞', label:'Support', to:'/support'},
        ].map(item=>(
          <Link key={item.label} to={item.to} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:12, color:'white', textDecoration:'none', borderRadius:10}}>
            <span>{item.icon} {item.label}</span><span style={{color:'#555'}}>›</span>
          </Link>
        ))}
      </div>

      <button onClick={logout} style={{width:'100%', marginTop:14, padding:13, background:'#1a1a1a', color:'#ff5a5a', border:'1px solid #331111', borderRadius:12, fontWeight:'bold'}}>Logout</button>

      <p style={{textAlign:'center', color:'#444', fontSize:10, marginTop:12}}>GWIJIGRAM v2.0 • Mombasa KE</p>
    </div>
  </div>
}