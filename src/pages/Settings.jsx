import {useState,useEffect} from 'react';import {sb} from '../lib/supabase';import {streaks,periodStats} from '../lib/habits';import {achievements} from '../lib/achievements';
import {getTheme,setTheme,toast} from '../lib/theme';import {pushSupported,enablePush,disablePush} from '../lib/push';import {useT,getLang,setLang} from '../lib/i18n';import {signOut} from '../lib/session';
import AppLauncher from '../components/AppLauncher';import PasswordCard from '../components/PasswordCard';import Icon from '../components/Icon';
const TH=[['light','sun'],['dark','moon'],['system','sliders']],OKT=['image/jpeg','image/png','image/webp','image/gif'];
const resize=f=>new Promise((res,rej)=>{const i=new Image(),u=URL.createObjectURL(f);i.onload=()=>{const s=Math.min(1,256/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=i.width*s;c.height=i.height*s;c.getContext('2d').drawImage(i,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(b=>b?res(b):rej(),'image/jpeg',.85)};i.onerror=()=>rej();i.src=u});
const chk=(l,on,fn,dis)=><label className="row" style={{minHeight:44}}><input type="checkbox" style={{width:22,minHeight:22,margin:0}} checked={on} disabled={dis} onChange={fn}/> {l}</label>;
// Pengaturan = Akun/Profil (foto, nama, email, ringkasan) + tampilan & bahasa + keamanan + pengingat + ekosistem + keluar.
export default function Settings({user,habits=[],paused=[],comp,load}){
 const t=useT(),lang=getLang(),loc=lang==='en'?'en-US':'id-ID',fj=d=>new Date(d).toLocaleDateString(loc,{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Jakarta'});
 const[name,setName]=useState(user.name),[busy,setBusy]=useState(false),[err,setErr]=useState(''),[pv,setPv]=useState(null),[ph,setPh]=useState(false),[perr,setPerr]=useState('');
 const[th,setTh]=useState(getTheme()),[rm,setRm]=useState(localStorage.getItem('rm')!=='off'),[perm,setPerm]=useState(typeof Notification==='undefined'?'unsupported':Notification.permission),[push,setPush]=useState(localStorage.getItem('push')==='on'),[pb,setPb]=useState(false);
 useEffect(()=>{const f=()=>setTh(getTheme());window.addEventListener('lh-theme',f);return()=>window.removeEventListener('lh-theme',f)},[]);
 const nRem=habits.filter(h=>h.reminder_enabled&&h.reminder_time).length,P=pushSupported(),done=achievements(habits,comp)[0][3],best=Math.max(0,...habits.map(h=>streaks(comp,h).best)),ps=periodStats(comp,habits,30),c30=ps.n?Math.round(ps.k/ps.n*100):null,dirty=name.trim()!==user.name;
 const pick=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;setPerr('');if(!OKT.includes(f.type))return setPerr(t('err.fmt'));if(f.size>5e6)return setPerr(t('err.size'));
  try{const b=await resize(f);if(pv)URL.revokeObjectURL(pv.url);setPv({b,url:URL.createObjectURL(b)})}catch{setPerr(t('err.read'))}};
 const cancel=()=>{if(pv)URL.revokeObjectURL(pv.url);setPv(null);setPerr('')};
 const savePhoto=async()=>{setPh(true);setPerr('');
  try{const path=user.id+'/avatar.jpg',{error}=await sb.storage.from('avatars').upload(path,pv.b,{upsert:true,contentType:'image/jpeg'});if(error)throw 0;
   const url=sb.storage.from('avatars').getPublicUrl(path).data.publicUrl+'?v='+Date.now(),r=await sb.auth.updateUser({data:{avatar_url:url}});if(r.error)throw 0;cancel();await load();toast(t('toast.photo'))}
  catch{setPerr(t('err.upload'))}setPh(false)};
 const saveName=async e=>{e.preventDefault();const n=name.trim();setErr('');if(n.length<2)return setErr(t('err.name'));setBusy(true);
  const{error}=await sb.auth.updateUser({data:{name:n}});setBusy(false);if(error)return setErr(t('err.save'));await load();toast(t('toast.profile'))};
 const stat=(l,v,s)=><div className="card" style={{margin:0}}><span className="mu">{l}</span><b style={{fontSize:'1.4rem',display:'block'}}>{v}</b><span className="mu" style={{fontSize:'.85rem'}}>{s}</span></div>;
 const rad=(opts,val,set,lbl)=><div className="row" role="radiogroup" aria-labelledby={lbl} style={{flexWrap:'wrap',margin:'.4rem 0 1rem'}}>{opts.map(([k,l,ic])=><button key={k} role="radio" aria-checked={val===k} className={'btn '+(val===k?'p':'')} style={{display:'inline-flex',alignItems:'center',gap:6}} onClick={()=>set(k)}>{ic&&<Icon n={ic} s={16}/>}{l}</button>)}</div>;
 return <div className="stgp"><h1 style={{margin:0,display:'flex',alignItems:'center',gap:'.6rem'}}><Icon n="settings" s={26}/>{t('set.title')}</h1><p className="mu" style={{margin:'.2rem 0 1.2rem'}}>{t('set.sub')}</p>
  <div className="pgrid"><div style={{display:'grid',gap:'1.2rem'}}>
    <section className="panel" style={{margin:0}}><h2 style={{marginTop:0}}>{t('acc.title')}</h2><div className="row" style={{flexWrap:'wrap',gap:'1rem'}}>
      {(pv?.url||user.avatar)?<img src={pv?pv.url:user.avatar} alt="" width="80" height="80" style={{borderRadius:'50%',objectFit:'cover',flex:'none'}}/>:<div className="ic" style={{width:80,height:80,borderRadius:'50%',fontSize:'2rem',flex:'none'}} aria-hidden="true">{user.name[0].toUpperCase()}</div>}
      <div className="sp" style={{minWidth:180}}><div className="row" style={{flexWrap:'wrap'}}>{pv?<><button className="btn p" disabled={ph} aria-busy={ph} onClick={savePhoto}>{ph?t('acc.uploading'):t('acc.photoSave')}</button><button className="btn" disabled={ph} onClick={cancel}>{t('cancel')}</button></>
       :<label className="btn" style={{display:'inline-flex',alignItems:'center',position:'relative',cursor:'pointer'}}>{t('acc.photo')}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={pick} style={{position:'absolute',inset:0,opacity:0,cursor:'pointer'}}/></label>}</div>
       {pv&&<p className="mu" style={{margin:'.5rem 0 0'}}>{t('acc.preview')}</p>}{perr&&<p className="err" role="alert" style={{margin:'.4rem 0 0'}}>{perr}</p>}</div></div>
     <form onSubmit={saveName} noValidate style={{marginTop:'1rem'}}>
      <label htmlFor="pn">{t('acc.name')}</label><input id="pn" maxLength={80} autoComplete="name" value={name} onChange={e=>setName(e.target.value)}/>
      <label htmlFor="pe">{t('acc.email')}</label><input id="pe" value={user.email} disabled readOnly/><p className="mu" style={{margin:'-.4rem 0 .7rem',fontSize:'.85rem'}}>{t('acc.emailNote')}</p>
      <div style={{marginBottom:'.7rem'}}><span className={'bdg '+(user.verified?'ok':'')}>{t(user.verified?'acc.verified':'acc.unverified')}</span></div>
      <label htmlFor="pj">{t('acc.joined')}</label><input id="pj" value={fj(user.since)} disabled readOnly/>
      <div className="err" role="alert">{err}</div><div className="row" style={{flexWrap:'wrap'}}><button className="btn p" disabled={busy||!dirty} aria-busy={busy}>{busy?t('saving'):t('acc.save')}</button>{dirty&&<span className="mu" role="status">{t('acc.unsaved')}</span>}</div></form></section>
    <section className="panel" style={{margin:0}}><h2 style={{marginTop:0}}>{t('app.title')}</h2><b id="thl" style={{fontSize:'.9rem'}}>{t('theme')}</b>{rad(TH.map(([k,ic])=>[k,t('theme.'+k),ic]),th,k=>{setTheme(k);setTh(k)},'thl')}
     <b id="lgl" style={{fontSize:'.9rem'}}>{t('lang')}</b>{rad([['id','Bahasa Indonesia'],['en','English']],lang,setLang,'lgl')}<p className="mu" style={{margin:0,fontSize:'.85rem'}}>{t('app.note')}</p></section></div>
   <div style={{display:'grid',gap:'1.2rem'}}>
    <section className="panel" style={{margin:0}}><h2 style={{marginTop:0}}>{t('sum.title')}</h2><div className="fg" style={{gap:'.75rem'}}>
      {stat(t('sum.habits'),habits.length+paused.length,paused.length?t('sum.paused',{n:paused.length}):t('sum.active'))}{stat(t('sum.done'),done,t('sum.all'))}{stat(t('sum.best'),t('sum.days',{n:best}),t('sum.record'))}{stat(t('sum.cons'),c30==null?'–':c30+'%',t('sum.30'))}</div></section>
    <section className="panel" style={{margin:0}}><h2 style={{marginTop:0}}>{t('sec.title')}</h2><PasswordCard/></section>
    <section className="panel" style={{margin:0}}><h2 style={{marginTop:0}}>{t('rem.title')}</h2>
     {chk(t('rem.toggle'),rm,e=>{setRm(e.target.checked);localStorage.setItem('rm',e.target.checked?'on':'off')})}
     <p className="mu" style={{margin:'.2rem 0 .8rem'}}>{nRem?t('rem.count',{n:nRem}):t('rem.none')} {t('rem.a')} <a href="#habits" style={{color:'var(--ac)'}}>{t('nav.habits')}</a>{t('rem.b')}</p>
     {P&&chk(t('rem.push'),push,async e=>{const on=e.target.checked;setPb(true);try{on?await enablePush():await disablePush();setPush(on);setPerm(Notification.permission)}catch(x){toast(x.message||t('err.push'))}setPb(false)},pb)}
     <div style={{borderTop:'1px solid var(--bd)',paddingTop:'.7rem',marginTop:'.4rem'}}><b style={{fontSize:'.9rem'}}>{t('perm.title')}</b><p className="mu" style={{margin:'.2rem 0 .6rem'}}>{t('perm.'+perm)}</p>
      {perm==='default'&&<button className="btn" onClick={()=>Notification.requestPermission().then(setPerm)}>{t('perm.btn')}</button>}
      <p className="mu" style={{margin:'.6rem 0 0',fontSize:'.85rem'}}>{P&&push?t('rem.pushOn'):t('rem.pushOff')} {t('rem.device')}</p></div></section></div></div>
  <section className="panel" style={{marginTop:'1.2rem'}}><h2 style={{marginTop:0}}>{t('eco.title')}</h2><p className="mu" style={{margin:0}}>{t('eco.sub')}</p><AppLauncher/></section>
  <section className="panel dng" style={{marginTop:'1.2rem'}}><h2 style={{marginTop:0}}>{t('act.title')}</h2><p className="mu" style={{margin:'0 0 .8rem'}}>{t('act.note')}</p><button className="btn dg" onClick={signOut}>{t('act.logout')}</button></section></div>;
}
