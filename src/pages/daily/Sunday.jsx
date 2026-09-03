import { useState } from 'react'
import { supabase } from '../../lib/supabase'
export default function Sunday({task, user, dayName}){
  const [proof,setProof]=useState(''); const [done,setDone]=useState(false)
  async function submit(){ await supabase.from('task_submissions').insert([{user_id:user.id, task_id:task.id, day_name:dayName, proof_link:proof, status:'pending'}]); setDone(true) }
  return <div style={{background:'#000', minHeight:'100vh', padding:12, color:'white'}}>
    <div style={{background:'linear-gradient(180deg,#eab308,#a16207)', borderRadius:24, padding:20, textAlign:'center', color:'black'}}>
      <div style={{fontSize:48}}>👑</div><h1 style={{margin:'8px 0 4px', color:'black'}}>SUNDAY SPECIAL</h1><p style={{margin:0, fontSize:13, color:'rgba(0,0,0,0.7)'}}>{task.title}</p>
      <div style={{background:'black', color:'#eab308', display:'inline-block', padding:'8px 16px', borderRadius:20, fontWeight:'bold', marginTop:12, fontSize:18}}>{task.reward} KSH</div>
    </div>
    <div style={{background:'#1a1600', borderRadius:16, padding:14, marginTop:12, border:'1px solid #eab30833'}}>
      <a href={task.link} target="_blank" style={{color:'#eab308'}}>{task.link} →</a>
      <input value={proof} onChange={e=>setProof(e.target.value)} placeholder="Paste proof of 5 likes" style={{width:'100%', marginTop:12, padding:12, borderRadius:10, background:'#111', border:'1px solid #222', color:'white', boxSizing:'border-box'}}/>
      <button onClick={submit} disabled={done} style={{width:'100%', marginTop:10, padding:13, borderRadius:12, border:'none', background:'#eab308', color:'black', fontWeight:'bold'}}>{done?'King Verified ✅':'Claim Sunday Reward'}</button>
    </div>
  </div>
}