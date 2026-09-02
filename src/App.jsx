import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

function App() {
  const [subdomain, setSubdomain] = useState('')
  const [name, setName] = useState('')
  const [html, setHtml] = useState('<h1>Hello World!</h1>')
  const [sites, setSites] = useState([])

  useEffect(() => { fetchSites() }, [])

  async function fetchSites() {
    const { data } = await supabase.from('sites').select('*').order('created_at', {ascending: false})
    if(data) setSites(data)
  }

  async function createSite() {
    if(!subdomain || !name) return alert('Fill all!')
    const { error } = await supabase.from('sites').insert([{ subdomain, name, html_content: html }])
    if(error) alert(error.message)
    else {
      alert(`Site created! Your link will be: ${subdomain}.yourdomain.com`)
      setSubdomain(''); setName('')
      fetchSites()
    }
  }

  return (
    <div style={{padding: '20px', maxWidth: '600px', margin: 'auto', fontFamily: 'sans-serif'}}>
      <h1>🚀 Gwiji Host</h1>
      <p>Create a site in seconds!</p>
      
      <input placeholder="Subdomain (e.g. my-shop)" value={subdomain} onChange={e=>setSubdomain(e.target.value)} style={{width:'100%', padding:'10px', margin:'5px 0'}}/>
      <input placeholder="Site Name" value={name} onChange={e=>setName(e.target.value)} style={{width:'100%', padding:'10px', margin:'5px 0'}}/>
      <textarea placeholder="HTML" value={html} onChange={e=>setHtml(e.target.value)} style={{width:'100%', height:'100px', padding:'10px', margin:'5px 0'}}/>
      
      <button onClick={createSite} style={{width:'100%', padding:'12px', background:'black', color:'white', border:'none', marginTop:'10px', cursor:'pointer'}}>Create Site</button>

      <h2 style={{marginTop:'30px'}}>My Sites</h2>
      {sites.map(s => (
        <div key={s.id} style={{border:'1px solid #ddd', padding:'10px', margin:'5px 0'}}>
          <b>{s.name}</b> - {s.subdomain}
        </div>
      ))}
    </div>
  )
}

export default App