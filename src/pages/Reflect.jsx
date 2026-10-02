import {useState} from 'react';import {sb,ok} from '../lib/supabase';import {today,score} from '../lib/habits';import {toast} from '../lib/theme';
const M=['😞','😐','🙂','😄','🤩'];
export default function Reflect({refl,habits,comp,user,load}){
 const t=today(),cur=refl.find(r=>r.date===t)||{};
 const[mood,setMood]=useState(cur.mood),[w,setW]=useState(cur.went_well||''),[i,setI]=useState(cur.improvement||''),[err,setErr]=useState('');
 const save=async e=>{e.preventDefault();if(!mood)return setErr('Pilih mood hari ini.');setErr('');
  try{await ok(sb.from('lh_reflections').upsert({user_id:user.id,date:t,mood,went_well:w,improvement:i},{onConflict:'user_id,date'}));await load();toast('Refleksi tersimpan')}catch(x){setErr(x.message)}};
 const prev=refl.filter(r=>r.date!==t);
 return <><h1>Refleksi harian</h1><form className="card" onSubmit={save}><b>Bagaimana harimu?</b>
  <div className="moods">{M.map((m,k)=><button type="button" key={k} className={mood===k+1?'on':''} aria-label={`Mood ${k+1} dari 5`} onClick={()=>setMood(k+1)}>{m}</button>)}</div>
  <label htmlFor="w">Apa yang berjalan baik?</label><textarea id="w" rows="3" maxLength={2000} value={w} onChange={e=>setW(e.target.value)}/>
  <label htmlFor="i">Apa yang bisa diperbaiki besok?</label><textarea id="i" rows="3" maxLength={2000} value={i} onChange={e=>setI(e.target.value)}/>
  <div className="err" role="alert">{err}</div><button className="btn p">Simpan refleksi</button></form>
  <h2>Sebelumnya</h2>{prev.length?prev.map(r=><div key={r.date} className="card"><b>{r.date}</b> {M[r.mood-1]} · Skor {score(comp,habits,r.date)}<div className="mu">{r.went_well}</div></div>):<p className="mu">Belum ada refleksi sebelumnya.</p>}</>;
}
