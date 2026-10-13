import {useState,useEffect,useCallback} from 'react';import {sb,ok} from '../lib/supabase';import {today,addD} from '../lib/habits';import {toast} from '../lib/theme';import Icon from '../components/Icon';
const M=[[1,'😞','Sangat buruk'],[2,'😐','Kurang baik'],[3,'🙂','Biasa saja'],[4,'😄','Baik'],[5,'🤩','Sangat baik']];
const Q=['Apa hal kecil yang membuatmu bersyukur hari ini?','Apa yang kamu pelajari dari tantangan hari ini?','Apa satu hal yang ingin kamu lakukan lebih baik besok?','Apa pencapaian kecil yang patut kamu hargai?','Siapa atau apa yang membuat harimu terasa lebih ringan?','Kebiasaan mana yang paling terasa manfaatnya hari ini?'];
const MSG=['Tidak semua hari harus produktif. Mengenali dirimu sendiri sudah merupakan kemajuan.','Perubahan besar tumbuh dari langkah-langkah kecil yang kamu sadari.','Hari yang biasa pun layak dicatat. Pelan-pelan tetap bergerak maju.','Menulis membantu pikiran lebih tenang. Cukup beberapa kalimat sudah berarti.','Kamu tidak perlu sempurna, cukup jujur pada diri sendiri.'];
const fd=d=>new Date(d+'T00:00:00Z').toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
const fs=d=>new Date(d+'T00:00:00Z').toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
const lab=m=>M.find(x=>x[0]===m)||[0,'–','–'];
function Form({entry,date,t,user,onSaved,onCancel}){
 const[mood,setMood]=useState(entry?.mood||null),[w,setW]=useState(entry?.went_well||''),[i,setI]=useState(entry?.improvement||''),[err,setErr]=useState(''),[busy,setBusy]=useState(false);
 const save=async e=>{e.preventDefault();if(busy)return;setErr('');if(!mood)return setErr('Pilih suasana hatimu terlebih dahulu.');setBusy(true);
  try{await ok(sb.from('lh_reflections').upsert({user_id:user.id,date,mood,went_well:w.trim(),improvement:i.trim()},{onConflict:'user_id,date'}));await onSaved(entry?'Refleksi diperbarui':'Refleksi tersimpan')}catch(x){setErr(x.message)}setBusy(false)};
 return <form className="panel" onSubmit={save} noValidate style={{margin:0}}>
  <div className="row" style={{flexWrap:'wrap'}}><h2 className="sp" style={{margin:0}}>{date===t?'Bagaimana harimu?':'Mengedit refleksi '+fs(date)}</h2>{date!==t&&<button type="button" className="btn" onClick={onCancel}>Batal edit</button>}</div>
  <div className="mbs" role="radiogroup" aria-label="Suasana hati" style={{margin:'.8rem 0 1rem'}}>{M.map(([v,e,l])=><button key={v} type="button" role="radio" aria-checked={mood===v} className={'mb'+(mood===v?' on':'')} onClick={()=>setMood(v)}><span aria-hidden="true">{e}</span><small>{l}</small></button>)}</div>
  <label htmlFor="rw">Apa yang berjalan baik?</label><textarea id="rw" rows="5" maxLength={1000} placeholder="Apa hal baik yang terjadi hari ini?" value={w} onChange={e=>setW(e.target.value)}/><div className="mu cnt">{w.length}/1000</div>
  <label htmlFor="ri">Apa yang bisa diperbaiki besok?</label><textarea id="ri" rows="5" maxLength={1000} placeholder="Apa yang ingin kamu lakukan lebih baik besok?" value={i} onChange={e=>setI(e.target.value)}/><div className="mu cnt">{i.length}/1000</div>
  <div className="err" role="alert">{err}</div><button className="btn p" disabled={busy} aria-busy={busy}>{busy?'Menyimpan…':entry?'Perbarui Refleksi':'Simpan Refleksi'}</button></form>;
}
export default function Reflect({user,load}){
 const t=today(),[all,setAll]=useState(null),[err,setErr]=useState(''),[date,setDate]=useState(t),[qi,setQi]=useState(()=>new Date().getDate()%Q.length),[q,setQ]=useState(''),[lim,setLim]=useState(10),[open,setOpen]=useState(null);
 const fetchAll=useCallback(async()=>{try{setAll(await ok(sb.from('lh_reflections').select('*').order('date',{ascending:false}).limit(1000)));setErr('')}catch{setAll([]);setErr('Riwayat refleksi gagal dimuat. Coba muat ulang halaman.')}},[]);
 useEffect(()=>{fetchAll()},[fetchAll]);
 const list=all||[],entry=list.find(r=>r.date===date),has=new Set(list.map(r=>r.date));
 let streak=0,d=has.has(t)?t:addD(t,-1);while(has.has(d)){streak++;d=addD(d,-1)}
 const shown=list.filter(r=>!q.trim()||(r.went_well+' '+r.improvement+' '+fd(r.date)).toLowerCase().includes(q.trim().toLowerCase()));
 const del=async r=>{if(!confirm('Hapus refleksi tanggal '+fs(r.date)+'? Tindakan ini tidak dapat dibatalkan.'))return;try{await ok(sb.from('lh_reflections').delete().eq('id',r.id));if(date===r.date)setDate(t);await fetchAll();await load();toast('Refleksi dihapus')}catch(e){toast(e.message)}};
 return <div className="rfp"><div className="row" style={{flexWrap:'wrap',alignItems:'flex-end'}}><div className="sp" style={{minWidth:240}}><h1 style={{margin:0}}>Refleksi Harian</h1><p className="mu" style={{margin:'.2rem 0 0'}}>Luangkan waktu sejenak untuk memahami perjalananmu hari ini.</p></div>
   <div style={{textAlign:'right'}}><div className="mu">{fd(t)}</div><span className="chip" style={{color:has.has(t)?'var(--ok)':'var(--mu)'}}>{has.has(t)?<><Icon n="check" s={14}/>Refleksi hari ini tersimpan</>:'Belum ada refleksi hari ini'}</span></div></div>
  {err&&<div className="panel err" role="alert" style={{marginTop:'1rem'}}>{err}</div>}
  <div className="rl" style={{marginTop:'1.2rem'}}>
   {all===null?<div className="panel" aria-busy="true" style={{margin:0,minHeight:320,opacity:.5}}/>:<Form key={date+(entry?'e':'n')} entry={entry} date={date} t={t} user={user} onCancel={()=>setDate(t)} onSaved={async m=>{await fetchAll();await load();toast(m);if(date!==t)setDate(t)}}/>}
   <div style={{display:'grid',gap:'1rem'}}>
    <section className="panel" style={{margin:0}}><b>Ringkasan Refleksi</b><div className="stats" style={{gridTemplateColumns:'repeat(3,minmax(0,1fr))',margin:'.7rem 0 0'}}>
     {[['Total',list.length],['Berturut-turut',streak+' hari'],['Terakhir',list[0]?fs(list[0].date):'–']].map(([a,b])=><div key={a} className="card" style={{padding:'.7rem',minHeight:0}}><span className="mu" style={{fontSize:'.8rem'}}>{a}</span><b style={{fontSize:'1.05rem'}}>{b}</b></div>)}</div></section>
    <section className="panel" style={{margin:0}}><div className="row"><span style={{color:'var(--ac)'}}><Icon n="bulb"/></span><b className="sp">Pertanyaan Inspiratif</b></div><p style={{margin:'.6rem 0'}}>{Q[qi]}</p><button className="btn" onClick={()=>setQi((qi+1+Math.floor(Math.random()*(Q.length-1)))%Q.length)}>Ganti pertanyaan</button></section>
    <section className="panel" style={{margin:0}}><b>Pesan untukmu</b><p className="mu" style={{margin:'.5rem 0 0'}}>{MSG[new Date().getDate()%MSG.length]}</p></section></div></div>
  <section className="panel" style={{marginTop:'1.2rem'}}><div className="row" style={{flexWrap:'wrap',marginBottom:'.8rem'}}><h2 className="sp" style={{margin:0}}>Riwayat Refleksi</h2><input type="search" aria-label="Cari refleksi" placeholder="Cari refleksi…" style={{margin:0,maxWidth:280}} value={q} onChange={e=>{setQ(e.target.value);setLim(10)}}/></div>
   {all===null?<p className="mu" aria-busy="true">Memuat…</p>:!list.length?<div style={{textAlign:'center',padding:'1.2rem 0'}}><b>Belum ada refleksi</b><p className="mu">Tulis refleksi pertamamu di atas. Beberapa kalimat sudah cukup.</p></div>
   :!shown.length?<div style={{textAlign:'center',padding:'1rem 0'}}><b>Tidak ada refleksi yang cocok</b><p className="mu">Coba kata kunci lain.</p></div>
   :<>{shown.slice(0,lim).map(r=>{const [,e,l]=lab(r.mood),sum=r.went_well||r.improvement;return <div key={r.id} className="rh"><div className="row" style={{alignItems:'flex-start'}}><span style={{fontSize:'1.6rem'}} role="img" aria-label={'Suasana hati: '+l}>{e}</span>
     <div className="sp" style={{minWidth:0}}><b>{fd(r.date)}</b> <span className="mu">· {l}</span><div className={'mu'+(open===r.id?'':' clamp')}>{open===r.id?null:(sum||'Tanpa catatan.')}</div>
      {open===r.id&&<div style={{display:'grid',gap:'.5rem',marginTop:'.4rem'}}><div><span className="mu">Yang berjalan baik</span><div style={{whiteSpace:'pre-wrap'}}>{r.went_well||'–'}</div></div><div><span className="mu">Yang bisa diperbaiki besok</span><div style={{whiteSpace:'pre-wrap'}}>{r.improvement||'–'}</div></div></div>}</div>
     <div className="row" style={{flexWrap:'wrap',justifyContent:'flex-end'}}><button className="btn" aria-expanded={open===r.id} onClick={()=>setOpen(open===r.id?null:r.id)}>{open===r.id?'Tutup':'Lihat Detail'}</button><button className="btn" onClick={()=>{setDate(r.date);window.scrollTo({top:0,behavior:'smooth'})}}>Edit</button><button className="btn" onClick={()=>del(r)}>Hapus</button></div></div></div>})}
    {shown.length>lim&&<div style={{textAlign:'center',marginTop:'.8rem'}}><button className="btn" onClick={()=>setLim(lim+10)}>Muat lebih banyak</button></div>}</>}</section></div>;
}
