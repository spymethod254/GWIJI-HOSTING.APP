import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({children}){
  const [user, setUser] = useState(()=>JSON.parse(localStorage.getItem('gwiji_user')||'null'))
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    const check = async ()=>{
      if(user?.id){
        const {data} = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if(data) setUser(data)
      }
      setLoading(false)
    }
    check()
  },[])
  useEffect(()=>{ localStorage.setItem('gwiji_user', JSON.stringify(user)) },[user])
  const logout = ()=>{ localStorage.removeItem('gwiji_user'); setUser(null); window.location.href='/login' }
  return <AuthContext.Provider value={{user, setUser, logout, loading}}>{children}</AuthContext.Provider>
}