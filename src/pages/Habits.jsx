import {useState} from 'react';import {sb,ok} from '../lib/supabase';import {streaks,cons} from '../lib/habits';import {toast} from '../lib/theme';import Empty from '../components/Empty';
const F={daily:'Setiap hari',weekdays:'Hari kerja',weekends:'Akhir pekan'};
export default function Habits({habits,paused=[],comp,load}){
 const[sort,setSort]=useState('new'),[cat,setCat]=useState('all'),[stt,setStt]=useState('active');
 const setStatus=async(id,s)=>{try{await ok(sb.from('lh_habits').update({status:s}).eq('id',id));await load()}catch(e){toast(e.message)}};
 const arch=id=>{if(confirm('Arsipkan kebiasaan ini? Riwayat penyelesaian tetap tersimpan.'))setStatus(id,'archived')};
 const pick=s=>{setStt(s);setCat('all')},src=stt==='paused'?paused:habits,cats=[...new Set(src.map(h=>h.category))];
 const rows=src.filter(h=>cat==='all'||h.category===cat).map(h=>({h,s:streaks(comp,h),c:cons(comp,h,30)}))
  .sort((a,b)=>sort==='name'?a.h.name.localeCompare(b.h.name):sort==='streak'?b.s.cur-a.s.cur:sort==='cons'?(b.c??-1)-(a.c??-1):b.h.id-a.h.id);
 const head=<div className="row"><h1 className="sp">Kebiasaan saya</h1><a className="btn p" style={{display:'flex',alignItems:'center',textDecoration:'none'}} href="#new">Tambah</a></div>;
 if(!habits.length&&!paused.length)return <>{head}<Empty msg="Bangun kebiasaan pertamamu hari ini."/></>;
 return <>{head}
  <div className="row" role="group" aria-label="Status" style={{marginBottom:'.7rem'}}>{[['active','Aktif',habits.length],['paused','Dijeda',paused.length]].map(([k,l,n])=><button key={k} className={'btn '+(stt===k?'p':'')} aria-pressed={stt===k} onClick={()=>pick(k)}>{l} ({n})</button>)}</div>
  {src.length>1&&<div className="row"><div className="sp"><label htmlFor="fc">Kategori</label><select id="fc" value={cat} onChange={e=>setCat(e.target.value)}><option value="all">Semua</option>{cats.map(c=><option key={c}>{c}</option>)}</select></div>
   <div className="sp"><label htmlFor="fs">Urutkan</label><select id="fs" value={sort} onChange={e=>setSort(e.target.value)}><option value="new">Terbaru</option><option value="name">Nama</option><option value="streak">Streak</option><option value="cons">Konsistensi</option></select></div></div>}
  {src.length?rows.map(({h,s,c})=><div key={h.id} className="card h"><div className="ic">{h.icon}</div>
   <div className="sp"><a href={'#habit/'+h.id} style={{color:'inherit',fontWeight:700,textDecoration:'none'}}>{h.name}</a><div className="mu">{h.category} · {F[h.frequency]} · 🔥 {s.cur} (terbaik {s.best}) · Konsistensi {c==null?'–':c+'%'}</div></div>
   <button className="btn" onClick={()=>setStatus(h.id,stt==='paused'?'active':'paused')} aria-label={(stt==='paused'?'Lanjutkan ':'Jeda ')+h.name}>{stt==='paused'?'Lanjutkan':'Jeda'}</button>
   <button className="btn" onClick={()=>arch(h.id)} aria-label={'Arsipkan '+h.name}>Arsipkan</button></div>):<div className="card mu" style={{textAlign:'center'}}>{stt==='paused'?'Tidak ada kebiasaan yang dijeda.':'Semua kebiasaan sedang dijeda.'}</div>}</>;
}
