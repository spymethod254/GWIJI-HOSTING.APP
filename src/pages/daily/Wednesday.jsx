import { useState } from 'react'
import { supabase } from '../../lib/supabase'
export default function Wednesday({task, user, dayName}){
  const [proof,setProof]=useState(''); const [done,setDone]=useState(false)
  async function submit(){ await supabase.from('task_submissions').insert([{user_id:user.id, task_id:task.id, day_name:dayName, proof_link:proof, status:'pending'}]); setDone(true) }
  return <div style={{background:'#0f0a00', minHeight:'100vh', padding:12, color:'white'}}>
    <div style={{border:'2px dashed #f59e0b', borderRadius:24, padding:20}}>
      <span style={{background:'#f59e0b', color:'black', padding:'4px 10px', borderRadius:20, fontSize:11, fontWeight:'bold'}}>WEDNESDAY</span>
      <h1 style={{margin:'10px 0 4px'}}>📝 Signup Task</h1><p style={{color:'#a16207', fontSize:13}}>{task.title}</p>
      <h2 style={{color:'#f59e0b'}}>{task.reward} KSH</h2>
      <a href={task.link} target="_blank"><button style={{width:'100%', padding:13, background:'#f59e0b', border:'none', borderRadius:12, fontWeight:'bold'}}>Open Signup Link ↗</button></a>
    </div>
    <div style={{background:'#1a1400', borderRadius:16, padding:14, marginTop:12}}>
      <input value={proof} onChange={e=>setProof(e.target.value)} placeholder="Email used to signup" style={{width:'100%', padding:12, borderRadius:10, background:'#111', border:'1px solid #222', color:'white', boxSizing:'border-box'}}/>
      <button onClick={submit} disabled={done} style={{width:'100%', marginTop:10, padding:13, borderRadius:12, border:'none', background:'#f59e0b', color:'black', fontWeight:'bold'}}>{done?'Submitted ✅':'Verify Signup'}</button>
    </div>
  </div>
}