import {useState} from 'react';import {sb} from '../lib/supabase';import {toast} from '../lib/theme';import {useT} from '../lib/i18n';import PasswordInput from './PasswordInput';
// Ganti password lewat Supabase Auth (updateUser). Password tidak pernah disimpan di klien; "berhasil" hanya jika server mengonfirmasi.
export default function PasswordCard(){
 const t=useT(),[p,setP]=useState(''),[p2,setP2]=useState(''),[err,setErr]=useState(''),[done,setDone]=useState(false),[busy,setBusy]=useState(false);
 const save=async e=>{e.preventDefault();if(busy)return;setErr('');setDone(false);
  if(p.length<8)return setErr(t('pw.short'));if(p!==p2)return setErr(t('pw.match'));
  setBusy(true);const{error}=await sb.auth.updateUser({password:p});setBusy(false);
  if(error)return setErr(t('pw.fail'));setP('');setP2('');setDone(true);toast(t('toast.pw'))};
 return <form className="card" onSubmit={save} noValidate style={{margin:0}}><b>{t('pw.title')}</b>
  <label htmlFor="np">{t('pw.new')}</label><PasswordInput id="np" autoComplete="new-password" aria-describedby="nph" aria-invalid={!!err&&p.length<8} value={p} onChange={e=>setP(e.target.value)}/>
  <div id="nph" className="mu" style={{fontSize:'.85rem',margin:'-.4rem 0 .7rem'}}>{t('pw.hint')}</div>
  <label htmlFor="np2">{t('pw.confirm')}</label><PasswordInput id="np2" autoComplete="new-password" aria-invalid={!!err&&p!==p2} value={p2} onChange={e=>setP2(e.target.value)}/>
  <div className="err" role="alert">{err}</div>{done&&<p role="status" style={{color:'var(--ok)',margin:'0 0 .6rem'}}>{t('pw.ok')}</p>}
  <button className="btn p" disabled={busy} aria-busy={busy}>{busy?t('saving'):t('pw.save')}</button></form>;
}
