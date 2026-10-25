import {useState} from 'react';import {sb} from '../lib/supabase';import AuthLayout from '../components/AuthLayout';import PasswordInput from '../components/PasswordInput';import {useT} from '../lib/i18n';
export default function Auth({onDone}){
 const t=useT(),[mode,setMode]=useState('login'),[f,setF]=useState({name:'',email:'',p:'',p2:''}),[err,setErr]=useState(''),[info,setInfo]=useState(''),[busy,setBusy]=useState(false);
 const reg=mode==='register',fg=mode==='forgot',u=k=>e=>setF({...f,[k]:e.target.value}),sw=m=>{setMode(m);setErr('');setInfo('')};
 const go=async e=>{e.preventDefault();setErr('');setInfo('');const email=f.email.trim();
  if(fg){if(!email)return setErr(t('au.email'));setBusy(true);await sb.auth.resetPasswordForEmail(email,{redirectTo:location.origin});setBusy(false);return setInfo(t('au.sent'))}
  if(reg&&(!f.name.trim()||f.p.length<8))return setErr(t('au.regShort'));
  if(reg&&f.p!==f.p2)return setErr(t('pw.match'));
  setBusy(true);
  if(reg){const{data,error}=await sb.auth.signUp({email,password:f.p,options:{data:{name:f.name.trim()},emailRedirectTo:location.origin}});
   if(error)setErr(/registered/i.test(error.message)?t('au.exists'):t('au.regFail'));
   else if(!data.session){setMode('login');setInfo(t('au.created'))}else{const m=await onDone();if(m)setErr(m)}}
  else{const{error}=await sb.auth.signInWithPassword({email,password:f.p});
   if(error)setErr(/confirm/i.test(error.message)?t('au.unconfirmed'):t('au.bad'));else{const m=await onDone();if(m)setErr(m)}}
  setBusy(false)};
 return <AuthLayout><h1>{fg?t('au.forgot'):reg?t('au.createT'):t('au.login')}</h1><p className="mu">{fg?t('au.forgotSub'):reg?t('au.regSub'):t('au.welcome')}</p>
  <form onSubmit={go} noValidate>
   {reg&&<><label htmlFor="n">{t('au.fullname')}</label><input id="n" autoComplete="name" placeholder={t('au.fullname')} value={f.name} onChange={u('name')}/></>}
   <label htmlFor="e">Email</label><input id="e" type="email" autoComplete="email" placeholder={t('au.emailPh')} value={f.email} onChange={u('email')}/>
   {!fg&&<><label htmlFor="p">{t('au.password')}</label><PasswordInput id="p" placeholder={t('au.pwPh')} autoComplete={reg?'new-password':'current-password'} value={f.p} onChange={u('p')}/></>}
   {reg&&<><label htmlFor="p2">{t('au.confirm')}</label><PasswordInput id="p2" placeholder={t('au.confirmPh')} autoComplete="new-password" value={f.p2} onChange={u('p2')}/></>}
   {mode==='login'&&<div className="fgl"><a href="#" className="alk" onClick={e=>{e.preventDefault();sw('forgot')}}>{t('au.forgot')}</a></div>}
   <div className="err" role="alert">{err}</div>{info&&<p role="status" style={{color:'var(--ok)'}}>{info}</p>}
   <button className="btn lb" style={{width:'100%'}} disabled={busy} aria-busy={busy}>{busy?t('au.busy'):fg?t('au.sendLink'):reg?t('au.signup'):t('au.login')}</button></form>
  <p className="authx-alt">{mode==='login'?<>{t('au.noAcc')} <a href="#" className="alk" onClick={e=>{e.preventDefault();sw('register')}}>{t('au.signup')}</a></>:<a href="#" className="alk" onClick={e=>{e.preventDefault();sw('login')}}>{t('au.back')}</a>}</p></AuthLayout>;
}
