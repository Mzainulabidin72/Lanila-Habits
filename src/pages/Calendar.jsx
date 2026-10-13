import {useState} from 'react';import {today,addD,dow,sched,st,streaks,dayRatio} from '../lib/habits';
const L={done:'Selesai',part:'Sebagian',miss:'Belum'},DN=['Sen','Sel','Rab','Kam','Jum','Sab','Min'];
const SL={done:'selesai',part:'sebagian selesai',miss:'tidak selesai',open:'akan datang atau belum selesai',none:'tidak terjadwal'};
export default function Calendar({habits,comp}){
 const[view,setView]=useState('month'),[off,setOff]=useState(0),[sel,setSel]=useState(null),[fh,setFh]=useState('all'),t=today(),wk=view==='week';
 const H=fh==='all'?habits:habits.filter(h=>String(h.id)===fh);
 let title,days,pad=0;
 if(!wk){const b=new Date(t.slice(0,7)+'-01T00:00:00Z');b.setUTCMonth(b.getUTCMonth()+off);const ym=b.toISOString().slice(0,7),n=new Date(Date.UTC(b.getUTCFullYear(),b.getUTCMonth()+1,0)).getUTCDate();
  pad=(b.getUTCDay()+6)%7;days=[...Array(n)].map((_,i)=>ym+'-'+String(i+1).padStart(2,'0'));title=b.toLocaleDateString('id-ID',{month:'long',year:'numeric',timeZone:'UTC'})}
 else{const mon=addD(t,-((dow(t)+6)%7)+off*7);days=[...Array(7)].map((_,i)=>addD(mon,i));title=`${days[0].slice(5)} s/d ${days[6].slice(5)}`}
 // Status hari: none = tidak terjadwal · open = akan datang/hari ini belum selesai · done · part · miss (aturan sama dengan Beranda)
 const info=days.map(d=>{const r=dayRatio(comp,H,d);return{d,r,s:!r?'none':d>t?'open':r.k===r.n?'done':r.k+r.p>0?'part':d<t?'miss':'open'}});
 let n=0,k=0;info.forEach(x=>{if(x.r&&x.d<=t){n+=x.r.n;k+=x.r.k}});
 const rate=n?Math.round(k/n*100):null,cur=Math.max(0,...H.map(h=>streaks(comp,h).cur)),per=wk?'Minggu ditampilkan':'Bulan ditampilkan';
 const cells=[...Array(pad)].map((_,i)=><span key={'o'+i}/>).concat(info.map(({d,r,s})=>
  <button key={d} className={`cell c-${s}${d===t?' tdy':''}${sel===d?' sel':''}`} aria-pressed={sel===d} aria-label={`${d}: ${SL[s]}${r?`, ${r.k} dari ${r.n} kebiasaan`:''}`} onClick={()=>setSel(d)}>
   <span>{+d.slice(8)}</span>{r&&d<=t&&<small>{r.k}/{r.n}</small>}</button>));
 const list=sel?H.filter(h=>sched(h,sel)):[];
 const stat=(a,b,c)=><div className="card"><span className="mu">{a}</span><b>{b}</b><span className="mu">{c}</span></div>;
 return <><h1>Kalender</h1>
  <div className="row" style={{flexWrap:'wrap',marginBottom:'.7rem'}}><div className="row" role="group" aria-label="Tampilan">{[['month','Bulanan'],['week','Mingguan']].map(([v,l])=><button key={v} className={'btn '+(view===v?'p':'')} aria-pressed={view===v} onClick={()=>{setView(v);setOff(0);setSel(null)}}>{l}</button>)}</div>
   <div className="sp" style={{minWidth:200}}><label htmlFor="kh" className="mu" style={{position:'absolute',left:-9999}}>Kebiasaan</label><select id="kh" style={{margin:0}} value={fh} onChange={e=>setFh(e.target.value)}><option value="all">Semua kebiasaan</option>{habits.map(h=><option key={h.id} value={h.id}>{h.icon} {h.name}</option>)}</select></div></div>
  <div className="stats s3">{stat('Selesai',`${k}/${n}`,'Kebiasaan terjadwal')}{stat('Konsistensi',rate==null?'–':rate+'%',per)}{stat('Streak saat ini',`${cur} hari`,fh==='all'?'Terbaik di semua kebiasaan':'Kebiasaan ini')}</div>
  <div className={'cg cal'+(wk?' wkv':'')}>
   <section className="panel" style={{margin:0,minWidth:0}}><div className="row" style={{marginBottom:'.8rem'}}><button className="btn" onClick={()=>setOff(off-1)} aria-label={wk?'Minggu sebelumnya':'Bulan sebelumnya'}>‹</button><b className="sp" style={{textAlign:'center',fontSize:'1.05rem'}}>{title}</b><button className="btn" onClick={()=>setOff(off+1)} aria-label={wk?'Minggu berikutnya':'Bulan berikutnya'}>›</button></div>
    <div className="grid" style={{marginBottom:6}}>{DN.map(x=><span key={x} className="mu" style={{textAlign:'center',fontSize:'.85rem'}}>{x}</span>)}</div><div className="grid">{cells}</div>
    <div className="lg" aria-label="Keterangan warna">{[['done','Selesai'],['part','Sebagian'],['miss','Tidak selesai'],['open','Akan datang'],['none','Tidak terjadwal']].map(([c,l])=><span key={c}><i className={'c-'+c}/>{l}</span>)}</div></section>
   <aside className="panel dtl" style={{margin:0}} aria-live="polite">{sel?<><b>{new Date(sel+'T00:00:00Z').toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'UTC'})}</b>
     {list.length?list.map(h=><div key={h.id} className="row" style={{marginTop:'.6rem'}}><span>{h.icon} {h.name}</span><span className="sp"/><span className="mu">{sel>t?'Akan datang':L[st(comp,h,sel)]}</span></div>):<p className="mu">Tidak ada kebiasaan terjadwal.</p>}</>
    :<><b>Detail hari</b><p className="mu" style={{marginBottom:0}}>Pilih tanggal untuk melihat kebiasaan yang terjadwal dan statusnya.</p></>}</aside></div></>;
}
