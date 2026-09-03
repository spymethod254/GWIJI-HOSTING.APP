import { useState } from 'react'
import { supabase } from '../../lib/supabase'
export default function Tuesday({task, user, dayName}){
  const [proof,setProof]=useState(''); const [done,setDone]=useState(false)
  async function submit(){ if(!proof) return alert('Proof!'); await supabase.from('task_submissions').insert([{user_id:user.id, task_id:task.id, day_name:dayName, proof_link:proof, status:'pending'}]); setDone(true) }
  return <div style={{background:'#000', minHeight:'100vh', padding:12, color:'white'}}>
    <div style={{background:'#1a0a14', border:'1px solid #ec489933', borderRadius:24, padding:20, textAlign:'center'}}>
      <div style={{fontSize:50}}>💖</div><h1 style={{color:'#ec4899', margin:'8px 0'}}>TUESDAY LIKE DAY</h1><p style={{color:'#888', fontSize:13}}>{task.title}</p>
      <div style={{background:'linear-gradient(90deg,#ec4899,#f43f5e)', padding:12, borderRadius:12, marginTop:12, fontWeight:'bold'}}>{task.reward} KSH REWARD</div>
    </div>
    <div style={{marginTop:12, background:'#111', borderRadius:16, padding:14}}>
      <a href={task.link} target="_blank" style={{color:'#ec4899'}}>{task.link} →</a>
      <input value={proof} onChange={e=>setProof(e.target.value)} placeholder="Paste liked post link" style={{width:'100%', marginTop:12, padding:12, borderRadius:10, background:'#1a1a1a', border:'1px solid #222', color:'white', boxSizing:'border-box'}}/>
      <button onClick={submit} disabled={done} style={{width:'100%', marginTop:10, padding:13, borderRadius:12, border:'none', background:'linear-gradient(90deg,#ec4899,#f43f5e)', color:'white', fontWeight:'bold'}}>{done?'Liked ✅':'Submit Like'}</button>
    </div>
  </div>
}