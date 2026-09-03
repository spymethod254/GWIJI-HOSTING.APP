// src/components/CheckinPopup.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function CheckinPopup(){
  const {user} = useAuth()
  const [show, setShow] = useState(false)
  const [streak, setStreak] = useState(1)
  const [claimed, setClaimed] = useState(false)
  const rewards = [4,5,6,7,8,9,10]

  useEffect(()=>{
    const last = localStorage.getItem('last_checkin')
    if(last !== new Date().toDateString()) setTimeout(()=>setShow(true),1500)
    setStreak(parseInt(localStorage.getItem('streak')||'1'))
  },[])

  const doCheckin = async ()=>{
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

    setTimeout(()=>{ setShow(false); alert(`🔥 Day ${newStreak} Checked! +${earn} KSH`) }, 800)
  }

  if(!show) return null

  return <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(8px)', zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:16, boxSizing:'border-box'}}>
    <div style={{background:'#111', color:'white', border:'1px solid #222', padding:22, borderRadius:20, width:'100%', maxWidth:330, textAlign:'center', boxSizing:'border-box', animation:'pop 0.3s ease', overflow:'hidden'}}>
      
      <div style={{width:56, height:56, borderRadius:16, background:'linear-gradient(90deg, #0f7f8a 0%, #6a3db5 100%)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', fontSize:26}}>🎁</div>
      
      <h2 style={{margin:'0 0 4px', fontSize:20}}>Daily Check-in</h2>
      <p style={{margin:'0 0 14px', fontSize:12, color:'#888'}}>Miss a day? Streak resets to Day 1!</p>

      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:7, marginBottom:16}}>
        {rewards.map((amt,i)=>{
          const d = i+1
          const isCurrent = d===streak
          const isDone = d<streak
          return <div key={i} style={{padding:'8px 2px', borderRadius:10, background: isCurrent ? 'linear-gradient(90deg, #0f7f8a 0%, #6a3db5 100%)' : '#1a1a1a', border: isCurrent ? 'none' : '1px solid #2a2a2a', color: isCurrent ? 'white' : isDone ? '#555' : '#aaa', fontWeight: isCurrent ? 'bold' : 'normal', position:'relative', opacity: isDone ? 0.5 : 1}}>
            <div style={{fontSize:9}}>DAY {d}</div><div style={{fontSize:12, marginTop:2}}>{amt}</div>
            {isDone && <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center'}}>✅</div>}
          </div>
        })}
      </div>

      <div style={{background:'#1a1a1a', borderRadius:12, padding:'10px', marginBottom:14}}>
        <div style={{fontSize:11, color:'#888'}}>Day {streak} Reward</div>
        <div style={{fontSize:32, fontWeight:'bold', background:'linear-gradient(90deg, #0f7f8a, #6a3db5)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>{rewards[streak-1]} KSH</div>
      </div>

      <button onClick={doCheckin} disabled={claimed} style={{width:'100%', padding:13, background: claimed ? '#333' : 'linear-gradient(90deg, #0f7f8a 0%, #6a3db5 100%)', color:'white', border:'none', borderRadius:12, fontWeight:'bold', fontSize:14, boxSizing:'border-box', cursor:'pointer'}}>
        {claimed ? 'Claimed ✅' : `Claim Day ${streak} → ${rewards[streak-1]} KSH`}
      </button>

      <button onClick={()=>setShow(false)} style={{marginTop:10, background:'none', border:'none', color:'#666', fontSize:12, cursor:'pointer'}}>Maybe later</button>

      <style>{`@keyframes pop{from{transform:scale(0.85);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
    </div>
  </div>
}