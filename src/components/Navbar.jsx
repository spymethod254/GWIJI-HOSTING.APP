import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
export default function Navbar({show, setShow}){
  const {logout} = useAuth()
  const loc = useLocation()
  const links = [
    ['/','📊 Dashboard'],
    ['/profile','👤 Profile'],
    ['/main','💰 Main Balance'],
    ['/all','💳 All Account Balance'],
    ['/hosting','🌐 Buy Domains'],
    ['/boosting','🚀 Social Boosting'],
    ['/gwijigram','💜 GWIJIGRAM WEB'],
    ['/tasks','📝 Tasks'],
    ['/whatsapp','💬 WhatsApp Support'],
    ['/support','🛟 Support'],
  ]
  return (
    <>
    <div style={{display:'flex', justifyContent:'space-between', padding:15, background:'#000', position:'sticky', top:0, zIndex:20}}>
      <Link to="/" style={{color:'white', textDecoration:'none'}}><b>🚀 GWIJIGRAM</b></Link>
      <button onClick={()=>setShow(!show)} style={{background:'white', color:'black', border:'none', padding:'5px 12px', borderRadius:6}}>☰</button>
    </div>
    {show && <div style={{background:'#111', padding:10, display:'grid', gap:6}}>
      {links.map(([to,label])=><Link key={to} to={to} onClick={()=>setShow(false)} style={{padding:12, background: loc.pathname===to?'white':'#222', color: loc.pathname===to?'black':'white', textDecoration:'none', borderRadius:8}}>{label}</Link>)}
      <button onClick={logout} style={{padding:12, background:'#ff3333', color:'white', border:'none', borderRadius:8}}>🚪 Logout</button>
    </div>}
    </>
  )
}