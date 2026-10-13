import {useState} from 'react';import {today,addD,dow,sched,st,val,score} from '../lib/habits';import Icon from '../components/Icon';
const M=['😞','😐','🙂','😄','🤩'],ML=['Sangat buruk','Kurang baik','Biasa saja','Baik','Sangat baik'],DS=['Sen','Sel','Rab','Kam','Jum','Sab','Min'];
const F={daily:'Setiap hari',weekdays:'Hari kerja',weekends:'Akhir pekan'},SL={done:'Selesai',part:'Sebagian'},DL={done:'✓ Selesai',part:'• Sebagian',miss:'× Belum selesai',open:'Hari ini · belum selesai'};
const fd=d=>new Date(d+'T00:00:00Z').toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
const fm=d=>new Date(d.slice(0,7)+'-01T00:00:00Z').toLocaleDateString('id-ID',{month:'long',year:'numeric',timeZone:'UTC'});
const range=(a,b)=>{const o=[];for(let d=a;d<=b;d=addD(d,1))o.push(d);return o};
const PER=[['7','7 hari'],['30','30 hari'],['60','60 hari'],['custom','Rentang tanggal']],STS=[['all','Semua'],['done','Selesai'],['open','Belum selesai']];
// Riwayat dinilai dari kebiasaan aktif. Hanya hari yang punya kebiasaan terjadwal yang masuk daftar (hari tanpa jadwal ≠ gagal).
// Status hari: Selesai = semua terjadwal selesai · Sebagian = sebagian selesai · Belum selesai = tak ada yang selesai (hari ini ditandai "belum", bukan gagal).
// Filter "Belum selesai" = hari yang belum seluruhnya selesai. Skor harian = rata-rata progres terhadap target (sama dengan Beranda).
// Pencarian: jika cocok dengan nama kebiasaan → hanya kebiasaan itu yang dihitung; jika tidak → dicocokkan dengan teks tanggal.
export default function History({habits,comp,refl}){
 const t=today(),[per,setPer]=useState('30'),[cf,setCf]=useState(addD(t,-29)),[ct,setCt]=useState(t),[sts,setSts]=useState('all'),[q,setQ]=useState(''),[lim,setLim]=useState(15),[open,setOpen]=useState(null),[tip,setTip]=useState(null);
 const reset=()=>{setPer('30');setSts('all');setQ('');setLim(15)};
 if(!habits.length)return <><h1>Riwayat</h1><div className="panel" style={{maxWidth:520,margin:'1rem auto',textAlign:'center',padding:'2rem 1rem'}}><div style={{color:'var(--ac)'}}><Icon n="clock" s={40}/></div><h2 style={{margin:'.6rem 0 .3rem'}}>Belum ada riwayat</h2><p className="mu">Riwayat akan muncul setelah kamu membuat dan menyelesaikan kebiasaan.</p><a className="btn p" style={{display:'inline-flex',textDecoration:'none'}} href="#habits">Ke halaman Kebiasaan</a></div></>;
 const from=per==='custom'?(cf||t):addD(t,-(+per-1)),to=per==='custom'?(ct&&ct<t?ct:t):t,ql=q.trim().toLowerCase(),hq=ql?habits.filter(h=>h.name.toLowerCase().includes(ql)):[],byH=hq.length>0,H=byH?hq:habits,rm=Object.fromEntries(refl.map(r=>[r.date,r]));
 const mk=d=>{const items=H.filter(h=>sched(h,d)).map(h=>({h,s:st(comp,h,d),v:val(comp,h,d)})),n=items.length,k=items.filter(x=>x.s==='done').length,p=items.filter(x=>x.s==='part').length;
  return{d,items,n,k,p,sc:n?score(comp,H,d):0,r:rm[d],s:!n?'none':k===n?'done':k+p>0?'part':d<t?'miss':'open'}};
 const all=from>to?[]:range(from,to).reverse().map(mk);
 const days=all.filter(x=>x.n>0&&(sts==='all'||(sts==='done'?x.k===x.n:x.k<x.n))&&(byH||!ql||fd(x.d).toLowerCase().includes(ql)));
 const tot=days.reduce((a,x)=>({k:a.k+x.k,n:a.n+x.n,sc:a.sc+x.sc}),{k:0,n:0,sc:0}),avg=days.length?Math.round(tot.sc/days.length):null,active=days.filter(x=>x.k>0).length,rate=tot.n?Math.round(tot.k/tot.n*100):null;
 const hmd=all.slice(0,120).reverse(),lead=hmd[0]?(dow(hmd[0].d)+6)%7:0,filtered=per!=='30'||sts!=='all'||q;
 const stat=(ic,l,v,s)=><div className="card"><span className="mu row" style={{gap:6}}><span style={{color:'var(--ac)'}}><Icon n={ic} s={16}/></span>{l}</span><b>{v}</b><span className="mu">{s}</span></div>;
 let pm='';
 return <div className="hsp"><h1 style={{margin:0}}>Riwayat</h1><p className="mu" style={{margin:'.2rem 0 0'}}>Tinjau kembali perjalanan kebiasaanmu dari hari ke hari.</p>
  <div className="stats">{stat('check','Aktivitas Selesai',tot.k,`dari ${tot.n} jadwal`)}{stat('chart','Rata-rata Skor',avg==null?'–':avg,'dari 100')}{stat('calendar','Hari Aktif',active,`dari ${days.length} hari terjadwal`)}{stat('flame','Konsistensi',rate==null?'–':rate+'%','periode terpilih')}</div>
  <section className="panel"><div className="tb" style={{marginBottom:per==='custom'?'.6rem':0}}>
    <div className="row" role="group" aria-label="Periode" style={{flexWrap:'wrap',gap:'.4rem'}}>{PER.map(([k,l])=><button key={k} className={'btn '+(per===k?'p':'')} aria-pressed={per===k} onClick={()=>{setPer(k);setLim(15)}}>{l}</button>)}</div>
    <select aria-label="Status" style={{flex:'1 1 130px',maxWidth:200}} value={sts} onChange={e=>{setSts(e.target.value);setLim(15)}}>{STS.map(([k,l])=><option key={k} value={k}>{l}</option>)}</select>
    <input type="search" aria-label="Cari kebiasaan atau tanggal" placeholder="Cari kebiasaan atau tanggal…" style={{flex:'2 1 180px'}} value={q} onChange={e=>{setQ(e.target.value);setLim(15)}}/>
    <button className="btn" onClick={reset} disabled={!filtered}>Reset filter</button></div>
   {per==='custom'&&<div className="row" style={{flexWrap:'wrap'}}><label htmlFor="hf" className="mu">Dari</label><input id="hf" type="date" max={t} style={{margin:0,width:'auto'}} value={cf} onChange={e=>setCf(e.target.value)}/><label htmlFor="ht" className="mu">Sampai</label><input id="ht" type="date" max={t} min={cf} style={{margin:0,width:'auto'}} value={ct} onChange={e=>setCt(e.target.value)}/>{from>to&&<span className="err">Rentang tanggal tidak valid.</span>}</div>}</section>
  <div className="hg"><div>
   {!days.length?<div className="panel" style={{textAlign:'center',padding:'1.6rem 1rem'}}><b>{filtered?'Tidak ada riwayat yang cocok':'Belum ada hari terjadwal pada periode ini'}</b><p className="mu">{filtered?'Coba ubah periode, status, atau kata kunci.':'Hari tanpa kebiasaan terjadwal tidak ditampilkan.'}</p>{filtered&&<button className="btn" onClick={reset}>Hapus filter</button>}</div>
   :<>{days.slice(0,lim).map(x=>{const m=x.d.slice(0,7),hd=m!==pm?(pm=m,<h3 key={'m'+m} className="hmh">{fm(x.d)}</h3>):null,sm=x.r&&x.r.mood?{e:M[x.r.mood-1],l:ML[x.r.mood-1]}:null;
     return <div key={x.d}>{hd}<article className="hrow"><div className="row" style={{flexWrap:'wrap',alignItems:'center'}}>
       <div className="sp" style={{minWidth:200}}><b>{fd(x.d)}</b><div className="mu">{x.k} dari {x.n} kebiasaan · Skor {x.sc}{sm?<> · <span role="img" aria-label={'Suasana hati: '+sm.l}>{sm.e}</span> {sm.l}</>:null}{x.r&&(x.r.went_well||x.r.improvement)?' · 📝':''}</div></div>
       <span className={'bdg '+(x.s==='done'?'ok':x.s==='part'?'run':'')}>{DL[x.s]}</span>
       <button className="btn" aria-expanded={open===x.d} onClick={()=>setOpen(open===x.d?null:x.d)}>{open===x.d?'Tutup':'Rincian'}</button></div>
      <div className="bar" style={{marginTop:'.6rem'}} role="progressbar" aria-label={'Skor '+fd(x.d)} aria-valuenow={x.sc} aria-valuemin="0" aria-valuemax="100"><i style={{width:x.sc+'%'}}/></div>
      {open===x.d&&<div style={{marginTop:'.7rem',display:'grid',gap:'.5rem'}}>{x.items.map(({h,s,v})=><div key={h.id} className="row" style={{flexWrap:'wrap'}}><span className="sp" style={{minWidth:180}}>{h.icon} <b>{h.name}</b><span className="mu"> · {F[h.frequency]}{h.reminder_enabled&&h.reminder_time?' · '+h.reminder_time.slice(0,5):''}</span></span>
        <span className="mu">{h.target_value===1&&!h.unit?'':`${v}/${h.target_value} ${h.unit} · `}</span><span className={'bdg '+(s==='done'?'ok':s==='part'?'run':'')}>{SL[s]||(x.d===t?'Belum':'Belum selesai')}</span></div>)}
        {x.r&&(x.r.went_well||x.r.improvement)&&<div className="mu" style={{borderTop:'1px solid var(--bd)',paddingTop:'.5rem'}}>Refleksi: {x.r.went_well||x.r.improvement}</div>}</div>}</article></div>})}
    <div className="mu" style={{textAlign:'center',margin:'.6rem 0'}}>Menampilkan {Math.min(lim,days.length)} dari {days.length} hari</div>
    {days.length>lim&&<div style={{textAlign:'center'}}><button className="btn" onClick={()=>setLim(lim+15)}>Muat lebih banyak</button></div>}</>}</div>
   <aside className="panel" style={{margin:0}}><b>Aktivitas periode ini</b>
    {hmd.length?<><div style={{display:'flex',gap:6,margin:'.7rem 0 .4rem'}}><div className="hml">{DS.map(x=><span key={x}>{x}</span>)}</div><div className="hm">{[...Array(lead)].map((_,i)=><span key={'p'+i} className="hmc" style={{visibility:'hidden'}}/>).concat(hmd.map(c=><div key={c.d} className={`hmc c-${c.s}${c.d===t?' tdy':''}`} tabIndex={0} role="img" aria-label={`${fd(c.d)}: ${c.n?`${c.k} dari ${c.n} selesai`:'tidak terjadwal'}`} onMouseEnter={()=>setTip(c)} onFocus={()=>setTip(c)} onClick={()=>setTip(c)}/>))}</div></div>
     <p className="mu" aria-live="polite" style={{margin:'.2rem 0',minHeight:'1.5em',fontSize:'.85rem'}}>{tip?`${fd(tip.d)} · ${tip.n?`${tip.k} dari ${tip.n} selesai`:'tidak terjadwal'}`:'Arahkan atau ketuk kotak untuk melihat detail.'}</p>
     {all.length>120&&<p className="mu" style={{fontSize:'.8rem',margin:0}}>Menampilkan 120 hari terakhir.</p>}
     <div className="lg">{[['done','Semua selesai'],['part','Sebagian'],['miss','Belum selesai'],['open','Hari ini'],['none','Tidak terjadwal']].map(([c,l])=><span key={c}><i className={'c-'+c}/>{l}</span>)}</div></>:<p className="mu">Rentang tanggal tidak valid.</p>}</aside></div></div>;
}
