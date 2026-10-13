import {useState} from 'react';import {sb} from '../lib/supabase';import {toast} from '../lib/theme';import PasswordInput from './PasswordInput';
// Ganti password lewat Supabase Auth (updateUser). Password tidak pernah disimpan di klien; "berhasil" hanya jika server mengonfirmasi.
export default function PasswordCard(){
 const[p,setP]=useState(''),[p2,setP2]=useState(''),[err,setErr]=useState(''),[done,setDone]=useState(false),[busy,setBusy]=useState(false);
 const save=async e=>{e.preventDefault();if(busy)return;setErr('');setDone(false);
  if(p.length<8)return setErr('Password minimal 8 karakter.');if(p!==p2)return setErr('Konfirmasi password tidak cocok.');
  setBusy(true);const{error}=await sb.auth.updateUser({password:p});setBusy(false);
  if(error)return setErr('Gagal mengubah password. Coba masuk ulang lalu ulangi.');setP('');setP2('');setDone(true);toast('Password diperbarui')};
 return <form className="card" onSubmit={save} noValidate style={{margin:0}}><b>Ganti password</b>
  <label htmlFor="np">Password baru</label><PasswordInput id="np" autoComplete="new-password" aria-describedby="nph" aria-invalid={!!err&&p.length<8} value={p} onChange={e=>setP(e.target.value)}/>
  <div id="nph" className="mu" style={{fontSize:'.85rem',margin:'-.4rem 0 .7rem'}}>Minimal 8 karakter.</div>
  <label htmlFor="np2">Konfirmasi password</label><PasswordInput id="np2" autoComplete="new-password" aria-invalid={!!err&&p!==p2} value={p2} onChange={e=>setP2(e.target.value)}/>
  <div className="err" role="alert">{err}</div>{done&&<p role="status" style={{color:'var(--ok)',margin:'0 0 .6rem'}}>Password berhasil diperbarui.</p>}
  <button className="btn p" disabled={busy} aria-busy={busy}>{busy?'Menyimpan…':'Simpan password'}</button></form>;
}
