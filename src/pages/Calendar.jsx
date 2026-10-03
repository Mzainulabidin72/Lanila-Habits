import {useState} from 'react';import {today,addD,dow,sched,st,dayRatio} from '../lib/habits';
const L={done:'Selesai',part:'Sebagian',miss:'Belum'};
const color=(r,d,t)=>!r||d>t?null:r.k===r.n?'var(--ok)':r.k+r.p>0?'var(--wa)':null;
export default function Calendar({habits,comp}){
 const[view,setView]=useState('month'),[off,setOff]=useState(0),[sel,setSel]=useState(null),[fh,setFh]=useState('all'),t=today(),wk=view==='week';
 const H=fh==='all'?habits:habits.filter(h=>String(h.id)===fh);
 let title,days,pad=0;
 if(!wk){const b=new Date(t.slice(0,7)+'-01T00:00:00Z');b.setUTCMonth(b.getUTCMonth()+off);const ym=b.toISOString().slice(0,7),n=new Date(Date.UTC(b.getUTCFullYear(),b.getUTCMonth()+1,0)).getUTCDate();
  pad=(b.getUTCDay()+6)%7;days=[...Array(n)].map((_,i)=>ym+'-'+String(i+1).padStart(2,'0'));title=b.toLocaleDateString('id-ID',{month:'long',year:'numeric',timeZone:'UTC'})}
 else{const mon=addD(t,-((dow(t)+6)%7)+off*7);days=[...Array(7)].map((_,i)=>addD(mon,i));title=`${days[0].slice(5)} s/d ${days[6].slice(5)}`}
 const cells=[...Array(pad)].map((_,i)=><span key={'o'+i}/>).concat(days.map(d=>{const r=dayRatio(comp,H,d),c=color(r,d,t);
  return <button key={d} className="cell" aria-label={d} style={{...(c?{background:c,color:'#fff'}:{}),...(wk?{aspectRatio:'auto',minHeight:64}:{}),...(sel===d?{outline:'3px solid var(--ac)'}:{})}} onClick={()=>setSel(d)}>{+d.slice(8)}{wk&&<><br/><small>{r?`${r.k}/${r.n}`:'–'}</small></>}</button>}));
 const list=sel?H.filter(h=>sched(h,sel)):[];
 return <><h1>Kalender</h1>
  <div className="row" role="group" aria-label="Tampilan" style={{marginBottom:'.7rem'}}>{[['month','Bulanan'],['week','Mingguan']].map(([k,l])=><button key={k} className={'btn '+(view===k?'p':'')} aria-pressed={view===k} onClick={()=>{setView(k);setOff(0)}}>{l}</button>)}</div>
  <label htmlFor="kh">Kebiasaan</label><select id="kh" value={fh} onChange={e=>setFh(e.target.value)}><option value="all">Semua kebiasaan</option>{habits.map(h=><option key={h.id} value={h.id}>{h.icon} {h.name}</option>)}</select>
  <div className="row"><button className="btn" onClick={()=>setOff(off-1)} aria-label="Sebelumnya">‹</button><b className="sp" style={{textAlign:'center'}}>{title}</b><button className="btn" onClick={()=>setOff(off+1)} aria-label="Berikutnya">›</button></div>
  <div className="card"><div className="grid" style={{marginBottom:5}}>{['Sen','Sel','Rab','Kam','Jum','Sab','Min'].map(x=><span key={x} className="mu" style={{textAlign:'center'}}>{x}</span>)}</div><div className="grid">{cells}</div><p className="mu">Hijau: selesai · Kuning: sebagian · Abu-abu: terlewat/tidak terjadwal</p></div>
  {sel&&<div className="card"><b>{sel}</b>{list.length?list.map(h=><div key={h.id} className="row"><span>{h.icon} {h.name}</span><span className="sp"/><span className="mu">{L[st(comp,h,sel)]}</span></div>):<p className="mu">Tidak ada kebiasaan terjadwal.</p>}</div>}</>;
}
