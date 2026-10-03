import {useState} from 'react';import {sb} from '../lib/supabase';import {getTheme,setTheme,toast} from '../lib/theme';
function PasswordCard(){
 const[p,setP]=useState(''),[p2,setP2]=useState(''),[err,setErr]=useState(''),[busy,setBusy]=useState(false);
 const save=async e=>{e.preventDefault();setErr('');if(p.length<8)return setErr('Password minimal 8 karakter.');if(p!==p2)return setErr('Konfirmasi password tidak cocok.');
  setBusy(true);const{error}=await sb.auth.updateUser({password:p});setBusy(false);if(error)return setErr('Gagal mengubah password. Coba masuk ulang lalu ulangi.');setP('');setP2('');toast('Password diperbarui')};
 return <form className="card" onSubmit={save} noValidate><b>Ganti password</b><label htmlFor="np">Password baru</label><input id="np" type="password" autoComplete="new-password" value={p} onChange={e=>setP(e.target.value)}/>
  <label htmlFor="np2">Konfirmasi password</label><input id="np2" type="password" autoComplete="new-password" value={p2} onChange={e=>setP2(e.target.value)}/>
  <div className="err" role="alert">{err}</div><button className="btn" disabled={busy}>Simpan password</button></form>;
}
export default function Settings({user}){
 const[th,setTh]=useState(getTheme()),[rm,setRm]=useState(localStorage.getItem('rm')!=='off'),[perm,setPerm]=useState(typeof Notification==='undefined'?'unsupported':Notification.permission);
 return <><h1>Pengaturan</h1><div className="card"><b>{user.name}</b><div className="mu">{user.email}</div></div>
  <div className="card"><label htmlFor="th">Tampilan</label><select id="th" value={th} onChange={e=>{setTh(e.target.value);setTheme(e.target.value)}}><option value="system">Ikuti sistem</option><option value="light">Terang</option><option value="dark">Gelap</option></select><p className="mu">Bahasa: Indonesia</p></div>
  <PasswordCard/><div className="card"><b>Pengingat</b><label className="row" style={{minHeight:44}}><input type="checkbox" style={{width:22,minHeight:22,margin:0}} checked={rm} onChange={e=>{setRm(e.target.checked);localStorage.setItem('rm',e.target.checked?'on':'off')}}/> Aktifkan pengingat kebiasaan</label>
  {perm==='default'&&<button className="btn" onClick={()=>Notification.requestPermission().then(setPerm)}>Izinkan notifikasi browser</button>}
  <p className="mu">{perm==='granted'?'Notifikasi browser aktif. ':perm==='denied'?'Notifikasi diblokir di browser, pengingat tampil di dalam aplikasi. ':''}Pengingat hanya muncul saat Lanila Habits terbuka di browser.</p></div>
  <button className="btn" onClick={()=>sb.auth.signOut()}>Keluar</button></>;
}
