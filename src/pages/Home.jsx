import {useState,useEffect} from 'react';import {sb,ok} from '../lib/supabase';import {today,addD,dow,sched,st,streaks,dayRatio,cons} from '../lib/habits';import {achievements} from '../lib/achievements';import {toast} from '../lib/theme';
import HabitCard from '../components/HabitCard';import Icon from '../components/Icon';
const REC={Kesehatan:[['💧','Minum air 2L','Cukupi kebutuhan cairan harianmu.',2,'liter'],['🚶','Jalan kaki 30 menit','Gerakkan tubuh setiap hari.',30,'menit'],['😴','Tidur lebih awal','Istirahat cukup untuk energi esok hari.',1,'']],
 Belajar:[['📖','Membaca 20 menit','Tambah wawasan sedikit demi sedikit.',20,'menit'],['🗣️','Belajar bahasa Inggris','Latihan singkat setiap hari.',15,'menit'],['🎓','Membaca materi kuliah','Cicil materi agar tidak menumpuk.',30,'menit']],
 Produktivitas:[['🗓️','Rencanakan hari','Tentukan prioritas sebelum mulai.',1,''],['⏱️','Fokus 25 menit','Satu sesi kerja tanpa gangguan.',25,'menit'],['🧹','Rapikan meja kerja','Ruang rapi, pikiran lebih tenang.',1,'']],
 Spiritual:[['📖',"Membaca Al-Qur'an",'Luangkan waktu untuk tilawah.',1,''],['🌅','Dzikir pagi','Awali hari dengan tenang.',1,''],['🙏','Bersyukur','Catat satu hal yang kamu syukuri.',1,'']],
 Keuangan:[['💰','Catat pengeluaran','Pantau ke mana uangmu pergi.',1,''],['📊','Review keuangan','Tinjau kondisi keuanganmu.',1,''],['🏦','Menabung','Sisihkan sedikit setiap hari.',1,'']]};
