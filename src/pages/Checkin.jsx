// src/pages/Checkin.jsx - COPIED FROM POPUP LOGIC
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Checkin(){
  const {user} = useAuth()
  const [streak, setStreak] = useState(1)
  const [claimed, setClaimed] = useState(false)
  const rewards = [4,5,6,7,8,9,10]

  useEffect(()=>{
    const last = localStorage.getItem('last_checkin')
    const today = new Date().toDateString()
    if(last === today) setClaimed(true)
    setStreak(parseInt(localStorage.getItem('streak')||'1'))
  },[])

  const doCheckin = async ()=>{
    if(claimed) return
    setClaimed(true)
    const todayStr = new Date().toDateString()
    let newStreak = streak
    const last = localStorage.getItem('last_checkin')
    const yest = new Date(); yest.setDate(yest.getDate()-1)

    if(last && last !== yest.toDateString() && last !== todayStr) newStreak=1
    else if(last === yest.toDateString()) newStreak=Math.min(7,streak+1)

    const earn = rewards[newStreak-1]

    if(user?.id){
      await supabase.from('task_submissions').insert([{user_id:user.id, day_name:'Daily', status:'approved', earned:earn}])
      await supabase.from('card_wallets').insert([{user_id:user.id, card_name:'Daily Check-in', balance:earn}])
    }

    localStorage.setItem('last_checkin', todayStr)
    localStorage.setItem('streak', newStreak.toString())
    setStreak(newStreak)

    setTimeout(()=>{ alert(`🔥 Day ${newStreak} Checked! +${earn} KSH`) }, 400)
  }

  return <div style={{padding:14, background:'#000', minHeight:'100vh', color:'white', boxSizing:'border-box', width:'100%'}}>
    <h2 style={{margin:'6px 0', fontSize:18}}>📅 Daily Checkin</h2>
    
    <div style={{background:'#111', border:'1px solid #222', padding:18, borderRadius:20, width:'100%', textAlign:'center', boxSizing:'border-box', marginTop:12}}>
      <div style={{width:56, height:56, borderRadius:16, background:'linear-gradient(90deg, #0f7f8a 0%, #6a3db5 100%)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', fontSize:26}}>🎁</div>

      <h2 style={{margin:'0 0 4px', fontSize:20}}>Daily Check-in</h2>
      <p style={{margin:'0 0 14px', fontSize:12, color:'#888'}}>Miss a day? Streak resets to Day 1!</p>

      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:7, marginBottom:16}}>
        {rewards.map((amt,i)=>{
          const d = i+1
          const isCurrent = d===streak
          const isDone = claimed ? d<=streak : d<streak
          return <div key={i} style={{padding:'8px 2px', borderRadius:10, background: isCurrent && !claimed ? 'linear-gradient(90deg, #0f7f8a 0%, #6a3db5 100%)' : '#1a1a1a', border: isCurrent && !claimed ? 'none' : '1px solid #2a2a2a', color: isCurrent && !claimed ? 'white' : isDone ? '#555' : '#aaa', fontWeight: isCurrent && !claimed ? 'bold' : 'normal', position:'relative', opacity: isDone && !(isCurrent && !claimed) ? 0.5 : 1}}>
            <div style={{fontSize:9}}>DAY {d}</div><div style={{fontSize:12, marginTop:2}}>{amt}</div>
            {isDone && isCurrent && claimed && <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.6)', borderRadius:10}}>✅</div>}
            {isDone && !isCurrent && <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center'}}>✅</div>}
          </div>
        })}
      </div>

      <div style={{background:'#1a1a1a', borderRadius:12, padding:'10px', marginBottom:14}}>
        <div style={{fontSize:11, color:'#888'}}>Day {streak} Reward</div>
        <div style={{fontSize:32, fontWeight:'bold', background:'linear-gradient(90deg, #0f7f8a, #6a3db5)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>{rewards[streak-1]} KSH</div>
      </div>

      <button onClick={doCheckin} disabled={claimed} style={{width:'100%', padding:13, background: claimed ? '#333' : 'linear-gradient(90deg, #0f7f8a 0%, #6a3db5 100%)', color:'white', border:'none', borderRadius:12, fontWeight:'bold', fontSize:14, boxSizing:'border-box', cursor:'pointer'}}>
        {claimed ? 'Claimed Today ✅' : `Claim Day ${streak} → ${rewards[streak-1]} KSH`}
      </button>

      <div style={{marginTop:12, background:'#0f1f1f', border:'1px solid #0f7f8a33', borderRadius:10, padding:10, fontSize:11, color:'#888'}}>
        💡 Same streak as popup! Checkin from here or popup — both sync.
      </div>
    </div>
  </div>
}