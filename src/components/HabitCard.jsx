import {useState} from 'react';import {st,val,streaks} from '../lib/habits';
// Kartu kebiasaan di Beranda. Kolom "Progres" hanya untuk target terukur (angka/durasi): isi nilai saat ini, target & satuan ditampilkan.
export default function HabitCard({h,d,comp,setV}){
 const[busy,setBusy]=useState(false),s=st(comp,h,d),v=val(comp,h,d),k=streaks(comp,h).cur,simple=h.target_value===1&&!h.unit,done=s==='done',pct=Math.min(100,Math.round(v/h.target_value*100));
 const go=async n=>{if(busy)return;setBusy(true);await setV(h.id,n);setBusy(false)};
 return <div className={'card hc '+(done?'done':'')}><div className="h"><div className="ic" aria-hidden="true">{h.icon}</div>
   <div className="sp"><b>{h.name}</b><div className="mu">{h.category}{h.reminder_enabled&&h.reminder_time?' · '+h.reminder_time.slice(0,5):''} · 🔥 {k} hari{s==='part'?' · Sebagian':''}</div></div>
   <button className="chk" disabled={busy} aria-busy={busy} aria-pressed={done} aria-label={(done?'Batalkan ':'Selesaikan ')+h.name} onClick={()=>go(done?0:h.target_value)}>{done?'✓':''}</button></div>
  {!simple&&<div className="hp"><label htmlFor={'v'+h.id}>Progres</label><input id={'v'+h.id} className="num" type="number" min="0" step="any" defaultValue={v} key={v} disabled={busy}
    onBlur={e=>{if(+e.target.value!==v)go(e.target.value)}} onKeyDown={e=>{if(e.key==='Enter')e.target.blur()}}/><span className="mu">/ {h.target_value} {h.unit}</span><div className="bar"><i style={{width:pct+'%'}}/></div></div>}</div>;
}