const DN=['Sen','Sel','Rab','Kam','Jum','Sab','Min'],SL={done:'selesai',part:'sebagian',miss:'terlewat',open:'belum',none:'tidak ada jadwal'};
const MO=[[3,'😊','Baik'],[2,'😐','Biasa'],[1,'😔','Kurang baik']],lnk={display:'inline-flex',alignItems:'center',gap:6,textDecoration:'none'};
const greet=()=>{const h=+new Date().toLocaleString('en-GB',{timeZone:'Asia/Jakarta',hour:'numeric',hour12:false});return h<11?'Selamat pagi':h<15?'Selamat siang':h<19?'Selamat sore':'Selamat malam'};
function NewUser({habits,load,onSkip}){
 const[cat,setCat]=useState(null),[busy,setBusy]=useState('');
 const items=cat?REC[cat].map(r=>[cat,r]):Object.entries(REC).map(([c,v])=>[c,v[0]]);
 const add=async(c,r)=>{setBusy(r[1]);try{await ok(sb.from('lh_habits').insert({name:r[1],icon:r[0],category:c,frequency:'daily',target_value:r[3],unit:r[4],start_date:today()}));toast('Kebiasaan ditambahkan');await load()}catch(e){toast(e.message)}setBusy('')};
 const steps=[['Profil',true],['Pilih kategori',!!cat],['Buat kebiasaan 0/1',false],['Selesaikan hari 0/1',false]],pct=Math.round(steps.filter(s=>s[1]).length/4*100);
 return <><h1 style={{margin:0}}>{greet()} 👋</h1><p className="mu" style={{margin:'.2rem 0 0'}}>Mari mulai dengan satu kebiasaan kecil hari ini.</p>
  <div className="chips" role="group" aria-label="Kategori">{Object.keys(REC).map(c=><button key={c} className={'btn '+(cat===c?'p':'')} aria-pressed={cat===c} onClick={()=>setCat(cat===c?null:c)}>{c}</button>)}</div>
  <div className="dash"><section className="panel"><h2 style={{margin:0}}>Mulai membangun kebiasaanmu</h2><p className="mu" style={{margin:'.2rem 0 .8rem'}}>{cat?`Rekomendasi kategori ${cat}.`:'Rekomendasi populer. Pilih kategori untuk melihat lebih banyak.'}</p>
    {items.map(([c,r])=>{const has=habits.some(h=>h.name===r[1]);return <div key={c+r[1]} className="card h"><div className="ic" aria-hidden="true">{r[0]}</div><div className="sp"><b>{r[1]}</b><div className="mu">{r[2]}</div></div><button className="btn" disabled={has||busy===r[1]} onClick={()=>add(c,r)}>{has?'Ditambahkan ✓':'Tambah'}</button></div>})}
    <div className="row" style={{marginTop:'.8rem',flexWrap:'wrap'}}><a className="btn p" style={lnk} href="#new" onClick={onSkip}><Icon n="plus" s={16}/>Mulai membuat kebiasaan</a><button className="btn" onClick={onSkip}>Lewati untuk sekarang</button></div></section>
   <section className="panel"><b>Mulai perjalananmu</b><div style={{margin:'.7rem 0',display:'grid',gap:'.4rem'}}>{steps.map(([l,d])=><div key={l} className="row" style={{color:d?'var(--tx)':'var(--mu)'}}><span style={{color:d?'var(--ok)':'var(--mu)',width:20}}>{d?<Icon n="check" s={18}/>:'○'}</span>{l}</div>)}</div>
    <div className="bar" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100"><i style={{width:pct+'%'}}/></div></section></div></>;
}
function Dash({user,habits,comp,refl,setV,load}){
 const[qa,setQa]=useState(false),[gd,setGd]=useState(0),[q,setQ]=useState({name:'',cat:'Kesehatan'}),[busy,setBusy]=useState(false);
 useEffect(()=>{sb.from('lh_goals').select('id',{count:'exact',head:true}).eq('status','completed').then(({count})=>setGd(count||0))},[]);
 const t=today(),date=new Date().toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Jakarta'});
 const list=habits.filter(h=>sched(h,t)),dn=list.filter(h=>st(comp,h,t)==='done').length,pc=list.length?Math.round(dn/list.length*100):0;
 const all=habits.map(h=>streaks(comp,h)),cur=Math.max(0,...all.map(x=>x.cur)),best=Math.max(0,...all.map(x=>x.best));
 const mon=addD(t,-((dow(t)+6)%7)),wk=[...Array(7)].map((_,i)=>{const d=addD(mon,i),r=dayRatio(comp,habits,d);return{d,r,s:!r||d>t?'none':r.k===r.n?'done':r.k+r.p>0?'part':d<t?'miss':'open'}});
 let wn=0,wd=0;wk.forEach(x=>{if(x.r&&x.d<=t){wn+=x.r.n;wd+=x.r.k}});const rate=wn?Math.round(wd/wn*100):null;
 const un=achievements(habits,comp,gd).filter(a=>a[3]>=a[4]).slice(0,3),rf=refl.find(r=>r.date===t),sel=rf?(rf.mood>=3?3:rf.mood):null;
 const quick=async e=>{e.preventDefault();const name=q.name.trim();if(!name)return;setBusy(true);
  try{await ok(sb.from('lh_habits').insert({name,icon:'⭐',category:q.cat,frequency:'daily',target_value:1,unit:'',start_date:today()}));setQ({...q,name:''});setQa(false);await load()}catch(x){toast(x.message)}setBusy(false)};
 const mood=async m=>{try{await ok(sb.from('lh_reflections').upsert({user_id:user.id,date:t,mood:m},{onConflict:'user_id,date'}));await load();toast('Refleksi tersimpan')}catch(x){toast(x.message)}};
 return <><div className="dh"><div><h1>{greet()}, {user.name.split(' ')[0]} 👋</h1><p className="mu" style={{margin:'.2rem 0 0'}}>{date}</p></div>
   <span className="chip" style={{color:'var(--ac)'}}><Icon n="flame" s={16}/><b>{cur} hari</b></span></div>
  <div className="stats">{[['Kebiasaan hari ini',list.length,'Terjadwal'],['Selesai',`${dn}/${list.length}`,`${pc}% hari ini`],['Streak',`${cur} hari`,cur?'Berturut-turut':'Belum ada'],['Konsistensi',rate==null?'–':rate+'%','Minggu ini']].map(([a,b,c])=><div key={a} className="card"><span className="mu">{a}</span><b>{b}</b><span className="mu">{c}</span></div>)}</div>
  <div className="dash2">
   <section className="panel s4"><div className="row" style={{marginBottom:'.7rem'}}><h2 className="sp" style={{margin:0}}>Kebiasaan Hari Ini</h2><button className="btn p" style={lnk} onClick={()=>setQa(!qa)} aria-expanded={qa}><Icon n="plus" s={16}/>Tambah kebiasaan</button></div>
    {qa&&<form className="card" onSubmit={quick}><label htmlFor="qn">Nama kebiasaan</label><input id="qn" maxLength={80} autoFocus value={q.name} onChange={e=>setQ({...q,name:e.target.value})} placeholder="Mis. Jalan pagi"/>
     <div className="row" style={{flexWrap:'wrap'}}><select aria-label="Kategori" style={{margin:0,flex:1}} value={q.cat} onChange={e=>setQ({...q,cat:e.target.value})}>{[...Object.keys(REC),'Personal'].map(c=><option key={c}>{c}</option>)}</select><button className="btn p" disabled={busy}>Simpan</button><a className="mu" href="#new">Opsi lengkap</a></div></form>}
    {list.length>0&&<div style={{marginBottom:'.8rem'}}><div className="row mu" style={{marginBottom:4}}><span className="sp">{dn} dari {list.length} selesai</span><b>{pc}%</b></div><div className="bar" role="progressbar" aria-valuenow={pc} aria-valuemin="0" aria-valuemax="100"><i style={{width:pc+'%'}}/></div></div>}
    {list.length?list.map(h=><HabitCard key={h.id} h={h} d={t} comp={comp} setV={setV}/>):<div style={{textAlign:'center',padding:'1rem 0'}}><b>{habits.length?'Tidak ada kebiasaan terjadwal hari ini.':'Belum ada kebiasaan hari ini.'}</b><p className="mu">{habits.length?'Nikmati hari istirahatmu.':'Tambahkan kebiasaan pertamamu untuk mulai.'}</p></div>}</section>
   <section className="panel s2"><b>Progress minggu ini</b>{rate==null?<p className="mu">Data konsistensi akan muncul setelah kamu mulai menyelesaikan kebiasaan.</p>:<>
    <div className="wk" style={{margin:'.7rem 0'}}>{wk.map((x,i)=><div key={x.d}><span className="mu">{DN[i]}</span><div className={'wd '+x.s} role="img" aria-label={`${DN[i]}: ${SL[x.s]}`}>{x.s==='done'&&<Icon n="check" s={16}/>}</div></div>)}</div>
    <div className="mu">Penyelesaian {rate}% · Terbaik {best} hari</div></>}</section>
   <section className="panel s2 b"><div className="row"><span style={{color:'var(--ac)'}}><Icon n="flame" s={32}/></span><div className="sp"><b>{cur?'Kamu sedang dalam streak!':'Mulai streak pertamamu'}</b>
    <div className="mu">{cur?`${cur} hari berturut-turut. Pertahankan sampai besok.`:'Belum ada streak. Selesaikan satu kebiasaan hari ini.'}</div></div></div></section>
   <section className="panel s2 b"><div className="row"><b className="sp">Pencapaian</b><a className="mu" href="#achievements">Lihat semua →</a></div>
    {un.length?<div style={{display:'grid',gap:'.4rem',marginTop:'.6rem'}}>{un.map(a=><div key={a[1]} className="row"><span aria-hidden="true">{a[0]}</span>{a[1]}</div>)}</div>:<p className="mu" style={{margin:'.5rem 0 0'}}>Belum ada pencapaian. Selesaikan kebiasaan secara konsisten untuk membuka pencapaian.</p>}</section>
   <section className="panel s2 b"><div className="row"><b className="sp">Bagaimana harimu hari ini?</b><a className="mu" href="#reflect">Tulis lengkap →</a></div>
    <div className="row" style={{flexWrap:'wrap',marginTop:'.6rem'}} role="group" aria-label="Mood hari ini">{MO.map(([m,e,l])=><button key={m} className={'btn '+(sel===m?'p':'')} aria-pressed={sel===m} onClick={()=>mood(m)}>{e} {l}</button>)}</div></section>
  </div></>;
}
export default function Home(p){return !p.habits.length&&p.onboard?<NewUser habits={p.habits} load={p.load} onSkip={p.onSkip}/>:<Dash {...p}/>}
