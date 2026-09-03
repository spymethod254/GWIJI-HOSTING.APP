import { useState } from 'react'
import { supabase } from '../../lib/supabase'
export default function Friday({task, user, dayName}){
  const [proof,setProof]=useState(''); const [done,setDone]=useState(false)
  async function submit(){ await supabase.from('task_submissions').insert([{user_id:user.id, task_id:task.id, day_name:dayName, proof_link:proof, status:'pending'}]); setDone(true) }
  return <div style={{background:'#0a0014', minHeight:'100vh', padding:12, color:'white'}}>
    <div style={{background:'#1a0a33', borderRadius:24, padding:20, border:'1px solid #8b5cf633'}}>
      <div style={{background:'#8b5cf6', width:48, height:48, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24}}>✨</div>
      <h1 style={{margin:'12px 0 4px'}}>FRIDAY VIBES</h1><p style={{color:'#a78bfa', fontSize:13}}>{task.title}</p>
      <div style={{color:'#8b5cf6', fontSize:32, fontWeight:'bold', marginTop:8}}>{task.reward} KSH</div>
    </div>
    <a href={task.link} target="_blank" style={{display:'block', marginTop:12, background:'#8b5cf6', textAlign:'center', padding:13, borderRadius:12, color:'white', textDecoration:'none', fontWeight:'bold'}}>Open Task →</a>
    <div style={{background:'#111', borderRadius:16, padding:14, marginTop:12}}>
      <input value={proof} onChange={e=>setProof(e.target.value)} placeholder="Proof" style={{width:'100%', padding:12, borderRadius:10, background:'#1a1a1a', border:'1px solid #222', color:'white', boxSizing:'border-box'}}/>
      <button onClick={submit} disabled={done} style={{width:'100%', marginTop:10, padding:13, borderRadius:12, border:'none', background:'#8b5cf6', color:'white', fontWeight:'bold'}}>{done?'Done ✅':'Submit'}</button>
    </div>
  </div>
}