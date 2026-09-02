import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Hosting() {
  const [subdomain, setSubdomain] = useState('')
  const [name, setName] = useState('')
  const [html, setHtml] = useState('<h1>Hello World!</h1>\n<p>Hosted by Gwiji Host 🚀</p>')
  const [sites, setSites] = useState([])

  useEffect(() => { fetchSites() }, [])

  async function fetchSites() {
    const { data } = await supabase.from('sites').select('*').order('created_at', { ascending: false })
    if (data) setSites(data)
  }

  async function createSite() {
    if (!subdomain ||!name) return alert('Fill all!')
    const cleanSub = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '')
    const { error } = await supabase.from('sites').insert([{ subdomain: cleanSub, name, html_content: html }])
    if (error) alert(error.message)
    else {
      alert(`Created! Live at: /?site=${cleanSub}`)
      setSubdomain(''); setName('')
      fetchSites()
    }
  }

  async function deleteSite(id) {
    if(!confirm('Delete this site?')) return
    await supabase.from('sites').delete().eq('id', id)
    fetchSites()
  }

  return (
    <div style={{padding: '20px', color:'white'}}>
      <h1>🚀 Gwiji Host</h1>
      <p style={{opacity:0.7}}>Create a site in seconds!</p>

      <input placeholder="Subdomain (e.g. my-shop)" value={subdomain} onChange={e=>setSubdomain(e.target.value)} style={{width:'100%', padding:'12px', margin:'5px 0', borderRadius:8, border:'1px solid #333', background:'#222', color:'white'}}/>
      <input placeholder="Site Name" value={name} onChange={e=>setName(e.target.value)} style={{width:'100%', padding:'12px', margin:'5px 0', borderRadius:8, border:'1px solid #333', background:'#222', color:'white'}}/>
      <textarea placeholder="HTML Code" value={html} onChange={e=>setHtml(e.target.value)} style={{width:'100%', height:'120px', padding:'12px', margin:'5px 0', borderRadius:8, border:'1px solid #333', background:'#222', color:'white', fontFamily:'monospace'}}/>

      <button onClick={createSite} style={{width:'100%', padding:'14px', background:'white', color:'black', border:'none', borderRadius:8, marginTop:'10px', fontWeight:'bold', cursor:'pointer'}}>Create Site</button>

      <h2 style={{marginTop:'30px'}}>My Sites ({sites.length})</h2>
      {sites.map(s => (
        <div key={s.id} style={{border:'1px solid #333', background:'#1a1a1a', padding:'12px', margin:'8px 0', borderRadius:8, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <b>{s.name}</b> <span style={{opacity:0.5, fontSize:'12px'}}>({s.subdomain})</span><br/>
            <a href={`/?site=${s.subdomain}`} target="_blank" style={{fontSize:'12px', color:'#60a5fa', textDecoration:'none'}}>
              /?site={s.subdomain} ↗
            </a>
          </div>
          <button onClick={()=>deleteSite(s.id)} style={{background:'#333', color:'white', border:'none', padding:'6px 10px', borderRadius:5}}>Delete</button>
        </div>
      ))}
    </div>
  )
}