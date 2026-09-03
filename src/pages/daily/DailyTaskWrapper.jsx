// src/pages/daily/DailyTaskWrapper.jsx
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

import Monday from './Monday'
import Tuesday from './Tuesday'
import Wednesday from './Wednesday'
import Thursday from './Thursday'
import Friday from './Friday'
import Saturday from './Saturday'
import Sunday from './Sunday'

const DAY_COMPONENTS = {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday
}

export default function DailyTaskWrapper(){
  const {user} = useAuth()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)

  const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' }) // Monday, Tuesday...

  useEffect(()=>{
    async function load(){
      setLoading(true)
      const { data, error } = await supabase
       .from('weekly_tasks')
       .select('*')
       .eq('day_name', dayName)
       .eq('is_active', true)
       .maybeSingle()

      if(error) console.log(error)
      setTask(data)
      setLoading(false)
    }
    load()
  },[dayName])

  if(loading) return <div style={{background:'#000', minHeight:'100vh', color:'white', padding:20, display:'flex', alignItems:'center', justifyContent:'center'}}>Loading {dayName} task... ⏳</div>

  if(!task) return <div style={{background:'#000', minHeight:'100vh', color:'white', padding:20, textAlign:'center'}}>
    <h2>No task for {dayName} today 😴</h2>
    <p style={{color:'#888', fontSize:13}}>Admin hasn't added {dayName} task in weekly_tasks</p>
  </div>

  const DayComponent = DAY_COMPONENTS[dayName] || Monday

  return <DayComponent task={task} user={user} dayName={dayName} />
}