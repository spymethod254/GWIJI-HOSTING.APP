import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar({show, setShow}){
  const {logout} = useAuth()
  const loc = useLocation()
  const links = [
    ['/','📊 Dashboard'],
    ['/checkin','📅 Daily Checkin 🔥'], // <-- NEW HERE
    ['/tasks','📝 Tasks'],
    ['/main','💰 Main Balance'],
    ['/all','💳 All Account Balance'],
    ['/hosting','🌐 Buy Domains'],
    ['/boosting','🚀 Social Boosting'],
    ['/gwijigram','💜 GWIJIGRAM WEB'],
    ['/profile','👤 Profile'],
    ['/whatsapp','💬 WhatsApp Support'],
    ['/support','🛟 Support'],
  ]

  return (
    <>
      {/* Header */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 14px', background:'#000', position:'sticky', top:0, zIndex:20, borderBottom:'1px solid #111'}}>
        <Link to="/" style={{color:'white', textDecoration:'none', fontWeight:'bold', letterSpacing:0.5}}>🚀 GWIJIGRAM</Link>
        <button onClick={()=>setShow(!show)} style={{background:'#fff', color:'#000', border:'none', padding:'6px 12px', borderRadius:8, fontWeight:'bold'}}>{show ? '✕' : '☰'}</button>
      </div>

      {/* Menu Dropdown */}
      {show && (
        <>
          {/* blur bg */}
          <div onClick={()=>setShow(false)} style={{position:'fixed', inset:0, top:49, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(6px)', zIndex:15}}/>
          
          <div style={{background:'#0a0a0a', padding:10, display:'grid', gap:7, position:'relative', zIndex:16, borderBottom:'1px solid #1a1a1a', animation:'slideDown 0.25s ease'}}>
            {links.map(([to,label])=>{
              const active = loc.pathname===to
              const isCheckin = to==='/checkin'
              return <Link key={to} to={to} onClick={()=>setShow(false)} style={{
                padding:'12px 14px', 
                background: active ? 'linear-gradient(90deg, #0f7f8a 0%, #6a3db5 100%)' : isCheckin ? '#0f1f1f' : '#151515',
                color: active ? 'white' : isCheckin ? '#2ee5ff' : '#aaa', 
                textDecoration:'none', 
                borderRadius:12,
                fontWeight: active || isCheckin ? 'bold' : 'normal',
                border: active ? 'none' : isCheckin ? '1px solid #0f7f8a' : '1px solid #222',
                fontSize:14,
                display:'flex',
                justifyContent:'space-between',
                alignItems:'center'
              }}>
                <span>{label}</span>
                {isCheckin && !active && <span style={{background:'#0f7f8a', color:'white', fontSize:10, padding:'2px 6px', borderRadius:6}}>+5 KSH</span>}
              </Link>
            })}
            <button onClick={logout} style={{padding:12, background:'#ff2a2a', color:'white', border:'none', borderRadius:12, fontWeight:'bold', marginTop:4}}>🚪 Logout</button>
          </div>

          <style>{`@keyframes slideDown{from{opacity:0; transform:translateY(-10px)}to{opacity:1; transform:translateY(0)}}`}</style>
        </>
      )}
    </>
  )
}