import {createClient} from 'jsr:@supabase/supabase-js@2';
import webpush from 'npm:web-push@3.6.7';
const sb=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
webpush.setVapidDetails(Deno.env.get('VAPID_SUBJECT')??'mailto:admin@lanila.app',Deno.env.get('VAPID_PUBLIC_KEY')!,Deno.env.get('VAPID_PRIVATE_KEY')!);
const fmt=(x:number)=>String(Math.floor(x/60)).padStart(2,'0')+':'+String(x%60).padStart(2,'0');
Deno.serve(async req=>{
 if(req.headers.get('x-cron-secret')!==Deno.env.get('CRON_SECRET'))return new Response('forbidden',{status:403});
 const now=new Date(),date=now.toLocaleDateString('en-CA',{timeZone:'Asia/Jakarta'}),hm=now.toLocaleTimeString('en-GB',{timeZone:'Asia/Jakarta',hour:'2-digit',minute:'2-digit'});
 const m=+hm.slice(0,2)*60+ +hm.slice(3,5),dow=new Date(date+'T00:00:00Z').getUTCDay();
 // jendela 10 menit ke belakang; lh_push_sent mencegah kirim ganda
 const {data:habits}=await sb.from('lh_habits').select('id,user_id,name,icon,frequency,target_value').eq('status','active').eq('reminder_enabled',true).lte('start_date',date).gte('reminder_time',fmt(Math.max(0,m-10))).lte('reminder_time',fmt(m));
 const due=(habits??[]).filter(h=>h.frequency==='daily'||(h.frequency==='weekdays'?dow>0&&dow<6:dow%6===0));
 if(!due.length)return Response.json({sent:0});
 const {data:comp}=await sb.from('lh_completions').select('habit_id,value').eq('date',date).in('habit_id',due.map(h=>h.id));
 const done=new Set((comp??[]).filter(c=>c.value>=due.find(h=>h.id===c.habit_id)!.target_value).map(c=>c.habit_id));
 let sent=0;
 for(const h of due){
  if(done.has(h.id))continue;
  const {error}=await sb.from('lh_push_sent').insert({habit_id:h.id,date});if(error)continue;
  const {data:subs}=await sb.from('lh_push_subs').select('endpoint,p256dh,auth').eq('user_id',h.user_id);
  for(const s of subs??[]){
   try{await webpush.sendNotification({endpoint:s.endpoint,keys:{p256dh:s.p256dh,auth:s.auth}},JSON.stringify({title:'Lanila Habits',body:`Waktunya: ${h.name} ${h.icon}`,url:'/#home'}));sent++}
   catch(e){if([404,410].includes((e as {statusCode?:number}).statusCode??0))await sb.from('lh_push_subs').delete().eq('endpoint',s.endpoint)}}}
 return Response.json({sent});
});
