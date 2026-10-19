import {useState} from 'react';import {sb} from '../lib/supabase';import AuthLayout from '../components/AuthLayout';import PasswordInput from '../components/PasswordInput';import AppSwitcher from '../components/AppSwitcher';import {appFromUrl} from '../lib/apps';
export default function Auth({onDone}){
 const[app,setApp]=useState(appFromUrl);
 const pickApp=a=>{setApp(a);const u=new URL(location.href);u.searchParams.set('app',a.id);history.replaceState(null,'',u)};
 const leave=()=>{if(!app.self&&app.url)location.assign(app.url)}; // hanya ke URL dari registry (allowlist)
 const[mode,setMode]=useState('login'),[f,setF]=useState({name:'',email:'',p:'',p2:''}),[err,setErr]=useState(''),[info,setInfo]=useState(''),[busy,setBusy]=useState(false);
 const reg=mode==='register',fg=mode==='forgot',u=k=>e=>setF({...f,[k]:e.target.value}),sw=m=>{setMode(m);setErr('');setInfo('')};
 const go=async e=>{e.preventDefault();setErr('');setInfo('');const email=f.email.trim();
  if(fg){if(!email)return setErr('Isi email kamu.');setBusy(true);await sb.auth.resetPasswordForEmail(email,{redirectTo:location.origin+'/?app='+app.id});setBusy(false);return setInfo('Jika email terdaftar, tautan reset sudah dikirim. Cek inbox kamu.')}
  if(reg&&(!f.name.trim()||f.p.length<8))return setErr('Isi nama dan password minimal 8 karakter.');
  if(reg&&f.p!==f.p2)return setErr('Konfirmasi password tidak cocok.');
  setBusy(true);
  if(reg){const{data,error}=await sb.auth.signUp({email,password:f.p,options:{data:{name:f.name.trim()},emailRedirectTo:location.origin+'/?app='+app.id}});
   if(error)setErr(/registered/i.test(error.message)?'Email sudah terdaftar di akun Lanila. Silakan masuk.':'Pendaftaran gagal. Periksa data lalu coba lagi.');
   else if(!data.session){setMode('login');setInfo('Akun dibuat. Cek email untuk konfirmasi, lalu masuk.')}else{const m=await onDone();if(m)setErr(m);else leave()}}
  else{const{error}=await sb.auth.signInWithPassword({email,password:f.p});
   if(error)setErr(/confirm/i.test(error.message)?'Email belum dikonfirmasi. Cek inbox kamu.':'Email atau password salah.');else{const m=await onDone();if(m)setErr(m);else leave()}}
  setBusy(false)};
 return <AuthLayout app={app}><AppSwitcher value={app} onChange={pickApp}/><h1>{fg?'Lupa kata sandi?':reg?'Buat Akun Lanila':'Masuk'}</h1><p className="mu">{fg?'Masukkan email yang terhubung dengan Akun Lanila kamu.':'Satu akun untuk semua aplikasi Lanila.'}</p>
  <form onSubmit={go} noValidate>
   {reg&&<><label htmlFor="n">Nama lengkap</label><input id="n" autoComplete="name" placeholder="Nama lengkap" value={f.name} onChange={u('name')}/></>}
   <label htmlFor="e">Email</label><input id="e" type="email" autoComplete="email" placeholder="nama@email.com" value={f.email} onChange={u('email')}/>
   {!fg&&<><label htmlFor="p">Kata sandi</label><PasswordInput id="p" placeholder="Masukkan kata sandi" autoComplete={reg?'new-password':'current-password'} value={f.p} onChange={u('p')}/></>}
   {reg&&<><label htmlFor="p2">Konfirmasi kata sandi</label><PasswordInput id="p2" placeholder="Ulangi kata sandi" autoComplete="new-password" value={f.p2} onChange={u('p2')}/></>}
   {mode==='login'&&<div className="fgl"><a href="#" className="alk" onClick={e=>{e.preventDefault();sw('forgot')}}>Lupa kata sandi?</a></div>}
   <div className="err" role="alert">{err}</div>{info&&<p role="status" style={{color:'var(--ok)'}}>{info}</p>}
   <button className="btn lb" style={{width:'100%'}} disabled={busy}>{busy?'Memproses…':fg?'Kirim tautan reset':reg?'Daftar':'Masuk'}</button></form>
  <p className="authx-alt">{mode==='login'?<>Belum punya akun? <a href="#" className="alk" onClick={e=>{e.preventDefault();sw('register')}}>Daftar</a></>:<a href="#" className="alk" onClick={e=>{e.preventDefault();sw('login')}}>Kembali ke halaman masuk</a>}</p></AuthLayout>;
}
