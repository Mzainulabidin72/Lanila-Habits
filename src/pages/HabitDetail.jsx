import {useState} from 'react';import {sb,ok} from '../lib/supabase';import {today,addD,dow,sched,st,streaks,cons} from '../lib/habits';import {toast} from '../lib/theme';
const IC=['💧','💻','📖','🏃','😴','🧘','💰','⭐'],CA=['Kesehatan','Produktivitas','Belajar','Kebugaran','Spiritual','Keuangan','Tidur','Personal'];
const F={daily:'Setiap hari',weekdays:'Hari kerja',weekends:'Akhir pekan'},L={'var(--ok)':'selesai','var(--wa)':'sebagian','var(--ms)':'terlewat'};
const back={display:'inline-flex',alignItems:'center',textDecoration:'none'};
function Edit({h,load,onClose}){
 const[f,setF]=useState({name:h.name,icon:h.icon,category:h.category,frequency:h.frequency,target:String(h.target_value),unit:h.unit}),[err,setErr]=useState(''),[busy,setBusy]=useState(false);
 const u=k=>e=>setF({...f,[k]:e.target.value});
 const save=async e=>{e.preventDefault();setErr('');if(!f.name.trim())return setErr('Nama kebiasaan wajib diisi.');setBusy(true);
  try{await ok(sb.from('lh_habits').update({name:f.name.trim(),icon:f.icon,category:f.category,frequency:f.frequency,target_value:Math.max(+f.target||1,0.01),unit:f.unit.trim()}).eq('id',h.id));await load();toast('Perubahan tersimpan');onClose()}catch(x){setErr(x.message);setBusy(false)}};
 return <form className="card" onSubmit={save}>
  <label htmlFor="en">Nama</label><input id="en" maxLength={80} value={f.name} onChange={u('name')}/>
  <div className="row"><div className="sp"><label htmlFor="ei">Ikon</label><select id="ei" value={f.icon} onChange={u('icon')}>{[...new Set([h.icon,...IC])].map(i=><option key={i}>{i}</option>)}</select></div>
   <div className="sp"><label htmlFor="ec">Kategori</label><select id="ec" value={f.category} onChange={u('category')}>{[...new Set([h.category,...CA])].map(i=><option key={i}>{i}</option>)}</select></div></div>
  <label htmlFor="eq">Frekuensi</label><select id="eq" value={f.frequency} onChange={u('frequency')}>{Object.entries(F).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select>
  <div className="row"><div className="sp"><label htmlFor="et">Target</label><input id="et" type="number" min="0.01" step="any" value={f.target} onChange={u('target')}/></div>
   <div className="sp"><label htmlFor="eu">Satuan</label><input id="eu" value={f.unit} onChange={u('unit')}/></div></div>
  <p className="mu">Riwayat penyelesaian tidak dihapus. Mengubah target atau frekuensi akan mengubah cara hari-hari lalu dinilai.</p>
  <div className="err" role="alert">{err}</div><div className="row"><button className="btn p" disabled={busy}>Simpan</button><button type="button" className="btn" onClick={onClose}>Batal</button></div></form>;
}
export default function HabitDetail({id,habits,comp,load}){
 const[edit,setEdit]=useState(false),h=habits.find(x=>String(x.id)===id);
 if(!h)return <><h1>Kebiasaan tidak ditemukan</h1><a className="btn" style={back} href="#habits">Kembali</a></>;
 const t=today(),s=streaks(comp,h),c30=cons(comp,h,30);
 let n=0,k=0;for(let d=h.start_date;d<=t;d=addD(d,1)){if(!sched(h,d))continue;const done=st(comp,h,d)==='done';if(d===t&&!done)continue;n++;if(done)k++}
 const mon=addD(t,-((dow(t)+6)%7)),days=[...Array(42)].map((_,i)=>addD(mon,i-35));
 const col=d=>{if(d>t||!sched(h,d))return null;const x=st(comp,h,d);return x==='done'?'var(--ok)':x==='part'?'var(--wa)':'var(--ms)'};
 const stat=(v,l)=><div className="card" style={{marginBottom:0}}><b style={{fontSize:'1.4rem'}}>{v}</b><div className="mu">{l}</div></div>;
 return <><a className="mu" href="#habits">‹ Kebiasaan</a>
  <div className="row"><div className="ic" aria-hidden="true">{h.icon}</div><div className="sp"><h1>{h.name}</h1><div className="mu">{h.category} · {F[h.frequency]} · Target {h.target_value===1&&!h.unit?'selesai/belum':`${h.target_value} ${h.unit}`}</div></div>
   {!edit&&<button className="btn" onClick={()=>setEdit(true)}>Edit</button>}</div>
  {edit&&<Edit h={h} load={load} onClose={()=>setEdit(false)}/>}
  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.75rem',margin:'1rem 0'}}>
   {stat('🔥 '+s.cur+' hari','Streak saat ini')}{stat(s.best+' hari','Streak terbaik')}{stat(c30==null?'–':c30+'%','Konsistensi 30 hari')}{stat(k,'Total selesai')}</div>
  <div className="card"><div className="row"><b className="sp">Tingkat penyelesaian</b><b>{n?Math.round(k/n*100):0}%</b></div><div className="bar"><i style={{width:(n?Math.round(k/n*100):0)+'%'}}/></div><div className="mu">{k} dari {n} hari terjadwal</div></div>
  <h2>Riwayat 6 minggu</h2><div className="card"><div className="grid" style={{marginBottom:5}}>{['Sen','Sel','Rab','Kam','Jum','Sab','Min'].map(x=><span key={x} className="mu" style={{textAlign:'center'}}>{x}</span>)}</div>
   <div className="grid">{days.map(d=>{const c=col(d);return <div key={d} className="cell" aria-label={`${d}: ${c?L[c]:'tidak terjadwal'}`} title={d} style={{display:'grid',placeItems:'center',...(c?{background:c,color:'#fff'}:{background:'transparent',border:'1px dashed var(--bd)'}),...(d===t?{outline:'2px solid var(--ac)'}:{})}}>{+d.slice(8)}</div>})}</div>
   <p className="mu">Hijau: selesai · Kuning: sebagian · Abu-abu: terlewat · Garis putus: tidak terjadwal</p></div></>;
}
