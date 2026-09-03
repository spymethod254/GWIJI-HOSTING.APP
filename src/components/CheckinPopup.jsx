import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
export default function CheckinPopup(){
  const {user} = useAuth()
  const [show, setShow] = useState(false)
  const [streak, setStreak] = useState(1)
  const rewards = [4,5,6,7,8,9,10]
  useEffect(()=>{
    const last = localStorage.getItem('last_checkin')
    if(last!== new Date().toDateString()) setTimeout(()=>setShow(true),1500)
    setStreak(parseInt(localStorage.getItem('streak')||'1'))
  },[])
  const doCheckin = async ()=>{
    const todayStr = new Date().toDateString()
    let newStreak = streak
    const last = localStorage.getItem('last_checkin')
    const yest = new Date(); yest.setDate(yest.getDate()-1)
    if(last && last!== yest.toDateString()) newStreak=1
    else if(last=== yest.toDateString()) newStreak=Math.min(7,streak+1)
    const earn = rewards[newStreak-1]
    await supabase.from('task_submissions').insert([{user_id:user.id, day_name:'Daily', status:'approved', earned:earn}])
    await supabase.from('card_wallets').insert([{user_id:user.id, card_name:'Daily Check-in', balance:earn}])
    localStorage.setItem('last_checkin', todayStr)
    localStorage.setItem('streak', newStreak.toString())
    setShow(false); alert(`Day ${newStreak} Checked! +${earn} KSH`)
  }
  if(!show) return null
  return <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:50, display:'flex', alignItems:'center', justifyContent:'center'}}>
    <div style={{background:'white', color:'black', padding:25, borderRadius:15, width:'85%', maxWidth:350, textAlign:'center'}}>
      <h2>🎁 Daily Check-in</h2><p>Day {streak} of 7</p><h1 style={{fontSize:40}}>{rewards[streak-1]} KSH</h1>
      <button onClick={doCheckin} style={{width:'100%', padding:12, background:'black', color:'white', border:'none', borderRadius:8}}>Check-in Now</button>
      <button onClick={()=>setShow(false)} style={{marginTop:8, background:'none', border:'none'}}>Close</button>
    </div>
  </div>
}