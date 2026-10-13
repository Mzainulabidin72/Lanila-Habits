import {useState,useEffect} from 'react';import {sb} from '../lib/supabase';import {getTheme,setTheme,toast} from '../lib/theme';import {pushSupported,enablePush,disablePush} from '../lib/push';
import AppLauncher from '../components/AppLauncher';import PasswordCard from '../components/PasswordCard';import Icon from '../components/Icon';
const fj=d=>new Date(d).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Jakarta'});
const TH=[['light','Terang','sun'],['dark','Gelap','moon'],['system','Sistem','sliders']];
const PM={unsupported:'Browser ini tidak mendukung notifikasi.',default:'Izin notifikasi belum diberikan. Kamu akan diminta izin setelah menekan tombol di bawah.',granted:'Izin notifikasi aktif.',denied:'Notifikasi diblokir di pengaturan browser. Pengingat tetap tampil di dalam aplikasi saat terbuka.'};
const chk=(l,on,fn,dis)=><label className="row" style={{minHeight:44}}><input type="checkbox" style={{width:22,minHeight:22,margin:0}} checked={on} disabled={dis} onChange={fn}/> {l}</label>;
export default function Settings({user,habits=[]}){
 const[th,setTh]=useState(getTheme()),[rm,setRm]=useState(localStorage.getItem('rm')!=='off'),[perm,setPerm]=useState(typeof Notification==='undefined'?'unsupported':Notification.permission),[push,setPush]=useState(localStorage.getItem('push')==='on'),[pb,setPb]=useState(false);
 useEffect(()=>{const f=()=>setTh(getTheme());window.addEventListener('lh-theme',f);return()=>window.removeEventListener('lh-theme',f)},[]);
 const nRem=habits.filter(h=>h.reminder_enabled&&h.reminder_time).length,P=pushSupported();
 return <div className="stgp"><h1 style={{margin:0}}>Pengaturan</h1><p className="mu" style={{margin:'.2rem 0 1.2rem'}}>Kelola akun, tampilan, keamanan, dan pengingatmu.</p>
  <div className="pgrid"><div style={{display:'grid',gap:'1.2rem'}}>
    <section className="panel" style={{margin:0}}><h2 style={{marginTop:0}}>Ringkasan Akun</h2><div className="row" style={{flexWrap:'wrap',gap:'1rem'}}>
      {user.avatar?<img src={user.avatar} alt="Foto profil" width="64" height="64" style={{borderRadius:'50%',objectFit:'cover',flex:'none'}}/>:<div className="ic" style={{width:64,height:64,borderRadius:'50%',fontSize:'1.6rem',flex:'none'}} aria-hidden="true">{user.name[0].toUpperCase()}</div>}
      <div className="sp" style={{minWidth:180}}><b style={{fontSize:'1.1rem'}}>{user.name}</b><div className="mu" style={{overflowWrap:'anywhere'}}>{user.email}</div><div className="mu">Anggota sejak {fj(user.since)}</div>
       <div style={{marginTop:'.4rem'}}><span className={'bdg '+(user.verified?'ok':'')}>{user.verified?'Email terverifikasi':'Email belum diverifikasi'}</span></div></div></div>
     <a className="btn" style={{display:'inline-flex',alignItems:'center',textDecoration:'none',marginTop:'.9rem'}} href="#profile">Kelola profil & foto</a></section>
    <section className="panel" style={{margin:0}}><h2 style={{marginTop:0}}>Tampilan & Bahasa</h2><b id="thl" style={{fontSize:'.9rem'}}>Tema</b>
     <div className="row" role="radiogroup" aria-labelledby="thl" style={{flexWrap:'wrap',margin:'.4rem 0 1rem'}}>{TH.map(([k,l,ic])=><button key={k} role="radio" aria-checked={th===k} className={'btn '+(th===k?'p':'')} style={{display:'inline-flex',alignItems:'center',gap:6}} onClick={()=>{setTheme(k);setTh(k)}}><Icon n={ic} s={16}/>{l}</button>)}</div>
     <div className="row"><b className="sp" style={{fontSize:'.9rem'}}>Bahasa</b><span>Bahasa Indonesia</span></div><p className="mu" style={{margin:'.3rem 0 0',fontSize:'.85rem'}}>Bahasa lain belum didukung. Pilihan tema tersimpan di perangkat ini.</p></section></div>
   <div style={{display:'grid',gap:'1.2rem'}}>
    <section className="panel" style={{margin:0}}><h2 style={{marginTop:0}}>Keamanan</h2><PasswordCard/></section>
    <section className="panel" style={{margin:0}}><h2 style={{marginTop:0}}>Pengingat Kebiasaan</h2>
     {chk('Aktifkan pengingat saat aplikasi terbuka',rm,e=>{setRm(e.target.checked);localStorage.setItem('rm',e.target.checked?'on':'off')})}
     <p className="mu" style={{margin:'.2rem 0 .8rem'}}>{nRem?`${nRem} kebiasaan memiliki pengingat.`:'Belum ada kebiasaan dengan pengingat.'} Jam dan hari pengingat diatur untuk tiap kebiasaan di halaman <a href="#habits" style={{color:'var(--ac)'}}>Kebiasaan</a>; kebiasaan hanya diingatkan pada hari terjadwalnya.</p>
     {P&&chk('Pengingat push (tetap muncul saat browser tertutup)',push,async e=>{const on=e.target.checked;setPb(true);try{on?await enablePush():await disablePush();setPush(on);setPerm(Notification.permission)}catch(x){toast(x.message||'Gagal mengubah push notification.')}setPb(false)},pb)}
     <div style={{borderTop:'1px solid var(--bd)',paddingTop:'.7rem',marginTop:'.4rem'}}><b style={{fontSize:'.9rem'}}>Izin notifikasi browser</b><p className="mu" style={{margin:'.2rem 0 .6rem'}}>{PM[perm]}</p>
      {perm==='default'&&<button className="btn" onClick={()=>Notification.requestPermission().then(setPerm)}>Izinkan notifikasi browser</button>}
      <p className="mu" style={{margin:'.6rem 0 0',fontSize:'.85rem'}}>{P&&push?'Pengingat push aktif: notifikasi dikirim dari server walau aplikasi ditutup.':'Tanpa pengingat push, notifikasi hanya muncul saat Lanila Habits terbuka di browser.'} Pengaturan ini tersimpan di perangkat ini.</p></div></section></div></div>
  <section className="panel" style={{marginTop:'1.2rem'}}><h2 style={{marginTop:0}}>Ekosistem Lanila</h2><p className="mu" style={{margin:0}}>Satu akun untuk semua aplikasi Lanila. Hanya aplikasi yang sudah tersedia yang dapat dibuka.</p><AppLauncher/></section>
  <section className="panel dng" style={{marginTop:'1.2rem'}}><h2 style={{marginTop:0}}>Tindakan Akun</h2><p className="mu" style={{margin:'0 0 .8rem'}}>Keluar akan mengakhiri sesi di perangkat ini. Datamu tetap tersimpan.</p>
   <button className="btn dg" onClick={()=>{if(confirm('Keluar dari akun Lanila di perangkat ini?'))sb.auth.signOut({scope:'local'})}}>Keluar dari akun</button></section></div>;
}
