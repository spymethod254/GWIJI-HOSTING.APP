import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function Thursday({task, user, dayName}){
  const [proof,setProof]=useState('')
  const [done,setDone]=useState(false)
  const [loading,setLoading]=useState(false)

  useEffect(()=>{
    async function check(){
      const {data} = await supabase.from('task_submissions').select('id').eq('user_id', user.id).eq('task_id', task.id).maybeSingle()
      if(data) setDone(true)
    }
    if(user?.id) check()
  },[user, task])

  async function submit(){
    if(!proof) return alert('Paste your invite proof! Eg: friend phone or screenshot link')
    setLoading(true)
    const {error} = await supabase.from('task_submissions').insert([{
      user_id: user.id,
      task_id: task.id,
      day_name: dayName,
      proof_link: proof,
      earned: task.reward,
      status: 'pending'
    }])
    setLoading(false)
    if(error) return alert(error.message)
    setDone(true)
    alert('✅ Invite proof submitted! Waiting admin approval for '+task.reward+' KSH')
  }

  async function copyLink(){
    navigator.clipboard.writeText(task.link)
    alert('Invite link copied! Share it: ' + task.link)
  }

  return <div style={{background:'#000', minHeight:'100vh', padding:12, color:'white', boxSizing:'border-box'}}>
    <div style={{background:'linear-gradient(135deg,#10b981,#059669)', borderRadius:24, padding:20}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <span style={{background:'rgba(0,0,0,0.2)', padding:'4px 10px', borderRadius:20, fontSize:11, fontWeight:'bold'}}>THURSDAY</span>
          <h1 style={{margin:'8px 0 4px'}}>🎉 Invite Day</h1>
        </div>
        <div style={{fontSize:32}}>💚</div>
      </div>
      <p style={{fontSize:13, opacity:0.9, margin:'8px 0 0'}}>{task.title}</p>
      <div style={{background:'white', color:'#059669', display:'inline-block', padding:'6px 14px', borderRadius:20, fontWeight:'bold', marginTop:12}}>+{task.reward} KSH per invite</div>
    </div>

    <div style={{background:'#0a1a14', border:'1px solid #10b98133', borderRadius:16, padding:14, marginTop:12}}>
      <small style={{color:'#10b981', fontWeight:'bold'}}>YOUR INVITE LINK (FROM DB)</small>
      <div style={{background:'#111', padding:10, borderRadius:10, marginTop:8, fontSize:12, wordBreak:'break-all', border:'1px solid #1a1a1a'}}>{task.link}</div>
      <button onClick={copyLink} style={{width:'100%', marginTop:10, padding:12, background:'#10b981', border:'none', borderRadius:10, color:'black', fontWeight:'bold'}}>📋 Copy Invite Link</button>
    </div>

    <div style={{background:'#111', borderRadius:16, padding:14, marginTop:12, border:'1px solid #1a1a1a'}}>
      <small style={{color:'#888'}}>PROOF OF INVITE</small>
      <input value={proof} onChange={e=>setProof(e.target.value)} placeholder="Paste friend's phone / screenshot link" style={{width:'100%', marginTop:8, padding:12, borderRadius:10, background:'#1a1a1a', border:'1px solid #222', color:'white', boxSizing:'border-box'}}/>
      <button onClick={submit} disabled={done || loading} style={{width:'100%', marginTop:10, padding:13, borderRadius:12, border:'none', background: done ? '#222' : 'linear-gradient(90deg,#10b981,#059669)', color:'white', fontWeight:'bold'}}>
        {done ? 'Invite Submitted ✅' : loading ? 'Submitting...' : `Submit Invite → Claim ${task.reward} KSH`}
      </button>
    </div>
  </div>
}