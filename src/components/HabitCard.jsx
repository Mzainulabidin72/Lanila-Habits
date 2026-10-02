import {st,val,streaks} from '../lib/habits';
export default function HabitCard({h,d,comp,setV}){
 const s=st(comp,h,d),v=val(comp,h,d),k=streaks(comp,h).cur,simple=h.target_value===1&&!h.unit;
 return <div className={'card h '+(s==='done'?'done':'')}><div className="ic" aria-hidden="true">{h.icon}</div>
  <div className="sp"><b>{h.name}</b><div className="mu">{h.category} · {simple?'Selesai/belum':`${v} / ${h.target_value} ${h.unit}`} · 🔥 {k}</div></div>
  {!simple&&<input className="num" type="number" min="0" step="any" defaultValue={v} key={v} aria-label={'Progres '+h.name} onBlur={e=>{if(+e.target.value!==v)setV(h.id,e.target.value)}}/>}
  <button className="chk" aria-pressed={s==='done'} aria-label={(s==='done'?'Batalkan ':'Selesaikan ')+h.name} onClick={()=>setV(h.id,s==='done'?0:h.target_value)}>{s==='done'?'✓':''}</button></div>;
}
