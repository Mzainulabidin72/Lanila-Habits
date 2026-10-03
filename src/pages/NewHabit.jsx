import {useState} from 'react';import {sb,ok} from '../lib/supabase';import {today} from '../lib/habits';import ReminderFields from '../components/ReminderFields';
const IC=['💧','💻','📖','🏃','😴','🧘','💰','⭐'],CA=['Kesehatan','Produktivitas','Belajar','Kebugaran','Spiritual','Keuangan','Tidur','Personal'];
export default function NewHabit({load}){
 const[f,setF]=useState({name:'',icon:IC[0],category:CA[0],frequency:'daily',target:'1',unit:'',rem:false,time:'20:00'}),[err,setErr]=useState(''),[busy,setBusy]=useState(false);
 const u=k=>e=>setF({...f,[k]:e.target.value});
 const save=async e=>{e.preventDefault();setErr('');if(!f.name.trim())return setErr('Nama kebiasaan wajib diisi.');setBusy(true);
  try{await ok(sb.from('lh_habits').insert({name:f.name.trim(),icon:f.icon,category:f.category,frequency:f.frequency,target_value:Math.max(+f.target||1,0.01),unit:f.unit.trim(),start_date:today(),reminder_enabled:f.rem,reminder_time:f.rem?f.time:null}));await load();location.hash='home'}catch(x){setErr(x.message);setBusy(false)}};
 return <><h1>Kebiasaan baru</h1><form className="card" onSubmit={save}>
  <label htmlFor="hn">Nama</label><input id="hn" maxLength={80} placeholder="Coding 1 jam" value={f.name} onChange={u('name')}/>
  <div className="row"><div className="sp"><label htmlFor="hi">Ikon</label><select id="hi" value={f.icon} onChange={u('icon')}>{IC.map(i=><option key={i}>{i}</option>)}</select></div>
   <div className="sp"><label htmlFor="hc">Kategori</label><select id="hc" value={f.category} onChange={u('category')}>{CA.map(i=><option key={i}>{i}</option>)}</select></div></div>
  <label htmlFor="hq">Frekuensi</label><select id="hq" value={f.frequency} onChange={u('frequency')}><option value="daily">Setiap hari</option><option value="weekdays">Hari kerja</option><option value="weekends">Akhir pekan</option></select>
  <div className="row"><div className="sp"><label htmlFor="ht">Target (1 = selesai/belum)</label><input id="ht" type="number" min="0.01" step="any" value={f.target} onChange={u('target')}/></div>
   <div className="sp"><label htmlFor="hu">Satuan (opsional)</label><input id="hu" placeholder="liter, menit" value={f.unit} onChange={u('unit')}/></div></div>
  <ReminderFields f={f} setF={setF}/><div className="err" role="alert">{err}</div><button className="btn p" disabled={busy}>Simpan kebiasaan</button></form></>;
}
