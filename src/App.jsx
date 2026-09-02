import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

function App() {
  const [subdomain, setSubdomain] = useState('')
  const [name, setName] = useState('')
  const [html, setHtml] = useState('<h1>Hello World!</h1>')
  const [sites, setSites] = useState([])
  const [hostedContent, setHostedContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkIfHostedSite()
  }, [])

  async function checkIfHostedSite() {
    const host = window.location.hostname
    // e.g. test.gwiji.com -> subdomain = test
    // localhost or main domain -> show dashboard

    const parts = host.split('.')
    // If more than 2 parts and not github.dev and not vercel.app
    if (parts.length > 2 &&!host.includes('github.dev') &&!host.includes('localhost')) {
      const sub = parts[0]
      // Don't treat www as subdomain
      if (sub!== 'www') {
        const { data } = await supabase.from('sites').select('*').eq('subdomain', sub).single()
        if (data) {
          setHostedContent(data.html_content)
          setLoading(false)
          return
        }
      }
    }
    // If not a hosted site, show dashboard
    fetchSites()
    setLoading(false)
  }

  async function fetchSites() {
    const { data } = await supabase.from('sites').select('*').order('created_at', {ascending: false})
    if(data) setSites(data)
  }

  async function createSite() {
    if(!subdomain ||!name) return alert('Fill all!')
    const cleanSub = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '')
    const { error } = await supabase.from('sites').insert([{ subdomain: cleanSub, name, html_content: html }])
    if(error) alert(error.message)
    else {
      alert(`Created! Will be live at: ${cleanSub}.yourdomain.com after you connect domain!`)
      setSubdomain(''); setName('')
      fetchSites()
    }
  }

  if (loading) return <div style={{padding:20}}>Loading...</div>

  // IF IT'S A HOSTED SITE, SHOW ONLY THAT HTML
  if (hostedContent) {
    return <div dangerouslySetInnerHTML={{__html: hostedContent}} />
  }

  // OTHERWISE SHOW DASHBOARD (your screenshot)
  return (
    <div style={{padding: '20px', maxWidth: '600px', margin: 'auto', fontFamily: 'sans-serif'}}>
      <h1>🚀 Gwiji Host</h1>
      <p>Create a site in seconds!</p>
      <input placeholder="Subdomain (e.g. my-shop)" value={subdomain} onChange={e=>setSubdomain(e.target.value)} style={{width:'100%', padding:'10px', margin:'5px 0'}}/>
      <input placeholder="Site Name" value={name} onChange={e=>setName(e.target.value)} style={{width:'100%', padding:'10px', margin:'5px 0'}}/>
      <textarea placeholder="HTML" value={html} onChange={e=>setHtml(e.target.value)} style={{width:'100%', height:'100px', padding:'10px', margin:'5px 0'}}/>
      <button onClick={createSite} style={{width:'100%', padding:'12px', background:'black', color:'white', border:'none', marginTop:'10px'}}>Create Site</button>
      <h2 style={{marginTop:'30px'}}>My Sites</h2>
      {sites.map(s => (<div key={s.id} style={{border:'1px solid #ddd', padding:'10px', margin:'5px 0'}}><b>{s.name}</b> - {s.subdomain}</div>))}
    </div>
  )
}
export default App