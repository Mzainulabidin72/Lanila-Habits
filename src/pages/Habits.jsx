import {sb,ok} from '../lib/supabase';import {streaks,cons} from '../lib/habits';import {toast} from '../lib/theme';import Empty from '../components/Empty';
const F={daily:'Setiap hari',weekdays:'Hari kerja',weekends:'Akhir pekan'};
export default function Habits({habits,comp,load}){
 const arch=async id=>{if(!confirm('Arsipkan kebiasaan ini? Riwayat penyelesaian tetap tersimpan.'))return;try{await ok(sb.from('lh_habits').update({status:'archived'}).eq('id',id));await load()}catch(e){toast(e.message)}};
 return <><div className="row"><h1 className="sp">Kebiasaan saya</h1><a className="btn p" style={{display:'flex',alignItems:'center',textDecoration:'none'}} href="#new">Tambah</a></div>
  {habits.length?habits.map(h=>{const s=streaks(comp,h),c=cons(comp,h,30);return <div key={h.id} className="card h"><div className="ic">{h.icon}</div>
   <div className="sp"><a href={'#habit/'+h.id} style={{color:'inherit',fontWeight:700,textDecoration:'none'}}>{h.name}</a><div className="mu">{h.category} · {F[h.frequency]} · 🔥 {s.cur} (terbaik {s.best}) · Konsistensi {c==null?'–':c+'%'}</div></div>
   <button className="btn" onClick={()=>arch(h.id)} aria-label={'Arsipkan '+h.name}>Arsipkan</button></div>}):<Empty msg="Bangun kebiasaan pertamamu hari ini."/>}</>;
}
