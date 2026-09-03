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
    if (!subdomain || !name) return alert('Fill all!')
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

  const inputStyle = {width:'100%', padding:12, borderRadius:12, border:'1px solid #222', background:'#111', color:'white', boxSizing:'border-box', outline:'none'}

  return (
    <div style={{padding:14, maxWidth:420, margin:'0 auto', color:'white', background:'#000', minHeight:'100vh', boxSizing:'border-box'}}>
      <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:6}}>
        <div style={{width:36, height:36, borderRadius:10, background:'linear-gradient(90deg, #0f7f8a 0%, #6a3db5 100%)', display:'flex', alignItems:'center', justifyContent:'center'}}>🌐</div>
        <div>
          <h2 style={{margin:0, fontSize:18}}>Gwiji Host</h2>
          <small style={{color:'#888'}}>Create a site in seconds!</small>
        </div>
      </div>

      <div style={{background:'#0f0f0f', border:'1px solid #1a1a1a', padding:14, borderRadius:16, marginTop:14, boxSizing:'border-box'}}>
        <div style={{display:'flex', flexDirection:'column', gap:10}}>
          <input placeholder="Subdomain (e.g. my-shop)" value={subdomain} onChange={e=>setSubdomain(e.target.value)} style={inputStyle}/>
          <input placeholder="Site Name" value={name} onChange={e=>setName(e.target.value)} style={inputStyle}/>
          <textarea placeholder="HTML Code" value={html} onChange={e=>setHtml(e.target.value)} style={{...inputStyle, height:120, fontFamily:'monospace', fontSize:12}}/>
          <button onClick={createSite} style={{width:'100%', padding:13, background:'linear-gradient(90deg, #0f7f8a 0%, #6a3db5 100%)', color:'white', border:'none', borderRadius:12, fontWeight:'bold', cursor:'pointer'}}>🚀 Create Site</button>
        </div>
      </div>

      <h3 style={{margin:'20px 0 10px', fontSize:14, color:'#aaa'}}>My Sites ({sites.length})</h3>
      {sites.length===0 && <div style={{background:'#111', padding:20, borderRadius:12, textAlign:'center', color:'#555', fontSize:13}}>No sites yet. Create first!</div>}
      <div style={{display:'grid', gap:8}}>
        {sites.map(s => (
          <div key={s.id} style={{border:'1px solid #1a1a1a', background:'#111', padding:12, borderRadius:12, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div style={{overflow:'hidden'}}>
              <b style={{fontSize:14}}>{s.name}</b> <span style={{opacity:0.4, fontSize:11}}>({s.subdomain})</span><br/>
              <a href={`/?site=${s.subdomain}`} target="_blank" style={{fontSize:11, color:'#60a5fa', textDecoration:'none'}}>/?site={s.subdomain} ↗</a>
            </div>
            <button onClick={()=>deleteSite(s.id)} style={{background:'#1a1a1a', color:'#ff5a5a', border:'1px solid #222', padding:'6px 10px', borderRadius:8, fontSize:12}}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}