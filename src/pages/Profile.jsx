import {useState} from 'react';import {sb} from '../lib/supabase';import {today,sched,st,streaks,weekDays,weekRate,periodStats} from '../lib/habits';import {achievements} from '../lib/achievements';
import {toast,getTheme,setTheme} from '../lib/theme';import {pushSupported,enablePush,disablePush} from '../lib/push';import PasswordCard from '../components/PasswordCard';import Icon from '../components/Icon';
const OKT=['image/jpeg','image/png','image/webp','image/gif'],fj=d=>new Date(d).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Jakarta'});
const resize=f=>new Promise((res,rej)=>{const i=new Image(),u=URL.createObjectURL(f);i.onload=()=>{const s=Math.min(1,256/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=i.width*s;c.height=i.height*s;c.getContext('2d').drawImage(i,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(b=>b?res(b):rej(),'image/jpeg',.85)};i.onerror=()=>rej();i.src=u});
export default function Profile({user,habits,paused=[],comp,load}){
 const[name,setName]=useState(user.name),[busy,setBusy]=useState(false),[err,setErr]=useState(''),[pv,setPv]=useState(null),[ph,setPh]=useState(false),[perr,setPerr]=useState('');
 const[rm,setRm]=useState(localStorage.getItem('rm')!=='off'),[push,setPush]=useState(localStorage.getItem('push')==='on'),[pb,setPb]=useState(false),[th,setTh]=useState(getTheme());
 const t=today(),sc=habits.filter(h=>sched(h,t)),dn=sc.filter(h=>st(comp,h,t)==='done').length,done=achievements(habits,comp)[0][3];
 const best=Math.max(0,...habits.map(h=>streaks(comp,h).best)),cur=Math.max(0,...habits.map(h=>streaks(comp,h).cur)),ps=periodStats(comp,habits,30),c30=ps.n?Math.round(ps.k/ps.n*100):null,wr=weekRate(weekDays(comp,habits));
 const dirty=name.trim()!==user.name;
 const pick=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;setPerr('');if(!OKT.includes(f.type))return setPerr('Format foto harus JPG, PNG, WebP, atau GIF.');if(f.size>5e6)return setPerr('Ukuran foto maksimal 5 MB.');
  try{const b=await resize(f);if(pv)URL.revokeObjectURL(pv.url);setPv({b,url:URL.createObjectURL(b)})}catch{setPerr('Foto tidak dapat dibaca. Coba file lain.')}};
 const cancel=()=>{if(pv)URL.revokeObjectURL(pv.url);setPv(null);setPerr('')};
 const savePhoto=async()=>{setPh(true);setPerr('');
  try{const path=user.id+'/avatar.jpg',{error}=await sb.storage.from('avatars').upload(path,pv.b,{upsert:true,contentType:'image/jpeg'});if(error)throw 0;
   const url=sb.storage.from('avatars').getPublicUrl(path).data.publicUrl+'?v='+Date.now(),r=await sb.auth.updateUser({data:{avatar_url:url}});if(r.error)throw 0;cancel();await load();toast('Foto profil diperbarui')}
  catch{setPerr('Foto gagal diunggah. Pastikan migration_profile.sql sudah dijalankan, lalu coba lagi.')}setPh(false)};
 const saveName=async e=>{e.preventDefault();const n=name.trim();setErr('');if(n.length<2)return setErr('Nama minimal 2 karakter.');setBusy(true);
  const{error}=await sb.auth.updateUser({data:{name:n}});setBusy(false);if(error)return setErr('Gagal menyimpan. Coba lagi.');await load();toast('Profil diperbarui')};
 const editFocus=()=>{const el=document.getElementById('pn');el?.scrollIntoView({behavior:'smooth',block:'center'});el?.focus()};
 const stat=(ic,l,v,s)=><div className="card"><span className="mu row" style={{gap:6}}><span style={{color:'var(--ac)'}}><Icon n={ic} s={16}/></span>{l}</span><b>{v}</b><span className="mu">{s}</span></div>;
 const bar=(l,v,txt)=><div style={{marginBottom:'.8rem'}}><div className="row mu" style={{marginBottom:4}}><span className="sp">{l}</span><b style={{color:'var(--tx)'}}>{txt}</b></div><div className="bar" role="progressbar" aria-label={l} aria-valuenow={v||0} aria-valuemin="0" aria-valuemax="100"><i style={{width:(v||0)+'%'}}/></div></div>;
 const chk=(l,on,fn,dis)=><label className="row" style={{minHeight:44}}><input type="checkbox" style={{width:22,minHeight:22,margin:0}} checked={on} disabled={dis} onChange={fn}/> {l}</label>;
 return <div className="prp"><h1 style={{margin:0}}>Profil</h1>
  <section className="panel" style={{marginTop:'1rem'}}><div className="row" style={{flexWrap:'wrap',gap:'1.2rem',alignItems:'center'}}>
    {(pv?.url||user.avatar)?<img src={pv?pv.url:user.avatar} alt="Foto profil" width="96" height="96" style={{borderRadius:'50%',objectFit:'cover',flex:'none'}}/>:<div className="ic" style={{width:96,height:96,borderRadius:'50%',fontSize:'2.2rem',flex:'none'}} aria-hidden="true">{user.name[0].toUpperCase()}</div>}
    <div className="sp" style={{minWidth:220}}><h2 style={{margin:0}}>{user.name}</h2><div className="mu">{user.email}</div><div className="mu">Bergabung sejak {fj(user.since)}</div>
     <div className="row" style={{flexWrap:'wrap',marginTop:'.7rem'}}>{pv?<><button className="btn p" disabled={ph} aria-busy={ph} onClick={savePhoto}>{ph?'Mengunggah…':'Simpan foto'}</button><button className="btn" disabled={ph} onClick={cancel}>Batal</button></>
      :<label className="btn" style={{display:'inline-flex',alignItems:'center',position:'relative',cursor:'pointer'}}>Ganti foto<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={pick} style={{position:'absolute',inset:0,opacity:0,cursor:'pointer'}}/></label>}
      <button className="btn" onClick={editFocus}>Edit profil</button></div>
     {pv&&<p className="mu" style={{margin:'.5rem 0 0'}}>Pratinjau foto. Foto baru dipakai setelah kamu menekan Simpan foto.</p>}{perr&&<p className="err" role="alert" style={{margin:'.4rem 0 0'}}>{perr}</p>}</div></div></section>
  <div className="stats">{stat('checkc','Total Kebiasaan',habits.length+paused.length,paused.length?`${paused.length} dijeda`:'Aktif')}{stat('check','Aktivitas Selesai',done,'Sepanjang waktu')}{stat('flame','Streak Terpanjang',`${best} hari`,'Rekor')}{stat('chart','Konsistensi',c30==null?'–':c30+'%','30 hari terakhir')}</div>
  <div className="pgrid"><div style={{display:'grid',gap:'1.2rem'}}>
    <form className="panel" style={{margin:0}} onSubmit={saveName} noValidate><h2 style={{marginTop:0}}>Informasi Akun</h2>
     <label htmlFor="pn">Nama tampilan</label><input id="pn" maxLength={80} autoComplete="name" value={name} onChange={e=>setName(e.target.value)}/>
     <label htmlFor="pe">Email</label><input id="pe" value={user.email} disabled readOnly/><p className="mu" style={{margin:'-.4rem 0 .7rem',fontSize:'.85rem'}}>Email tidak dapat diubah dari sini karena perubahan email memerlukan verifikasi.</p>
     <label htmlFor="pj">Tanggal bergabung</label><input id="pj" value={fj(user.since)} disabled readOnly/>
     <div className="err" role="alert">{err}</div><div className="row" style={{flexWrap:'wrap'}}><button className="btn p" disabled={busy||!dirty} aria-busy={busy}>{busy?'Menyimpan…':'Simpan perubahan'}</button>{dirty&&<span className="mu" role="status">Perubahan belum disimpan</span>}</div></form>
    <section className="panel" style={{margin:0}}><h2 style={{marginTop:0}}>Keamanan</h2><PasswordCard/></section></div>
   <div style={{display:'grid',gap:'1.2rem'}}>
    <section className="panel" style={{margin:0}}><h2 style={{marginTop:0}}>Ringkasan Progres</h2>{bar('Hari ini',sc.length?Math.round(dn/sc.length*100):0,`${dn}/${sc.length} kebiasaan`)}{bar('Minggu ini',wr,wr==null?'–':wr+'%')}<div className="mu">Streak saat ini: <b style={{color:'var(--tx)'}}>{cur} hari</b></div></section>
    <section className="panel" style={{margin:0}}><h2 style={{marginTop:0}}>Preferensi</h2>
     {chk('Aktifkan pengingat kebiasaan',rm,e=>{setRm(e.target.checked);localStorage.setItem('rm',e.target.checked?'on':'off')})}
     {pushSupported()&&chk('Pengingat push (saat browser tertutup)',push,async e=>{const on=e.target.checked;setPb(true);try{on?await enablePush():await disablePush();setPush(on)}catch(x){toast(x.message||'Gagal mengubah push notification.')}setPb(false)},pb)}
     <label htmlFor="pt">Tampilan</label><select id="pt" value={th} onChange={e=>{setTh(e.target.value);setTheme(e.target.value)}}><option value="system">Ikuti sistem</option><option value="light">Terang</option><option value="dark">Gelap</option></select>
     <button className="btn" style={{marginTop:'.4rem'}} onClick={()=>{if(confirm('Keluar dari akun Lanila di perangkat ini?'))sb.auth.signOut({scope:'local'})}}>Keluar dari akun</button></section></div></div></div>;
}
