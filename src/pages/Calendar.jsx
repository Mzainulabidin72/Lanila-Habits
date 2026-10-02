import {useState} from 'react';import {today,sched,st,dayRatio} from '../lib/habits';
const L={done:'Selesai',part:'Sebagian',miss:'Belum'};
export default function Calendar({habits,comp}){
 const[cm,setCm]=useState(0),[sel,setSel]=useState(null),t=today();
 const b=new Date(t.slice(0,7)+'-01T00:00:00Z');b.setUTCMonth(b.getUTCMonth()+cm);
 const ym=b.toISOString().slice(0,7),n=new Date(Date.UTC(b.getUTCFullYear(),b.getUTCMonth()+1,0)).getUTCDate(),off=(b.getUTCDay()+6)%7;
 const cells=[...Array(off)].map((_,i)=><span key={'o'+i}/>);
 for(let i=1;i<=n;i++){const d=ym+'-'+String(i).padStart(2,'0'),r=dayRatio(comp,habits,d),col=!r||d>t?null:r.k===r.n?'var(--ok)':r.k+r.p>0?'var(--wa)':null;
  cells.push(<button key={d} className="cell" aria-label={d} style={{...(col?{background:col,color:'#fff'}:{}),...(sel===d?{outline:'3px solid var(--ac)'}:{})}} onClick={()=>setSel(d)}>{i}</button>)}
 const list=sel?habits.filter(h=>sched(h,sel)):[];
 return <><h1>Kalender</h1><div className="row"><button className="btn" onClick={()=>setCm(cm-1)} aria-label="Bulan sebelumnya">‹</button><b className="sp" style={{textAlign:'center'}}>{b.toLocaleDateString('id-ID',{month:'long',year:'numeric',timeZone:'UTC'})}</b><button className="btn" onClick={()=>setCm(cm+1)} aria-label="Bulan berikutnya">›</button></div>
  <div className="card"><div className="grid" style={{marginBottom:5}}>{['Sen','Sel','Rab','Kam','Jum','Sab','Min'].map(x=><span key={x} className="mu" style={{textAlign:'center'}}>{x}</span>)}</div><div className="grid">{cells}</div><p className="mu">Hijau: selesai · Kuning: sebagian · Abu-abu: terlewat/tidak terjadwal</p></div>
  {sel&&<div className="card"><b>{sel}</b>{list.length?list.map(h=><div key={h.id} className="row"><span>{h.icon} {h.name}</span><span className="sp"/><span className="mu">{L[st(comp,h,sel)]}</span></div>):<p className="mu">Tidak ada kebiasaan terjadwal.</p>}</div>}</>;
}
