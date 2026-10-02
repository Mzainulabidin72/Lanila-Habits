import {useState} from 'react';import {sb} from '../lib/supabase';import {streaks} from '../lib/habits';import {toast} from '../lib/theme';
const resize=f=>new Promise((res,rej)=>{const i=new Image(),u=URL.createObjectURL(f);i.onload=()=>{const s=Math.min(1,256/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=i.width*s;c.height=i.height*s;c.getContext('2d').drawImage(i,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(b=>b?res(b):rej(),'image/jpeg',.85)};i.onerror=rej;i.src=u});
export default function Profile({user,habits,comp,load}){
 const[name,setName]=useState(user.name),[busy,setBusy]=useState(false),[err,setErr]=useState('');
 const done=Object.entries(comp).filter(([k,v])=>{const h=habits.find(x=>String(x.id)===k.split('|')[0]);return h&&v>=h.target_value}).length,cur=Math.max(0,...habits.map(h=>streaks(comp,h).cur));
 const saveName=async e=>{e.preventDefault();if(!name.trim())return setErr('Nama tidak boleh kosong.');setBusy(true);setErr('');
  const{error}=await sb.auth.updateUser({data:{name:name.trim()}});setBusy(false);if(error)return setErr('Gagal menyimpan. Coba lagi.');await load();toast('Profil diperbarui')};
 const pick=async e=>{const file=e.target.files[0];e.target.value='';if(!file)return;if(!file.type.startsWith('image/')||file.size>5e6)return setErr('Pilih gambar maksimal 5 MB.');setBusy(true);setErr('');
  try{const b=await resize(file),path=user.id+'/avatar.jpg',{error}=await sb.storage.from('avatars').upload(path,b,{upsert:true,contentType:'image/jpeg'});if(error)throw 0;
   const url=sb.storage.from('avatars').getPublicUrl(path).data.publicUrl+'?v='+Date.now(),r=await sb.auth.updateUser({data:{avatar_url:url}});if(r.error)throw 0;await load();toast('Foto diperbarui')}
  catch{setErr('Foto gagal diunggah. Pastikan migration_profile.sql sudah dijalankan.')}setBusy(false)};
 const stat=(v,l)=><div className="card sp" style={{marginBottom:0}}><b style={{fontSize:'1.3rem'}}>{v}</b><div className="mu">{l}</div></div>;
 return <><h1>Profil</h1><div className="card row">
  {user.avatar?<img src={user.avatar} alt="Foto profil" width="88" height="88" style={{borderRadius:'50%',objectFit:'cover'}}/>:<div className="ic" style={{width:88,height:88,borderRadius:'50%',fontSize:'2rem'}} aria-hidden="true">{user.name[0].toUpperCase()}</div>}
  <div className="sp"><b>{user.name}</b><div className="mu">{user.email}</div><div className="mu">Anggota sejak {new Date(user.since).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Jakarta'})}</div>
   <label className="btn" style={{display:'inline-flex',alignItems:'center',marginTop:6,position:'relative'}}>{busy?'Memproses…':'Ganti foto'}<input type="file" accept="image/*" disabled={busy} onChange={pick} style={{position:'absolute',inset:0,opacity:0,cursor:'pointer'}}/></label></div></div>
  <div className="row" style={{margin:'.75rem 0'}}>{stat(habits.length,'Kebiasaan')}{stat(done,'Selesai')}{stat('🔥 '+cur,'Streak')}</div>
  <form className="card" onSubmit={saveName}><label htmlFor="pn">Nama</label><input id="pn" maxLength={80} value={name} onChange={e=>setName(e.target.value)}/>
   <div className="err" role="alert">{err}</div><button className="btn p" disabled={busy}>Simpan</button></form></>;
}
