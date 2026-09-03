// src/pages/Tasks.jsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Tasks(){
  const {user} = useAuth()
  const today = new Date().toLocaleDateString('en-US',{weekday:'long'})
  const [tasks, setTasks] = useState([])
  const [doneIds, setDoneIds] = useState([])

  useEffect(()=>{ 
    supabase.from('weekly_tasks').select('*').then(({data})=>setTasks(data||[]))
    supabase.from('task_submissions').select('task_id').eq('user_id', user?.id).then(({data})=>{
      if(data) setDoneIds(data.map(d=>d.task_id))
    })
  },[])

  const submit = async (t)=>{
    if(t.day_name!==today) return alert(`🔒 Come back on ${t.day_name}. Today is ${today}`)
    const proof = prompt('Paste proof link (YouTube watch screenshot etc):')
    if(!proof) return
    await supabase.from('task_submissions').insert([{user_id:user.id, task_id:t.id, day_name:t.day_name, proof_link:proof, earned:t.reward, status:'pending'}])
    alert('✅ Submitted! Waiting admin approval')
    setDoneIds([...doneIds, t.id])
  }

  const todayTasks = tasks.filter(t=>t.day_name===today)
  const other = tasks.filter(t=>t.day_name!==today)

  return <div style={{padding:14, maxWidth:420, margin:'0 auto', background:'#000', minHeight:'100vh', color:'white', boxSizing:'border-box'}}>
      {/* Checkin Banner Inside Tasks */}
    <a href="/checkin" style={{display:'block', background:'linear-gradient(90deg, #0f7f8a 0%, #6a3db5 100%)', padding:12, borderRadius:14, color:'white', textDecoration:'none', fontWeight:'bold', textAlign:'center', marginBottom:12}}>
      📅 Daily Checkin +5 KSH → Tap to Checkin 🔥
    </a>

    <h2 style={{margin:'8px 0 2px'}}>📝 Tasks</h2>
    <p style={{fontSize:12, color:'#888', margin:'0 0 14px'}}>Today is <b style={{color:'white'}}>{today}</b> • Only today's tasks can be submitted</p>

    {/* Today Tasks */}
    {todayTasks.length===0 && <div style={{background:'#111', padding:20, borderRadius:16, textAlign:'center', color:'#666', marginTop:20}}>No tasks for today 😴<br/><small>Check tomorrow!</small></div>}

    {todayTasks.map(t=>{
      const isDone = doneIds.includes(t.id)
      return <div key={t.id} style={{background:'#111', border:'1px solid #222', padding:14, borderRadius:16, marginTop:12, boxSizing:'border-box'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <b style={{fontSize:15}}>{t.title}</b>
          <span style={{background:'linear-gradient(90deg, #0f7f8a 0%, #6a3db5 100%)', padding:'4px 10px', borderRadius:20, fontSize:12, fontWeight:'bold'}}>{t.reward} KSH</span>
        </div>
        {t.description && <p style={{fontSize:12, color:'#888', margin:'8px 0'}}>{t.description}</p>}
        <a href={t.link} target="_blank" rel="noreferrer" style={{display:'block', background:'#1a1a1a', padding:10, borderRadius:10, color:'#60a5fa', fontSize:12, wordBreak:'break-all', textDecoration:'none', margin:'8px 0', border:'1px solid #222'}}>🔗 {t.link}</a>
        <button onClick={()=>submit(t)} disabled={isDone} style={{width:'100%', padding:12, marginTop:6, background: isDone ? '#222' : 'linear-gradient(90deg, #0f7f8a 0%, #6a3db5 100%)', color:'white', border:'none', borderRadius:12, fontWeight:'bold', cursor:'pointer'}}>
          {isDone ? 'Submitted ✅ Waiting' : 'Submit Task'}
        </button>
      </div>
    })}

    {/* Locked Other Days */}
    <h4 style={{margin:'22px 0 8px', color:'#666', fontSize:13}}>Other Days (Locked 🔒)</h4>
    <div style={{display:'grid', gap:8}}>
      {other.map(t=><div key={t.id} style={{background:'#0d0d0d', padding:12, borderRadius:12, border:'1px solid #151515', display:'flex', justifyContent:'space-between', alignItems:'center', opacity:0.6}}>
        <div><div style={{fontSize:13}}>{t.title}</div><small style={{color:'#666'}}>{t.day_name} • {t.reward} KSH</small></div>
        <button onClick={()=>submit(t)} style={{background:'#1a1a1a', color:'#555', border:'1px solid #222', padding:'6px 10px', borderRadius:8, fontSize:11}}>Locked</button>
      </div>)}
    </div>
  </div>
}