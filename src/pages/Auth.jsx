import {useState} from 'react';import {sb} from '../lib/supabase';
export default function Auth({onDone}){
 const[mode,setMode]=useState('login'),[f,setF]=useState({name:'',email:'',p:'',p2:''}),[show,setShow]=useState(false),[err,setErr]=useState(''),[info,setInfo]=useState(''),[busy,setBusy]=useState(false);
 const reg=mode==='register',fg=mode==='forgot',u=k=>e=>setF({...f,[k]:e.target.value}),type=show?'text':'password',sw=m=>{setMode(m);setErr('');setInfo('')};
 const go=async e=>{e.preventDefault();setErr('');setInfo('');const email=f.email.trim();
  if(fg){if(!email)return setErr('Isi email kamu.');setBusy(true);await sb.auth.resetPasswordForEmail(email,{redirectTo:location.origin});setBusy(false);return setInfo('Jika email terdaftar, tautan reset sudah dikirim. Cek inbox kamu.')}
  if(reg&&(!f.name.trim()||f.p.length<8))return setErr('Isi nama dan password minimal 8 karakter.');
  if(reg&&f.p!==f.p2)return setErr('Konfirmasi password tidak cocok.');
  setBusy(true);
  if(reg){const{data,error}=await sb.auth.signUp({email,password:f.p,options:{data:{name:f.name.trim()}}});
   if(error)setErr(/registered/i.test(error.message)?'Email sudah terdaftar di akun Lanila. Silakan masuk.':'Pendaftaran gagal. Periksa data lalu coba lagi.');
   else if(!data.session){setMode('login');setInfo('Akun dibuat. Cek email untuk konfirmasi, lalu masuk.')}else{const m=await onDone();if(m)setErr(m)}}
  else{const{error}=await sb.auth.signInWithPassword({email,password:f.p});
   if(error)setErr(/confirm/i.test(error.message)?'Email belum dikonfirmasi. Cek inbox kamu.':'Email atau password salah.');else{const m=await onDone();if(m)setErr(m)}}
  setBusy(false)};
 return <div className="auth"><img className="logo" src="/logo.png" alt="Lanila Habits" style={{height:44}}/><h1>{fg?'Reset password':reg?'Buat akun':'Masuk'}</h1><p className="mu">{fg?'Kami kirim tautan untuk membuat password baru.':'Satu akun untuk semua aplikasi Lanila.'}</p>
  <form onSubmit={go} noValidate>
   {reg&&<><label htmlFor="n">Nama lengkap</label><input id="n" autoComplete="name" value={f.name} onChange={u('name')}/></>}
   <label htmlFor="e">Email</label><input id="e" type="email" autoComplete="email" value={f.email} onChange={u('email')}/>
   {!fg&&<><label htmlFor="p">Password</label><input id="p" type={type} autoComplete={reg?'new-password':'current-password'} value={f.p} onChange={u('p')}/></>}
   {reg&&<><label htmlFor="p2">Konfirmasi password</label><input id="p2" type={type} autoComplete="new-password" value={f.p2} onChange={u('p2')}/></>}
   {!fg&&<label className="row"><input type="checkbox" style={{width:22,minHeight:22,margin:0}} checked={show} onChange={e=>setShow(e.target.checked)}/> Tampilkan password</label>}
   <div className="err" role="alert">{err}</div>{info&&<p role="status" style={{color:'var(--ok)'}}>{info}</p>}
   <button className="btn p" style={{width:'100%'}} disabled={busy}>{busy?'Memproses…':fg?'Kirim tautan reset':reg?'Daftar':'Masuk'}</button></form>
  <p className="mu" style={{textAlign:'center'}}>{mode==='login'&&<><a href="#" style={{color:'var(--ac)'}} onClick={e=>{e.preventDefault();sw('forgot')}}>Lupa password?</a><br/></>}
   <a href="#" style={{color:'var(--ac)'}} onClick={e=>{e.preventDefault();sw(mode==='login'?'register':'login')}}>{mode==='login'?'Belum punya akun? Daftar':'Kembali ke halaman masuk'}</a></p></div>;
}
