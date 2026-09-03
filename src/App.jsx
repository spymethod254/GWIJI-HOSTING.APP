import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

function App() {
  const [active, setActive] = useState('dashboard')
  const [showMenu, setShowMenu] = useState(false)
  const [today] = useState(new Date().toLocaleDateString('en-US', {weekday:'long'}))
  const [checkinPopup, setCheckinPopup] = useState(false)
  const [streak, setStreak] = useState(1)
  const [mainBal, setMainBal] = useState(0)
  const [cardWallets, setCardWallets] = useState([])
  const [tasks, setTasks] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [hostedContent, setHostedContent] = useState(null)
  const [sites, setSites] = useState([])

  const userId = localStorage.getItem('gwiji_user') || 'user_'+Math.random().toString(36).substring(2,9)
  useEffect(()=>{localStorage.setItem('gwiji_user', userId)},[])
  const rewards = [4,5,6,7,8,9,10] // day 1-7

  useEffect(()=>{ init() },[])
  async function init(){
    // Check if hosted site?site=
    const params = new URLSearchParams(window.location.search)
    const sub = params.get('site') || window.location.pathname.split('/site/')[1]
    if(sub){
      const {data} = await supabase.from('sites').select('*').eq('subdomain', sub).single()
      if(data){ setHostedContent(data.html_content); return }
    }
    fetchTasks(); fetchWallets(); fetchSites(); checkDailyPopup()
  }

  async function fetchTasks(){
    const {data} = await supabase.from('weekly_tasks').select('*')
    if(data) setTasks(data)
  }
  async function fetchWallets(){
    const {data} = await supabase.from('card_wallets').select('*').eq('user_id', userId)
    const {data: subs} = await supabase.from('task_submissions').select('*').eq('user_id', userId)
    if(data) setCardWallets(data)
    if(subs) { setSubmissions(subs); calcMain(subs) }
  }
  function calcMain(subs){
    const total = subs.filter(s=>s.status==='approved').reduce((a,b)=>a+b.earned,0)
    setMainBal(total)
  }
  async function fetchSites(){
    const {data} = await supabase.from('sites').select('*').order('created_at',{ascending:false})
    if(data) setSites(data)
  }
  async function checkDailyPopup(){
    const last = localStorage.getItem('last_checkin')
    const todayStr = new Date().toDateString()
    if(last!== todayStr){
      setTimeout(()=>setCheckinPopup(true), 1500) // popup like Ad after 1.5s
    }
    const s = parseInt(localStorage.getItem('streak')||'1')
    setStreak(s)
  }
  async function doCheckin(){
    const todayStr = new Date().toDateString()
    const last = localStorage.getItem('last_checkin')
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1)
    let newStreak = streak
    if(last!== yesterday.toDateString() && last!== null) newStreak = 1 // missed = reset
    else if(last === yesterday.toDateString()) newStreak = Math.min(7, streak+1)

    const earn = rewards[newStreak-1]
    // save to card_wallets
    await supabase.from('card_wallets').insert([{user_id:userId, card_name:'Daily Check-in', balance:earn}])
    await supabase.from('task_submissions').insert([{user_id:userId, day_name:'Daily', status:'approved', earned:earn}])

    localStorage.setItem('last_checkin', todayStr)
    localStorage.setItem('streak', newStreak.toString())
    setCheckinPopup(false)
    alert(`Checked Day ${newStreak}! Earned ${earn} KSH`)
    fetchWallets()
  }

  async function submitTask(task){
    if(task.day_name!== today){
      alert(`Come back another day when is opened. This task is for ${task.day_name}, today is ${today}`)
      return
    }
    const proof = prompt('Paste proof link / screenshot link:')
    if(!proof) return
    await supabase.from('task_submissions').insert([{
      user_id:userId, task_id:task.id, day_name:task.day_name,
      proof_link:proof, earned:task.reward, status:'pending'
    }])
    alert('Submitted! Waiting admin approval')
    fetchWallets()
  }

  // UI
  if(hostedContent) return <div dangerouslySetInnerHTML={{__html: hostedContent}}/>

  const todayTasks = tasks.filter(t=>t.day_name===today)
  const otherTasks = tasks.filter(t=>t.day_name!==today)

  return (
    <div style={{fontFamily:'sans-serif', background:'#0f0f0f', minHeight:'100vh', color:'white'}}>
      {/* Top Bar */}
      <div style={{display:'flex', justifyContent:'space-between', padding:15, background:'#000', position:'sticky', top:0, zIndex:20}}>
        <b>🚀 GWIJIGRAM HOSTING</b>
        <button onClick={()=>setShowMenu(!showMenu)} style={{background:'white', color:'black', border:'none', padding:'5px 12px', borderRadius:6}}>☰</button>
      </div>

      {/* Hidden Navbar Drawer */}
      {showMenu && (
        <div style={{background:'#111', borderBottom:'1px solid #333', padding:10, display:'grid', gap:6}}>
          {[
            ['dashboard','📊 Dashboard'],
            ['main','💰 Main Balance'],
            ['all','💳 All Account Balance'],
            ['buy','🌐 Buy Domains'],
            ['boost','🚀 Social Boosting'],
            ['gwijigram','💜 GWIJIGRAM WEB'],
            ['tasks','📝 Tasks'],
            ['whatsapp','💬 WhatsApp Support'],
            ['support','🛟 Support'],
          ].map(([k,l])=>(
            <button key={k} onClick={()=>{setActive(k); setShowMenu(false)}} style={{textAlign:'left', padding:12, background: active===k?'white':'#222', color:active===k?'black':'white', border:'none', borderRadius:8}}>{l}</button>
          ))}
        </div>
      )}

      {/* Check-in Popup like Ad */}
      {checkinPopup && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:50, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div style={{background:'white', color:'black', padding:25, borderRadius:15, width:'85%', maxWidth:350, textAlign:'center'}}>
            <h2>🎁 Daily Check-in</h2>
            <p>Day {streak} of 7</p>
            <h1 style={{fontSize:40}}>{rewards[streak-1]} KSH</h1>
            <p>Miss one day = reset to zero!</p>
            <button onClick={doCheckin} style={{width:'100%', padding:12, background:'black', color:'white', border:'none', borderRadius:8, fontWeight:'bold'}}>Check-in Now (24hrs)</button>
            <button onClick={()=>setCheckinPopup(false)} style={{marginTop:8, background:'none', border:'none'}}>Close</button>
          </div>
        </div>
      )}

      <div style={{maxWidth:600, margin:'auto', padding:15}}>
        {/* DASHBOARD */}
        {active==='dashboard' && (
          <div>
            <h2>Dashboard - {today}</h2>
            <div style={{background:'#1a1a1a', padding:15, borderRadius:12, marginTop:10}}>
              <p>Main Balance</p><h1>{mainBal} KSH</h1>
              <p style={{opacity:0.6, fontSize:12}}>User: {userId}</p>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:15}}>
              {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d=>{
                const bal = submissions.filter(s=>s.day_name===d && s.status==='approved').reduce((a,b)=>a+b.earned,0)
                return <div key={d} style={{background:'#222', padding:12, borderRadius:10}}><small>{d}</small><br/><b>{bal} KSH</b><br/><small style={{fontSize:10}}>{d===today?'OPEN TODAY':'Locked'}</small></div>
              })}
            </div>
          </div>
        )}

        {/* TASKS - YOUR MAIN LOGIC */}
        {active==='tasks' && (
          <div>
            <h2>📝 Tasks - {today}</h2>
            <p style={{fontSize:12, opacity:0.7}}>Only today's tasks work. Others show "Come back another day"</p>
            {todayTasks.map(t=>(
              <div key={t.id} style={{background:'#1e1e1e', padding:15, borderRadius:12, marginTop:12, border:'1px solid #333'}}>
                <b>{t.title}</b><br/><small>{t.task_type} • {t.reward} KSH</small><br/>
                <a href={t.link} target="_blank" style={{color:'#60a5fa', fontSize:12}}>{t.link}</a><br/>
                <button onClick={()=>submitTask(t)} style={{marginTop:10, width:'100%', padding:10, background:'white', color:'black', border:'none', borderRadius:8}}>Do Task & Submit for Approval</button>
              </div>
            ))}
            {otherTasks.length>0 && <h4 style={{marginTop:20, opacity:0.6}}>Other Days (Locked)</h4>}
            {otherTasks.map(t=>(
              <div key={t.id} style={{background:'#111', padding:12, borderRadius:10, marginTop:8, opacity:0.5}}>
                <b>{t.day_name} - {t.title}</b> <button onClick={()=>submitTask(t)} style={{float:'right', padding:'4px 8px'}}>Try</button>
              </div>
            ))}
          </div>
        )}

        {active==='main' && (
          <div><h2>Main Balance: {mainBal} KSH</h2>
          <p>Withdraw when card reaches 100 KSH or all cards total 100 KSH moves to main, then withdraw to M-Pesa</p>
          <input placeholder="M-Pesa / Airtel number" id="mpesa" style={{width:'100%', padding:12, background:'#222', border:'1px solid #333', color:'white', borderRadius:8, marginTop:10}}/>
          <select style={{width:'100%', padding:12, background:'#222', color:'white', borderRadius:8, marginTop:8}}><option>M-PESA</option><option>Airtel Money</option><option>PayPal (Future)</option></select>
          <button onClick={()=>alert('Withdrawal requested! Admin will pay')} style={{width:'100%', padding:12, background:'white', color:'black', border:'none', borderRadius:8, marginTop:10}}>Withdraw</button>
          </div>
        )}
        {active==='all' && <div><h2>All Card Wallets</h2>{submissions.map(s=><div key={s.id} style={{background:'#222', padding:10, borderRadius:8, marginTop:6, display:'flex', justifyContent:'space-between'}}><span>{s.day_name} - {s.status}</span><b>{s.earned} KSH</b></div>)}</div>}
        {active==='buy' && <div><h2>🌐 Buy Domains / Hosting</h2><p>Create site like before, will be hosted at?site=xxx</p><button onClick={()=>setActive('dashboard')} style={{padding:10, background:'white', color:'black', border:'none', borderRadius:8}}>Go to Dashboard for Hosting</button>
          {sites.map(s=><div key={s.id} style={{background:'#222', padding:10, marginTop:8, borderRadius:8}}>{s.name} - <a href={`/?site=${s.subdomain}`} target="_blank" style={{color:'#60a5fa'}}>/?site={s.subdomain}</a></div>)}
        </div>}
        {active==='boost' && <div><h2>🚀 Social Boosting</h2><p>Buy followers, likes etc</p><button style={{width:'100%', padding:12, background:'white', color:'black', border:'none', borderRadius:8}}>Buy 100 Followers - 200 KSH</button></div>}
        {active==='gwijigram' && <div><h2>💜 GWIJIGRAM WEB</h2><p>Your GwijiGram social link will show here Saturday/Sunday tasks</p><a href="https://gwijigram.com" target="_blank" style={{color:'#60a5fa'}}>Open GwijiGram</a></div>}
        {active==='whatsapp' && <div><h2>💬 WhatsApp Support</h2><a href="https://wa.me/254700000000" style={{display:'block', padding:12, background:'#25D366', color:'white', textAlign:'center', borderRadius:8, textDecoration:'none'}}>Chat on WhatsApp</a></div>}
        {active==='support' && <div><h2>Support</h2><p>Email: support@gwijigram.com</p></div>}
      </div>
    </div>
  )
}
export default App