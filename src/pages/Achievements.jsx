import {useState,useEffect} from 'react';import {sb} from '../lib/supabase';import {today,addD,streaks,cons} from '../lib/habits';
export default function Achievements({habits,comp}){
 const[gd,setGd]=useState(0);
 useEffect(()=>{sb.from('lh_goals').select('id',{count:'exact',head:true}).eq('status','completed').then(({count})=>setGd(count||0))},[]);
 const t=today(),best=Math.max(0,...habits.map(h=>streaks(comp,h).best)),cm=Math.max(0,...habits.filter(h=>h.start_date<=addD(t,-13)).map(h=>cons(comp,h,30)||0));
 const done=Object.entries(comp).filter(([k,v])=>{const h=habits.find(x=>String(x.id)===k.split('|')[0]);return h&&v>=h.target_value}).length;
 const A=[['👣','First Step','Selesaikan kebiasaan pertamamu.',done,1],['🔥','7 Day Streak','Pertahankan satu kebiasaan 7 hari terjadwal berturut-turut.',best,7],['🏗️','30 Day Builder','Pertahankan satu kebiasaan 30 hari terjadwal berturut-turut.',best,30],['🎯','Consistency Master','Capai konsistensi 90% dalam 30 hari terakhir.',cm,90],['💯','Habit Builder','Selesaikan 100 aktivitas kebiasaan.',done,100],['🏆','Goal Crusher','Selesaikan target pertamamu.',gd,1]];
 const open=A.filter(a=>a[3]>=a[4]).length;
 return <><h1>Pencapaian</h1><p className="mu">{open} dari {A.length} terbuka</p>
  {A.map(a=>{const u=a[3]>=a[4],p=Math.min(100,Math.round(a[3]/a[4]*100));return <div key={a[1]} className={'card h '+(u?'done':'')} style={u?{}:{opacity:.75}}>
   <div className="ic" aria-hidden="true">{u?a[0]:'🔒'}</div><div className="sp"><b>{a[1]}</b><div className="mu">{a[2]}</div>
   <div className="bar" style={{marginTop:6}} role="progressbar" aria-valuenow={p} aria-valuemin="0" aria-valuemax="100"><i style={{width:p+'%'}}/></div></div><b>{u?'✓':Math.min(a[3],a[4])+'/'+a[4]}</b></div>})}</>;
}
