import { useState } from 'react'
import { supabase } from '../../lib/supabase'
export default function Monday({task, user, dayName}){
  const [proof,setProof]=useState(''); const [done,setDone]=useState(false)
  async function submit(){ if(!proof) return alert('Paste proof!'); await supabase.from('task_submissions').insert([{user_id:user.id, task_id:task.id, day_name:dayName, proof_link:proof, status:'pending'}]); setDone(true); alert('Submitted!') }
  return <div style={{background:'#000', minHeight:'100vh', padding:12, color:'white'}}>
    <div style={{background:'linear-gradient(180deg,#0ea5e9,#0284c7)', borderRadius:24, padding:20}}>
      <div style={{background:'rgba(255,255,255,0.2)', width:60, height:60, borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28}}>👥</div>
      <h1 style={{margin:'12px 0 4px'}}>MONDAY</h1><p style={{margin:0, opacity:0.9}}>{task.title}</p>
      <div style={{marginTop:14, background:'white', color:'#0284c7', display:'inline-block', padding:'6px 14px', borderRadius:20, fontWeight:'bold'}}>+{task.reward} KSH</div>
    </div>
    <div style={{background:'#0c1a22', borderRadius:16, padding:14, marginTop:12, border:'1px solid #0ea5e933'}}>
      <small style={{color:'#0ea5e9'}}>TASK LINK</small><br/><a href={task.link} target="_blank" style={{color:'white', fontSize:13}}>{task.link}</a>
      <input value={proof} onChange={e=>setProof(e.target.value)} placeholder="Your Instagram username after follow" style={{width:'100%', marginTop:12, padding:12, borderRadius:10, background:'#111', border:'1px solid #222', color:'white', boxSizing:'border-box'}}/>
      <button onClick={submit} disabled={done} style={{width:'100%', marginTop:10, padding:13, borderRadius:12, border:'none', background:'white', color:'#0284c7', fontWeight:'bold'}}>{done?'Follow Verified ✅':'I Followed → Claim'}</button>
    </div>
  </div>
}