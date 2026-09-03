import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
export default function Tasks(){
  const {user} = useAuth()
  const today = new Date().toLocaleDateString('en-US',{weekday:'long'})
  const [tasks, setTasks] = useState([])
  useEffect(()=>{ supabase.from('weekly_tasks').select('*').then(({data})=>setTasks(data||[])) },[])
  const submit = async (t)=>{
    if(t.day_name!==today) return alert(`Come back another day when is opened. This is for ${t.day_name}, today is ${today}`)
    const proof = prompt('Paste proof link:')
    if(!proof) return
    await supabase.from('task_submissions').insert([{user_id:user.id, task_id:t.id, day_name:t.day_name, proof_link:proof, earned:t.reward, status:'pending'}])
    alert('Submitted! Waiting admin approval')
  }
  const todayTasks = tasks.filter(t=>t.day_name===today)
  const other = tasks.filter(t=>t.day_name!==today)
  return <div style={{padding:15, maxWidth:600, margin:'auto'}}>
    <h2>📝 Tasks - {today}</h2><p style={{fontSize:12, opacity:0.7}}>Only today's tasks work</p>
    {todayTasks.map(t=><div key={t.id} style={{background:'#1e1e1e', padding:15, borderRadius:12, marginTop:12}}><b>{t.title}</b><br/><small>{t.reward} KSH</small><br/><a href={t.link} target="_blank" style={{color:'#60a5fa'}}>{t.link}</a><button onClick={()=>submit(t)} style={{width:'100%', padding:10, marginTop:10, background:'white', color:'black', border:'none', borderRadius:8}}>Submit Task</button></div>)}
    {other.map(t=><div key={t.id} style={{background:'#111', padding:10, borderRadius:8, marginTop:8, opacity:0.5}}>{t.day_name} - {t.title} <button onClick={()=>submit(t)} style={{float:'right'}}>Try</button></div>)}
  </div>
}