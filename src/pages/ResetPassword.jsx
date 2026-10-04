import {useState} from 'react';import {sb} from '../lib/supabase';import {toast} from '../lib/theme';import AuthLayout from '../components/AuthLayout';import {appFromUrl} from '../lib/apps';
export default function ResetPassword({onDone}){
 const[p,setP]=useState(''),[p2,setP2]=useState(''),[err,setErr]=useState(''),[busy,setBusy]=useState(false);
 const save=async e=>{e.preventDefault();setErr('');if(p.length<8)return setErr('Password minimal 8 karakter.');if(p!==p2)return setErr('Konfirmasi password tidak cocok.');
  setBusy(true);const{error}=await sb.auth.updateUser({password:p});setBusy(false);
  if(error)return setErr('Gagal mengubah password. Minta tautan reset baru lalu coba lagi.');toast('Password berhasil diubah');onDone()};
 return <AuthLayout app={appFromUrl()}><h1>Password baru</h1>
  <form onSubmit={save} noValidate><label htmlFor="rp">Password baru</label><input id="rp" type="password" autoComplete="new-password" value={p} onChange={e=>setP(e.target.value)}/>
   <label htmlFor="rp2">Konfirmasi password</label><input id="rp2" type="password" autoComplete="new-password" value={p2} onChange={e=>setP2(e.target.value)}/>
   <div className="err" role="alert">{err}</div><button className="btn lb" style={{width:'100%'}} disabled={busy}>Simpan password</button></form></AuthLayout>;
}
