export default function ReminderFields({f,setF}){
 return <div style={{margin:'.3rem 0 .7rem'}}><label className="row" style={{minHeight:44,color:'var(--tx)'}}><input type="checkbox" style={{width:22,minHeight:22,margin:0}} checked={f.rem} onChange={e=>setF({...f,rem:e.target.checked})}/> Ingatkan saya</label>
  {f.rem&&<><label htmlFor="rt">Jam pengingat</label><input id="rt" type="time" value={f.time} onChange={e=>setF({...f,time:e.target.value})}/></>}</div>;
}
