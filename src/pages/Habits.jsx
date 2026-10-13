import {useState,useEffect} from 'react';import {sb,ok} from '../lib/supabase';import {today,addD,dow,sched,st,streaks,cons,dayRatio,weekDays,weekRate} from '../lib/habits';import {toast} from '../lib/theme';
import {REC} from '../lib/templates';import Icon from '../components/Icon';import ReminderFields from '../components/ReminderFields';
const F={daily:'Setiap hari',weekdays:'Hari kerja',weekends:'Akhir pekan'},DN=['Sen','Sel','Rab','Kam','Jum','Sab','Min'];
const SY={done:'✓',part:'•',miss:'×',open:'',none:''},SL={done:'selesai',part:'sebagian',miss:'terlewat',open:'akan datang / belum',none:'tidak terjadwal'};
const lnk={display:'inline-flex',alignItems:'center',gap:6,textDecoration:'none'};
function TplForm({tpl,onClose,load}){
 const[c,r]=tpl,[f,setF]=useState({name:r[1],frequency:'daily',target:String(r[3]),unit:r[4],rem:false,time:'08:00'}),[busy,setBusy]=useState(false),[err,setErr]=useState('');
 const u=k=>e=>setF({...f,[k]:e.target.value});
 const save=async e=>{e.preventDefault();if(busy)return;setErr('');if(!f.name.trim())return setErr('Nama kebiasaan wajib diisi.');setBusy(true);
  try{await ok(sb.from('lh_habits').insert({name:f.name.trim(),icon:r[0],category:c,frequency:f.frequency,target_value:Math.max(+f.target||1,0.01),unit:f.unit.trim(),start_date:today(),reminder_enabled:f.rem,reminder_time:f.rem?f.time:null}));toast('Kebiasaan ditambahkan');await load();onClose()}catch(x){setErr(x.message);setBusy(false)}};
 return <form className="card" onSubmit={save} style={{borderColor:'var(--ac)'}}><b>{r[0]} Atur kebiasaan · {c}</b><p className="mu" style={{margin:'.2rem 0 .6rem'}}>{r[2]} Kebiasaan baru dibuat setelah kamu menekan Simpan.</p>
  <label htmlFor="tn">Nama</label><input id="tn" maxLength={80} value={f.name} onChange={u('name')}/>
  <label htmlFor="tf">Frekuensi</label><select id="tf" value={f.frequency} onChange={u('frequency')}>{Object.entries(F).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select>
  <div className="row"><div className="sp"><label htmlFor="tt">Target</label><input id="tt" type="number" min="0.01" step="any" value={f.target} onChange={u('target')}/></div><div className="sp"><label htmlFor="tu">Satuan</label><input id="tu" value={f.unit} onChange={u('unit')}/></div></div>
  <ReminderFields f={f} setF={setF}/><div className="err" role="alert">{err}</div><div className="row"><button className="btn p" disabled={busy}>{busy?'Menyimpan…':'Simpan'}</button><button type="button" className="btn" onClick={onClose}>Batal</button></div></form>;
}
function Row({h,comp,t,paused,archived,restore,setV,setStatus,arch}){
 if(archived)return <div className="card h"><div className="ic" aria-hidden="true">{h.icon}</div><div className="sp"><b>{h.name}</b><div className="mu">{h.category} · {F[h.frequency]} · Diarsipkan</div></div><button className="btn" onClick={()=>restore(h.id)} aria-label={'Pulihkan '+h.name}>Pulihkan</button></div>;
 const sc=sched(h,t),s=st(comp,h,t),done=s==='done',k=streaks(comp,h),c=cons(comp,h,30);
 return <div className={'card h '+(done&&!paused?'done':'')}><div className="ic" aria-hidden="true">{h.icon}</div>
  <div className="sp"><a className="hn" href={'#habit/'+h.id}>{h.name}</a><div className="mu">{h.category} · {F[h.frequency]}{h.reminder_enabled&&h.reminder_time?' · '+h.reminder_time.slice(0,5):''}</div>
   <div className="mu">🔥 {k.cur} hari{c!=null?` · ${c}% (30 hari)`:''}{paused?' · Dijeda':!sc?' · Tidak terjadwal hari ini':s==='part'?' · Sebagian':''}</div></div>
  {!paused&&sc&&<button className="chk" aria-pressed={done} aria-label={(done?'Batalkan ':'Selesaikan ')+h.name} onClick={()=>setV(h.id,done?0:h.target_value)}>{done?'✓':''}</button>}
  <details className="menu"><summary aria-label={'Aksi untuk '+h.name}>⋯</summary><div className="menu-l"><a href={'#habit/'+h.id}>Edit</a><button onClick={()=>setStatus(h.id,paused?'active':'paused')}>{paused?'Lanjutkan':'Jeda'}</button><button onClick={()=>arch(h.id)}>Arsipkan</button></div></details></div>;
}
export default function Habits({habits,paused=[],comp,load,setV}){
 const[q,setQ]=useState(''),[cat,setCat]=useState('all'),[stt,setStt]=useState('active'),[sort,setSort]=useState('new'),[tpl,setTpl]=useState(false),[pick,setPick]=useState(null),[tc,setTc]=useState('all'),[wo,setWo]=useState(0),[arc,setArc]=useState([]);
 const t=today(),total=habits.length+paused.length+arc.length;
 useEffect(()=>{let on=true;sb.from('lh_habits').select('*').eq('status','archived').order('id',{ascending:false}).then(({data})=>{if(on)setArc(data||[])});return()=>{on=false}},[habits,paused]);
 const restore=async id=>{try{await ok(sb.from('lh_habits').update({status:'active'}).eq('id',id));toast('Kebiasaan dipulihkan');await load()}catch(e){toast(e.message)}};
 const setStatus=async(id,s)=>{try{await ok(sb.from('lh_habits').update({status:s}).eq('id',id));await load()}catch(e){toast(e.message)}};
 const arch=id=>{if(confirm('Arsipkan kebiasaan ini? Riwayat penyelesaian tetap tersimpan.'))setStatus(id,'archived')};
 // Konsistensi minggu ini = kebiasaan selesai ÷ kebiasaan terjadwal, Senin s/d hari ini, semua kebiasaan aktif. Hari tidak terjadwal tidak dihitung.
 const rate=weekRate(weekDays(comp,habits,0));
 const sc=habits.filter(h=>sched(h,t)),dn=sc.filter(h=>st(comp,h,t)==='done').length,best=Math.max(0,...habits.map(h=>streaks(comp,h).best));
 const src=stt==='paused'?paused:stt==='archived'?arc:habits,cats=[...new Set([...habits,...paused,...arc].map(h=>h.category))],wk=weekDays(comp,habits,wo),filtered=q||cat!=='all';
 const rows=src.filter(h=>(cat==='all'||h.category===cat)&&h.name.toLowerCase().includes(q.trim().toLowerCase())).map(h=>({h,s:streaks(comp,h),c:cons(comp,h,30)}))
  .sort((a,b)=>sort==='name'?a.h.name.localeCompare(b.h.name):sort==='streak'?b.s.cur-a.s.cur:sort==='cons'?(b.c??-1)-(a.c??-1):b.h.id-a.h.id);
 const show=tpl||total===0,items=(tc==='all'?Object.keys(REC):[tc]).flatMap(c=>REC[c].map(r=>[c,r]));
 const stat=(ic,l,v,sub)=><div className="card"><span className="mu row" style={{gap:6}}><span style={{color:'var(--ac)'}}><Icon n={ic} s={16}/></span>{l}</span><b>{v}</b><span className="mu">{sub}</span></div>;
 return <><div className="row" style={{flexWrap:'wrap'}}><div className="sp" style={{minWidth:240}}><h1 style={{margin:0}}>Kebiasaan saya</h1><p className="mu" style={{margin:'.2rem 0 0'}}>Bangun konsistensi melalui kebiasaan kecil setiap hari.</p></div>
   <a className="btn p" style={lnk} href="#new"><Icon n="plus" s={16}/>Tambah kebiasaan</a><button className="btn" aria-expanded={show} onClick={()=>setTpl(!tpl)} disabled={total===0}>Jelajahi template</button></div>
  <div className="stats">{stat('checkc','Kebiasaan aktif',habits.length,paused.length?`${paused.length} dijeda`:'Terjadwal & berjalan')}{stat('check','Selesai hari ini',`${dn}/${sc.length}`,sc.length?'Dari yang terjadwal':'Tidak ada jadwal')}{stat('flame','Streak terbaik',`${best} hari`,best?'Rekor kebiasaanmu':'Belum ada')}{stat('chart','Konsistensi minggu ini',rate==null?'–':rate+'%','Selesai ÷ terjadwal')}</div>
  <div className="dash2">
   {total===0?<section className="panel s6" style={{textAlign:'center',padding:'2rem 1rem'}}><div style={{color:'var(--ac)'}}><Icon n="checkc" s={40}/></div><h2 style={{margin:'.6rem 0 .3rem'}}>Mulai dari satu kebiasaan kecil</h2><p className="mu" style={{maxWidth:460,margin:'0 auto 1rem'}}>Kebiasaan kecil yang diulang setiap hari membangun konsistensi. Mulai dari satu, lalu tambah pelan-pelan.</p>
     <div className="row" style={{justifyContent:'center',flexWrap:'wrap'}}><a className="btn p" style={lnk} href="#new">Buat kebiasaan</a><button className="btn" onClick={()=>document.getElementById('tpl')?.scrollIntoView({behavior:'smooth'})}>Jelajahi template</button></div></section>
   :<><section className="panel s4"><div className="tb"><input type="search" aria-label="Cari kebiasaan" placeholder="Cari kebiasaan…" style={{flex:'2 1 160px'}} value={q} onChange={e=>setQ(e.target.value)}/>
     <select aria-label="Kategori" style={{flex:'1 1 120px'}} value={cat} onChange={e=>setCat(e.target.value)}><option value="all">Semua kategori</option>{cats.map(c=><option key={c}>{c}</option>)}</select>
     <select aria-label="Urutkan" style={{flex:'1 1 120px'}} value={sort} onChange={e=>setSort(e.target.value)}><option value="new">Terbaru</option><option value="name">Nama</option><option value="streak">Streak</option><option value="cons">Konsistensi</option></select></div>
     <div className="row" role="group" aria-label="Status" style={{marginBottom:'.8rem'}}>{[['active','Aktif',habits.length],['paused','Dijeda',paused.length],['archived','Terarsip',arc.length]].map(([k,l,n])=><button key={k} className={'btn '+(stt===k?'p':'')} aria-pressed={stt===k} onClick={()=>setStt(k)}>{l} ({n})</button>)}</div>
     {rows.length?rows.map(({h})=><Row key={h.id} h={h} comp={comp} t={t} paused={stt==='paused'} archived={stt==='archived'} restore={restore} setV={setV} setStatus={setStatus} arch={arch}/>)
      :<div style={{textAlign:'center',padding:'1.2rem 0'}}><b>{filtered?'Tidak ada kebiasaan yang cocok':stt==='paused'?'Tidak ada kebiasaan yang dijeda':stt==='archived'?'Tidak ada kebiasaan terarsip':paused.length?'Semua kebiasaan sedang dijeda':'Belum ada kebiasaan aktif'}</b><p className="mu">{filtered?'Coba kata kunci atau filter lain.':''}</p>{filtered&&<button className="btn" onClick={()=>{setQ('');setCat('all')}}>Reset filter</button>}</div>}</section>
    <section className="panel s2"><div className="row"><b className="sp">Progress mingguan</b><button className="btn" style={{minHeight:36,padding:'0 .6rem'}} aria-label="Minggu sebelumnya" onClick={()=>setWo(wo-1)}>‹</button><button className="btn" style={{minHeight:36,padding:'0 .6rem'}} aria-label="Minggu berikutnya" disabled={wo>=0} onClick={()=>setWo(wo+1)}>›</button></div>
     <div className="mu">{wk[0].d.slice(5)} s/d {wk[6].d.slice(5)}{wo===0?' (minggu ini)':''}</div>
     <div className="wk" style={{margin:'.7rem 0'}}>{wk.map((x,i)=><div key={x.d}><span className="mu">{DN[i]}</span><div className={'wd '+x.s+(x.today?' cur':'')} role="img" aria-label={`${DN[i]} ${x.d}${x.today?' (hari ini)':''}: ${SL[x.s]}`}>{SY[x.s]}</div></div>)}</div>
     <div className="mu" style={{fontSize:'.8rem'}}>✓ selesai · • sebagian · × terlewat · garis putus akan datang · kosong tidak terjadwal</div></section></>}
   {show&&<section id="tpl" className="panel s6"><h2 style={{margin:0}}>Rekomendasi kebiasaan</h2><p className="mu" style={{margin:'.2rem 0 .7rem'}}>Pilih template, atur sesuai kebutuhanmu, lalu simpan.</p>
     <div className="chips" role="group" aria-label="Kategori template" style={{marginTop:0}}>{['all',...Object.keys(REC)].map(c=><button key={c} className={'btn '+(tc===c?'p':'')} aria-pressed={tc===c} onClick={()=>setTc(c)}>{c==='all'?'Semua':c}</button>)}</div>
     {pick&&<TplForm key={pick[1][1]} tpl={pick} load={load} onClose={()=>setPick(null)}/>}
     <div className="tgrid">{items.map(([c,r])=>{const has=[...habits,...paused].some(h=>h.name===r[1]);return <div key={c+r[1]} className="card h" style={{margin:0}}><div className="ic" aria-hidden="true">{r[0]}</div><div className="sp"><b>{r[1]}</b><div className="mu">{r[2]}</div></div><button className="btn" disabled={has} onClick={()=>setPick([c,r])}>{has?'Sudah ada':'Gunakan template'}</button></div>})}</div></section>}
  </div></>;
}
