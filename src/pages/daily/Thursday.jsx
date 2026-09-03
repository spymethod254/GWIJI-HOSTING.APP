import { useState } from 'react'
import { supabase } from '../../lib/supabase'
export default function Thursday({task, user, dayName}){
  const [done,setDone]=useState(false)
  async function copy(){ navigator.clipboard.writeText(task.link); alert('Link copied!'); await supabase.from('task_submissions').insert([{user_id:user.id, task_id:task.id, day_name:dayName, proof_link:'invite', status:'approved', earned:task.reward}]); setDone(true) }
  return <div style={{background:'#000', minHeight:'100vh', padding:12, color:'white'}}>
    <div style={{background:'linear-gradient(135deg,#10b981,#059669)', borderRadius:24, padding:20}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}><h1 style={{margin:0}}>THURSDAY</h1><span style={{fontSize:30}}>🎉</span></div>
      <p style={{opacity:0.9, fontSize:13}}>{task.title} - Earn per referral!</p>
      <div style={{background:'rgba(0,0,0,0.2)', padding:12, borderRadius:12, marginTop:12, fontSize:12, wordBreak:'break-all'}}>{task.link}</div>
      <button onClick={copy} disabled={done} style={{width:'100%', marginTop:12, padding:13, background:'white', color:'#059669', border:'none', borderRadius:12, fontWeight:'bold'}}>{done?'Invite Tracked ✅':'Copy Invite Link & Claim 25 KSH'}</button>
    </div>
  </div>
}