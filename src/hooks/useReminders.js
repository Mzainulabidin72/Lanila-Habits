import {useEffect,useRef} from 'react';import {today,sched,st} from '../lib/habits';import {toast} from '../lib/theme';
const hm=()=>new Date().toLocaleTimeString('en-GB',{timeZone:'Asia/Jakarta',hour:'2-digit',minute:'2-digit'});
const mins=s=>+s.slice(0,2)*60+ +s.slice(3,5);
// Pengingat saat aplikasi terbuka: cek tiap 30 dtk, tampil sekali per hari (maks. 3 jam setelah jam pengingat).
export default function useReminders(habits,comp){
 const ref=useRef({habits,comp});ref.current={habits,comp};
 useEffect(()=>{const tick=()=>{if(localStorage.getItem('rm')==='off')return;const t=today(),now=mins(hm());
  ref.current.habits.forEach(h=>{if(!h.reminder_enabled||!h.reminder_time||!sched(h,t)||st(ref.current.comp,h,t)==='done')return;
   const diff=now-mins(h.reminder_time),k=`rmd:${h.id}:${t}`;if(diff<0||diff>180||localStorage.getItem(k))return;
   localStorage.setItem(k,'1');const msg=`Waktunya: ${h.name} ${h.icon}`;
   if(typeof Notification!=='undefined'&&Notification.permission==='granted')new Notification('Lanila Habits',{body:msg,icon:'/logo.png'});else toast(msg)})};
  tick();const i=setInterval(tick,30000);return()=>clearInterval(i)},[]);
}
