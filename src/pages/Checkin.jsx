// src/pages/Checkin.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Checkin(){
  const {user} = useAuth()
  const [streak, setStreak] = useState(0)
  const [todayDone, setTodayDone] = useState(false)
  const today = new Date().toISOString().split('T')[0]

  useEffect(()=>{ check() },[])
  async function check(){
    const {data} = await supabase.from('checkins').select('*').eq('user_id', user.id).eq('date', today).single()
    if(data) setTodayDone(true)
    const {count} = await supabase.from('checkins').select('*', {count:'exact'}).eq('user_id', user.id)
    setStreak(count||0)
  }
  async function doCheckin(){
    const {error} = await supabase.from('checkins').insert([{user_id:user.id, date:today, reward:5}])
    if(error) return alert(error.message)
    setTodayDone(true)
    setStreak(s=>s+1)
    alert('✅ Checked in! +5 KSH added to balance')
  }

  return <div style={{padding:14, background:'#000', minHeight:'100vh', color:'white', boxSizing:'border-box', width:'100%'}}>
    <h2>📅 Daily Checkin</h2>
    <div style={{background:'linear-gradient(90deg, #0f7f8a 0%, #6a3db5 100%)', padding:20, borderRadius:20, textAlign:'center', marginTop:12}}>
      <div style={{fontSize:40}}>🔥</div>
      <h1 style={{margin:'6px 0'}}>{streak} Days</h1>
      <small>Streak • +5 KSH per day</small><br/>
      <button onClick={doCheckin} disabled={todayDone} style={{marginTop:14, width:'100%', padding:14, background: todayDone? '#222' : 'white', color: todayDone? '#777' : 'black', border:'none', borderRadius:12, fontWeight:'bold', fontSize:16}}>
        {todayDone? '✅ Already Checked Today' : 'Checkin Now +5 KSH'}
      </button>
    </div>
    <div style={{background:'#111', border:'1px solid #1a1a1a', padding:14, borderRadius:16, marginTop:12}}>
      <b>How it works</b><br/><small style={{color:'#888'}}>Checkin daily to earn 5 KSH. Come every day to keep streak. Reward auto adds to Main Balance after admin approves.</small>
    </div>
  </div>
}