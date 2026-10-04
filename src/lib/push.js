import {sb,ok} from './supabase';
const key=import.meta.env.VITE_VAPID_PUBLIC_KEY;
const b64=s=>{const r=atob((s+'='.repeat((4-s.length%4)%4)).replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from(r,c=>c.charCodeAt(0))};
export const pushSupported=()=>!!key&&'serviceWorker' in navigator&&'PushManager' in window&&typeof Notification!=='undefined';
export async function enablePush(){
 if(await Notification.requestPermission()!=='granted')throw Error('Izin notifikasi ditolak di browser.');
 const reg=await navigator.serviceWorker.register('/sw.js');await navigator.serviceWorker.ready;
 const sub=(await reg.pushManager.getSubscription())||await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64(key)});
 const j=sub.toJSON();
 await ok(sb.from('lh_push_subs').upsert({endpoint:j.endpoint,p256dh:j.keys.p256dh,auth:j.keys.auth},{onConflict:'endpoint'}));
 localStorage.setItem('push','on');
}
export async function disablePush(){
 const reg=await navigator.serviceWorker.getRegistration('/sw.js'),sub=reg&&await reg.pushManager.getSubscription();
 if(sub){await ok(sb.from('lh_push_subs').delete().eq('endpoint',sub.endpoint));await sub.unsubscribe()}
 localStorage.setItem('push','off');
}
