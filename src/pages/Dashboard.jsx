// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function Dashboard(){
  const {user} = useAuth()
  const [bal, setBal] = useState(0)
  const [totalTasks, setTotalTasks] = useState(0)

  useEffect(()=>{
    supabase.from('task_submissions').select('earned').eq('user_id', user.id).eq('status','approved').then(({data})=>{
      setBal(data?.reduce((a,b)=>a+b.earned,0)||0)
    })
    supabase.from('task_submissions').select('*', {count:'exact'}).eq('user_id', user.id).then(({count})=>setTotalTasks(count||0))
  },[])

  const card = {background:'#111', border:'1px solid #1a1a1a', borderRadius:16, padding:14, boxSizing:'border-box'}

  return <div style={{padding:14, maxWidth:420, margin:'0 auto', background:'#000', minHeight:'100vh', color:'white', boxSizing:'border-box'}}>
    
    {/* Balance Card - CYAN GRADIENT */}
    <div style={{...card, background:'linear-gradient(90deg, #0f7f8a 0%, #6a3db5 100%)', border:'none'}}>
      <p style={{margin:0, fontSize:12, opacity:0.8}}>Main Balance</p>
      <h1 style={{margin:'6px 0'}}>{bal} KSH</h1>
      <small style={{opacity:0.8}}>📱 {user?.phone} • {totalTasks} tasks done</small>
    </div>

    {/* Quick Grid */}
    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:12}}>
      <div style={card}><small style={{color:'#888'}}>Today</small><br/><b>{new Date().toLocaleDateString('en-US',{weekday:'long'})}</b></div>
      <div style={card}><small style={{color:'#888'}}>Status</small><br/><b style={{color:'#0f7f8a'}}>Verified ✅</b></div>
    </div>

    {/* Shortcuts - CYAN */}
    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:12}}>
      <Link to="/tasks" style={{...card, textDecoration:'none', color:'white', textAlign:'center', background:'#111'}}><span style={{fontSize:20}}>📝</span><br/><small>Tasks</small></Link>
      <Link to="/hosting" style={{...card, textDecoration:'none', color:'white', textAlign:'center', background:'#111'}}><span style={{fontSize:20}}>🌐</span><br/><small>Hosting</small></Link>
      <Link to="/profile" style={{...card, textDecoration:'none', color:'white', textAlign:'center', background:'#111'}}><span style={{fontSize:20}}>👤</span><br/><small>Profile</small></Link>
      <Link to="/all" style={{...card, textDecoration:'none', color:'white', textAlign:'center', background:'#111'}}><span style={{fontSize:20}}>💳</span><br/><small>Wallets</small></Link>
    </div>

    <Link to="/gwijigram" style={{display:'block', marginTop:12, padding:14, background:'#111', border:'1px solid #222', borderRadius:14, color:'white', textDecoration:'none', textAlign:'center'}}>
      💜 Open GWIJIGRAM WEB
    </Link>
  </div>
}