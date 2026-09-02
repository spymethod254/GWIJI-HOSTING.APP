import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Hosting from './pages/Hosting'
import Earning from './pages/Earning'
import Boosting from './pages/Boosting'

function App() {
  const [active, setActive] = useState('hosting')
  const [hostedContent, setHostedContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { checkIfHostedSite() }, [])

  async function checkIfHostedSite() {
    const path = window.location.pathname
    const params = new URLSearchParams(window.location.search)
    let sub = null
    if (params.get('site')) sub = params.get('site')
    else if (path.startsWith('/site/')) sub = path.replace('/site/', '').split('/')[0]
    if (sub) {
      const { data } = await supabase.from('sites').select('*').eq('subdomain', sub).single()
      if (data) { setHostedContent(data.html_content); setLoading(false); return }
    }
    setLoading(false)
  }

  if (loading) return <div style={{padding:20, background:'#111', color:'white', minHeight:'100vh'}}>Loading...</div>
  if (hostedContent) return <div dangerouslySetInnerHTML={{__html: hostedContent}} />

  return (
    <div style={{fontFamily:'sans-serif', minHeight:'100vh', background:'#111', color:'white'}}>
      <nav style={{display:'flex', gap:10, padding:15, background:'#000', borderBottom:'1px solid #333', position:'sticky', top:0, zIndex:10, overflowX:'auto'}}>
        <b style={{marginRight:15}}>🚀 GWIJI</b>
        <button onClick={()=>setActive('hosting')} style={{padding:'8px 15px', background: active==='hosting'?'white':'#333', color: active==='hosting'?'black':'white', border:'none', borderRadius:20, whiteSpace:'nowrap'}}>Hosting</button>
        <button onClick={()=>setActive('earning')} style={{padding:'8px 15px', background: active==='earning'?'white':'#333', color: active==='earning'?'black':'white', border:'none', borderRadius:20, whiteSpace:'nowrap'}}>Earning</button>
        <button onClick={()=>setActive('boosting')} style={{padding:'8px 15px', background: active==='boosting'?'white':'#333', color: active==='boosting'?'black':'white', border:'none', borderRadius:20, whiteSpace:'nowrap'}}>Boosting</button>
      </nav>
      <div style={{maxWidth:'600px', margin:'auto'}}>
        {active==='hosting' && <Hosting />}
        {active==='earning' && <Earning />}
        {active==='boosting' && <Boosting />}
      </div>
    </div>
  )
}
export default App