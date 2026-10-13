export const today=()=>new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Jakarta'});
export const addD=(d,n)=>{const t=new Date(d+'T00:00:00Z');t.setUTCDate(t.getUTCDate()+n);return t.toISOString().slice(0,10)};
export const dow=d=>new Date(d+'T00:00:00Z').getUTCDay();
export const sched=(h,d)=>d>=h.start_date&&(h.frequency==='daily'||(h.frequency==='weekdays'?dow(d)>0&&dow(d)<6:dow(d)%6===0));
export const val=(c,h,d)=>c[h.id+'|'+d]||0;
export const st=(c,h,d)=>{const v=val(c,h,d);return v>=h.target_value?'done':v>0?'part':'miss'};
export function streaks(c,h){const t=today();let run=0,best=0;for(let d=h.start_date;d<=t;d=addD(d,1)){if(!sched(h,d))continue;if(st(c,h,d)==='done'){run++;best=Math.max(best,run)}else if(d!==t)run=0}return{cur:run,best}}
export function cons(c,h,days){const t=today();let n=0,k=0;for(let i=0;i<days;i++){const d=addD(t,-i);if(sched(h,d)){n++;if(st(c,h,d)==='done')k++}}return n?Math.round(k/n*100):null}
export const dayRatio=(c,H,d)=>{const s=H.filter(h=>sched(h,d));return s.length?{n:s.length,k:s.filter(h=>st(c,h,d)==='done').length,p:s.filter(h=>st(c,h,d)==='part').length}:null};
export const score=(c,H,d)=>{const s=H.filter(h=>sched(h,d));return s.length?Math.round(s.reduce((a,h)=>a+Math.min(val(c,h,d)/h.target_value,1),0)/s.length*100):0};
// ---- Minggu (Senin–Minggu) — satu sumber untuk Beranda & halaman Kebiasaan ----
// Status hari: none = tidak terjadwal · open = akan datang / hari ini belum selesai · done = semua terjadwal selesai
//              part = sebagian selesai · miss = terjadwal tapi tidak ada yang selesai (hari lampau).
export const weekDays=(c,H,off=0)=>{const t=today(),mon=addD(t,-((dow(t)+6)%7)+off*7);
 return[...Array(7)].map((_,i)=>{const d=addD(mon,i),r=dayRatio(c,H,d);return{d,r,today:d===t,s:!r?'none':d>t?'open':r.k===r.n?'done':r.k+r.p>0?'part':d<t?'miss':'open'}})};
// KONSISTENSI MINGGU INI = (kebiasaan selesai) ÷ (kebiasaan terjadwal), dihitung dari Senin sampai HARI INI (hari ini ikut dihitung
// sebagai kesempatan), hanya kebiasaan aktif. Hari/kebiasaan tidak terjadwal tidak dihitung terlewat. Tanpa jadwal → null (tampil "–").
export const weekRate=days=>{const t=today();let n=0,k=0;days.forEach(x=>{if(x.r&&x.d<=t){n+=x.r.n;k+=x.r.k}});return n?Math.round(k/n*100):null};
// Total peluang (n) & selesai (k) untuk sejumlah hari terakhir (termasuk hari ini) — definisi sama dengan Beranda/Statistik.
export const periodStats=(c,H,days)=>{const t=today();let n=0,k=0;H.forEach(h=>{for(let i=0;i<days;i++){const d=addD(t,-i);if(d<h.start_date||!sched(h,d))continue;n++;if(st(c,h,d)==='done')k++}});return{n,k}};
