// src/pages/Dashboard.jsx - FULL SCREEN
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

  return <div style={{padding:10, background:'#000', minHeight:'100vh', color:'white', boxSizing:'border-box', width:'100%'}}>
    
    {/* Balance Card - FULL WIDTH */}
    <div style={{...card, background:'linear-gradient(90deg, #0f7f8a 0%, #6a3db5 100%)', border:'none', width:'100%'}}>
      <p style={{margin:0, fontSize:12, opacity:0.8, textAlign:'center'}}>Main Balance</p>
      <h1 style={{margin:'6px 0', textAlign:'center', fontSize:32}}>0 KSH</h1>
      <small style={{opacity:0.8, display:'block', textAlign:'center'}}>📱 {user?.phone} • {totalTasks} tasks done</small>
    </div>

    {/* Quick Grid - FULL */}
    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:10, width:'100%'}}>
      <div style={{...card, textAlign:'center'}}><small style={{color:'#888'}}>Today</small><br/><b style={{fontSize:16}}>{new Date().toLocaleDateString('en-US',{weekday:'long'})}</b></div>
      <div style={{...card, textAlign:'center'}}><small style={{color:'#888'}}>Status</small><br/><b style={{color:'#0f7f8a', fontSize:16}}>Verified ✅</b></div>
    </div>

    {/* Shortcuts - FULL */}
    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:10, width:'100%'}}>
      <Link to="/tasks" style={{...card, textDecoration:'none', color:'white', textAlign:'center', padding:'18px 10px'}}><span style={{fontSize:24}}>📝</span><br/><small style={{fontSize:13}}>Tasks</small></Link>
      <Link to="/hosting" style={{...card, textDecoration:'none', color:'white', textAlign:'center', padding:'18px 10px'}}><span style={{fontSize:24}}>🌐</span><br/><small style={{fontSize:13}}>Hosting</small></Link>
      <Link to="/profile" style={{...card, textDecoration:'none', color:'white', textAlign:'center', padding:'18px 10px'}}><span style={{fontSize:24}}>👤</span><br/><small style={{fontSize:13}}>Profile</small></Link>
      <Link to="/all" style={{...card, textDecoration:'none', color:'white', textAlign:'center', padding:'18px 10px'}}><span style={{fontSize:24}}>💳</span><br/><small style={{fontSize:13}}>Wallets</small></Link>
    </div>

    <Link to="/gwijigram" style={{display:'block', marginTop:10, padding:14, background:'#111', border:'1px solid #222', borderRadius:14, color:'white', textDecoration:'none', textAlign:'center', width:'100%', boxSizing:'border-box'}}>
      💜 Open GWIJIGRAM WEB
    </Link>
  </div>
}