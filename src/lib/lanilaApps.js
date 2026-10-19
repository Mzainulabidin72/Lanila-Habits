// Registry aplikasi Lanila untuk Buku Kas (selaras dengan Lanila Habits).
// Hanya URL dari env yang valid (http/https) yang dipakai — tidak pernah menerima URL dari parameter. Tanpa URL → "Segera hadir".
const env=import.meta.env;
const safe=u=>{if(!u)return null;try{const x=new URL(u,location.origin);return /^https?:$/.test(x.protocol)?x.href:null}catch{return null}};
const RAW=[
 {id:'lanila',name:'Lanila',desc:'Ekosistem aplikasi Lanila',accent:'#5b5bd6',url:env.VITE_APP_URL_LANILA},
 {id:'lanila-buku-kas',name:'Lanila Buku Kas',desc:'Kelola keuangan dengan lebih mudah',accent:'#1f9d63',self:true},
 {id:'lanila-habits',name:'Lanila Habits',desc:'Bangun kebiasaan baik setiap hari',accent:'#f08a1c',url:env.VITE_APP_URL_HABITS},
 {id:'lanila-wedding-planner',name:'Lanila Wedding Planner',desc:'Rencanakan pernikahan dengan terstruktur',accent:'#e5484d',url:env.VITE_APP_URL_WEDDING_PLANNER},
 {id:'lanila-time-blocking',name:'Lanila Time Blocking',desc:'Atur waktu dan tingkatkan produktivitas',accent:'#7c5cf0',url:env.VITE_APP_URL_TIME_BLOCKING},
 {id:'lanila-asset',name:'Lanila Asset',desc:'Pantau dan kelola aset',accent:'#0ea5b7',url:env.VITE_APP_URL_ASSET}];
export const LANILA_APPS=RAW.map(a=>{const url=a.self?null:safe(a.url);return{...a,url,icon:`/apps/${a.id}.png`,status:a.self||url?'available':'soon'}});
