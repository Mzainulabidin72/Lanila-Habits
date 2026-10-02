import {useState,useEffect,useCallback} from 'react';import {sb,ok} from '../lib/supabase';import {today,addD,sched,st} from '../lib/habits';import {toast} from '../lib/theme';
const CA=['Kesehatan','Produktivitas','Belajar','Kebugaran','Spiritual','Keuangan','Tidur','Personal'],ST={active:'Aktif',completed:'Selesai',paused:'Dijeda'};
const prog=(comp,habits,ids,start)=>{const t=today();let n=0,k=0;habits.filter(h=>ids.includes(h.id)).forEach(h=>{for(let d=start>h.start_date?start:h.start_date;d<=t;d=addD(d,1)){if(!sched(h,d))continue;const x=st(comp,h,d)==='done';if(d===t&&!x)continue;n++;if(x)k++}});return n?Math.round(k/n*100):0};
function Form({habits,onDone,onClose}){
 const[f,setF]=useState({name:'',description:'',category:'Personal',target_date:'',ids:[]}),[err,setErr]=useState(''),[busy,setBusy]=useState(false);
 const u=k=>e=>setF({...f,[k]:e.target.value}),tg=id=>setF({...f,ids:f.ids.includes(id)?f.ids.filter(x=>x!==id):[...f.ids,id]});
 const save=async e=>{e.preventDefault();setErr('');if(!f.name.trim())return setErr('Nama target wajib diisi.');if(!f.ids.length)return setErr('Pilih minimal satu kebiasaan.');setBusy(true);
  try{const r=await ok(sb.from('lh_goals').insert({name:f.name.trim(),description:f.description.trim(),category:f.category,start_date:today(),target_date:f.target_date||null}).select('id').single());
   await ok(sb.from('lh_goal_habits').insert(f.ids.map(h=>({goal_id:r.id,habit_id:h}))));await onDone()}catch(x){setErr(x.message);setBusy(false)}};
 return <form className="card" onSubmit={save}>
  <label htmlFor="gn">Nama target</label><input id="gn" maxLength={80} placeholder="Lebih konsisten" value={f.name} onChange={u('name')}/>
  <label htmlFor="gd">Deskripsi (opsional)</label><textarea id="gd" rows="2" maxLength={500} value={f.description} onChange={u('description')}/>
  <div className="row"><div className="sp"><label htmlFor="gc">Kategori</label><select id="gc" value={f.category} onChange={u('category')}>{CA.map(c=><option key={c}>{c}</option>)}</select></div>
   <div className="sp"><label htmlFor="gt">Tanggal target</label><input id="gt" type="date" min={today()} value={f.target_date} onChange={u('target_date')}/></div></div>
  <b>Kebiasaan terkait</b>{habits.map(h=><label key={h.id} className="row" style={{minHeight:44}}><input type="checkbox" style={{width:22,minHeight:22,margin:0}} checked={f.ids.includes(h.id)} onChange={()=>tg(h.id)}/> {h.icon} {h.name}</label>)}
  <div className="err" role="alert">{err}</div><div className="row"><button className="btn p" disabled={busy}>Simpan target</button><button type="button" className="btn" onClick={onClose}>Batal</button></div></form>;
}
export default function Goals({habits,comp}){
 const[g,setG]=useState(null),[gh,setGh]=useState([]),[form,setForm]=useState(false),[err,setErr]=useState('');
 const load=useCallback(async()=>{try{const[a,b]=await Promise.all([ok(sb.from('lh_goals').select('*').order('id',{ascending:false})),ok(sb.from('lh_goal_habits').select('goal_id,habit_id'))]);setG(a);setGh(b);setErr('')}catch{setG([]);setErr('Data target gagal dimuat. Pastikan migration_goals.sql sudah dijalankan.')}},[]);
 useEffect(()=>{load()},[load]);
 const setStatus=async(id,status)=>{try{await ok(sb.from('lh_goals').update({status}).eq('id',id));await load()}catch(e){toast(e.message)}};
 const del=async id=>{if(!confirm('Hapus target ini? Kebiasaan dan riwayatnya tetap aman.'))return;try{await ok(sb.from('lh_goals').delete().eq('id',id));await load()}catch(e){toast(e.message)}};
 return <><div className="row"><h1 className="sp">Target</h1>{!form&&habits.length>0&&<button className="btn p" onClick={()=>setForm(true)}>Tambah</button>}</div>
  {err&&<div className="card err" role="alert">{err}</div>}
  {form&&<Form habits={habits} onClose={()=>setForm(false)} onDone={async()=>{setForm(false);await load()}}/>}
  {g===null?<div className="card" aria-busy="true">Memuat…</div>:g.length?g.map(x=>{const ids=gh.filter(r=>r.goal_id===x.id).map(r=>r.habit_id),p=prog(comp,habits,ids,x.start_date);
   return <div key={x.id} className="card"><div className="row"><b className="sp">{x.name}</b><b>{p}%</b></div>{x.description&&<div className="mu">{x.description}</div>}
    <div className="bar" style={{margin:'.6rem 0'}} role="progressbar" aria-valuenow={p} aria-valuemin="0" aria-valuemax="100"><i style={{width:p+'%'}}/></div>
    <div className="mu">{x.category}{x.target_date?` · target ${x.target_date}`:''} · {habits.filter(h=>ids.includes(h.id)).map(h=>h.icon+' '+h.name).join(', ')||'Belum ada kebiasaan aktif'}</div>
    <div className="row" style={{marginTop:'.6rem'}}><select style={{margin:0}} aria-label="Status target" value={x.status} onChange={e=>setStatus(x.id,e.target.value)}>{Object.entries(ST).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select><button className="btn" onClick={()=>del(x.id)} aria-label={'Hapus '+x.name}>Hapus</button></div></div>})
   :!form&&!err&&<div className="card" style={{textAlign:'center'}}><p>{habits.length?'Ubah niatmu jadi target.':'Buat kebiasaan dulu, lalu hubungkan ke target.'}</p>{habits.length?<button className="btn p" onClick={()=>setForm(true)}>Buat target</button>:<a className="btn p" style={{display:'inline-flex',alignItems:'center',textDecoration:'none'}} href="#new">Buat kebiasaan</a>}</div>}</>;
}
