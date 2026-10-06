import {useState,useEffect,useCallback,useRef} from 'react';import {sb,ok,pg} from '../lib/supabase';import {today} from '../lib/habits';
export default function useData(){
 const[s,set]=useState({loading:true,user:null,habits:[],paused:[],comp:{},refl:[]}),[rec,setRec]=useState(false);
 const load=useCallback(async()=>{try{const{data:{session}}=await sb.auth.getSession();if(!session)throw 0;const u=session.user;
  const[h,c,r]=await Promise.all([ok(sb.from('lh_habits').select('*').in('status',['active','paused']).order('id')),pg(()=>sb.from('lh_completions').select('habit_id,date,value').order('id')),ok(sb.from('lh_reflections').select('date,mood,went_well,improvement').order('date',{ascending:false}).limit(60))]);
  const comp={};c.forEach(x=>{comp[x.habit_id+'|'+x.date]=x.value});
  set({loading:false,user:{id:u.id,email:u.email,name:u.user_metadata?.name||u.email.split('@')[0],since:u.created_at,avatar:u.user_metadata?.avatar_url},habits:h.filter(x=>x.status==='active'),paused:h.filter(x=>x.status==='paused'),comp,refl:r});return null}catch(x){set(p=>({...p,loading:false,user:null}));return x===0?null:'Berhasil masuk, tapi data gagal dimuat. Pastikan supabase/migration.sql sudah dijalankan di Supabase.'}},[]);
 useEffect(()=>{load();const{data:{subscription}}=sb.auth.onAuthStateChange(e=>{if(e==='PASSWORD_RECOVERY')setRec(true);if(e==='SIGNED_OUT')set(p=>({...p,user:null}))});return()=>subscription.unsubscribe()},[load]);
 const uref=useRef();uref.current=s.user;
 useEffect(()=>{const f=async()=>{if(document.visibilityState!=='visible')return;const{data:{session}}=await sb.auth.getSession(); // sinkron login/logout dari aplikasi lain
  if(!session&&uref.current)set(p=>({...p,user:null}));else if(session&&!uref.current)load()};
  document.addEventListener('visibilitychange',f);return()=>document.removeEventListener('visibilitychange',f)},[load]);
 const setV=async(id,v)=>{const d=today(),n=Number(v)||0;set(p=>({...p,comp:{...p.comp,[id+'|'+d]:n}}));
  try{await ok(sb.from('lh_completions').upsert({habit_id:id,user_id:s.user.id,date:d,value:n},{onConflict:'habit_id,date'}))}catch{load()}};
 return{...s,rec,clearRec:()=>setRec(false),load,setV};
}
