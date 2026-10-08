import {useState,useEffect} from 'react';import {sb} from '../lib/supabase';import {achievements} from '../lib/achievements';import {today,addD,streaks,cons} from '../lib/habits';
export default function Achievements({habits,comp}){
 const[gd,setGd]=useState(0);
 useEffect(()=>{sb.from('lh_goals').select('id',{count:'exact',head:true}).eq('status','completed').then(({count})=>setGd(count||0))},[]);
 const A=achievements(habits,comp,gd);
 const open=A.filter(a=>a[3]>=a[4]).length;
 return <><h1>Pencapaian</h1><p className="mu">{open} dari {A.length} terbuka</p>
  {A.map(a=>{const u=a[3]>=a[4],p=Math.min(100,Math.round(a[3]/a[4]*100));return <div key={a[1]} className={'card h '+(u?'done':'')} style={u?{}:{opacity:.75}}>
   <div className="ic" aria-hidden="true">{u?a[0]:'🔒'}</div><div className="sp"><b>{a[1]}</b><div className="mu">{a[2]}</div>
   <div className="bar" style={{marginTop:6}} role="progressbar" aria-valuenow={p} aria-valuemin="0" aria-valuemax="100"><i style={{width:p+'%'}}/></div></div><b>{u?'✓':Math.min(a[3],a[4])+'/'+a[4]}</b></div>})}</>;
}
