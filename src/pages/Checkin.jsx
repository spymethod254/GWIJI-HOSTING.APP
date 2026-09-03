// src/pages/Checkin.jsx - FULL SCREEN EDGE TO EDGE
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

  return <div style={{background:'#000', minHeight:'100vh', color:'white', width:'100%', padding:10, boxSizing:'border-box'}}>
    <div style={{width:'100%', textAlign:'center', paddingTop:8}}>
      <div style={{width:64, height:64, borderRadius:18, background:'linear-gradient(90deg, #0f7f8a 0%, #6a3db5 100%)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px', fontSize:30}}>🎁</div>
      <h2 style={{margin:0, fontSize:22}}>Daily Check-in</h2>
      <p style={{margin:'6px 0 14px', fontSize:12, color:'#888'}}>Miss a day? Streak resets to Day 1!</p>
    </div>

    <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, width:'100%'}}>
      {rewards.map((amt,i)=>{
        const d = i+1
        const isCurrent = d===streak
        const isDone = claimed ? d<=streak : d<streak
        return <div key={i} style={{padding:'12px 4px', borderRadius:14, background: isCurrent && !claimed ? 'linear-gradient(90deg, #0f7f8a 0%, #6a3db5 100%)' : '#111', border: '1px solid ' + (isCurrent && !claimed ? 'transparent' : '#1a1a1a'), color: isCurrent && !claimed ? 'white' : isDone ? '#444' : '#aaa', fontWeight: isCurrent && !claimed ? 'bold' : 'normal', textAlign:'center'}}>
          <div style={{fontSize:10, opacity:0.7}}>DAY {d}</div>
          <div style={{fontSize:14, marginTop:4, fontWeight:'bold'}}>{isDone ? '✅' : amt}</div>
        </div>
      })}
    </div>

    <div style={{background:'#111', border:'1px solid #1a1a1a', borderRadius:16, padding:14, marginTop:12, textAlign:'center', width:'100%', boxSizing:'border-box'}}>
      <div style={{fontSize:11, color:'#888'}}>Day {streak} Reward</div>
      <div style={{fontSize:36, fontWeight:'bold', background:'linear-gradient(90deg, #0f7f8a, #6a3db5)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>{rewards[streak-1]} KSH</div>
    </div>

    <button onClick={doCheckin} disabled={claimed} style={{width:'100%', padding:15, background: claimed ? '#222' : 'linear-gradient(90deg, #0f7f8a 0%, #6a3db5 100%)', color: claimed? '#666' : 'white', border:'none', borderRadius:14, fontWeight:'bold', fontSize:16, marginTop:12, boxSizing:'border-box'}}>
      {claimed ? 'Claimed Today ✅' : `Claim Day ${streak} → ${rewards[streak-1]} KSH`}
    </button>
  </div>
}