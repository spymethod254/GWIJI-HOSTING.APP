import { useState } from 'react'
import { supabase } from '../../lib/supabase'
export default function Saturday({task, user, dayName}){
  const [proof,setProof]=useState(''); const [done,setDone]=useState(false)
  async function submit(){ await supabase.from('task_submissions').insert([{user_id:user.id, task_id:task.id, day_name:dayName, proof_link:proof, status:'pending'}]); setDone(true) }
  return <div style={{background:'#000', minHeight:'100vh', padding:10, color:'white', boxSizing:'border-box'}}>
    <div style={{background:'linear-gradient(90deg,#0f7f8a 0%,#6a3db5 100%)', borderRadius:20, padding:18, textAlign:'center'}}>
      <div style={{fontSize:40}}>🚀</div><h2 style={{margin:'6px 0'}}>GWIJIGRAM SATURDAY</h2><p style={{fontSize:12, opacity:0.9}}>{task.title}</p><div style={{background:'white', color:'black', display:'inline-block', padding:'6px 14px', borderRadius:20, fontWeight:'bold', marginTop:8}}>+{task.reward} KSH</div>
    </div>
    <div style={{background:'#111', borderRadius:16, padding:14, marginTop:12, border:'1px solid #1a1a1a'}}>
      <a href={task.link} target="_blank" style={{color:'#22d3ee', fontSize:13}}>{task.link}</a>
      <input value={proof} onChange={e=>setProof(e.target.value)} placeholder="Gwijigram username" style={{width:'100%', marginTop:12, padding:12, borderRadius:10, background:'#1a1a1a', border:'1px solid #222', color:'white', boxSizing:'border-box'}}/>
      <button onClick={submit} disabled={done} style={{width:'100%', marginTop:10, padding:13, borderRadius:12, border:'none', background:'linear-gradient(90deg,#0f7f8a 0%,#6a3db5 100%)', color:'white', fontWeight:'bold'}}>{done?'Joined ✅':'I Joined GWIJIGRAM'}</button>
    </div>
  </div>
}