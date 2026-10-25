import {useState} from 'react';import {sb} from '../lib/supabase';import {toast} from '../lib/theme';import {useT} from '../lib/i18n';import AuthLayout from '../components/AuthLayout';import PasswordInput from '../components/PasswordInput';
export default function ResetPassword({onDone}){
 const t=useT(),[p,setP]=useState(''),[p2,setP2]=useState(''),[err,setErr]=useState(''),[busy,setBusy]=useState(false);
 const save=async e=>{e.preventDefault();setErr('');if(p.length<8)return setErr(t('pw.short'));if(p!==p2)return setErr(t('pw.match'));
  setBusy(true);const{error}=await sb.auth.updateUser({password:p});setBusy(false);
  if(error)return setErr(t('rp.fail'));toast(t('toast.pw'));onDone()};
 return <AuthLayout><h1>{t('rp.title')}</h1><form onSubmit={save} noValidate>
  <label htmlFor="rp">{t('pw.new')}</label><PasswordInput id="rp" autoComplete="new-password" value={p} onChange={e=>setP(e.target.value)}/>
  <label htmlFor="rp2">{t('pw.confirm')}</label><PasswordInput id="rp2" autoComplete="new-password" value={p2} onChange={e=>setP2(e.target.value)}/>
  <div className="err" role="alert">{err}</div><button className="btn lb" style={{width:'100%'}} disabled={busy}>{busy?t('saving'):t('pw.save')}</button></form></AuthLayout>;
}
