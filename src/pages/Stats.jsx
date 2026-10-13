import {useState} from 'react';import {today,addD,dow,sched,st,streaks,dayRatio} from '../lib/habits';import Icon from '../components/Icon';
const WD=['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'],DS=['Sen','Sel','Rab','Kam','Jum','Sab','Min'];
const PER=[['7','7 hari'],['30','30 hari'],['90','90 hari'],['all','Semua waktu']],GR=[['day','Harian'],['week','Mingguan'],['month','Bulanan']];
const fd=d=>new Date(d+'T00:00:00Z').toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
const pc=(k,n)=>n?Math.round(k/n*100):null,range=(a,b)=>{const o=[];for(let d=a;d<=b;d=addD(d,1))o.push(d);return o};
// Definisi (sama dengan Beranda/Kalender): peluang = kebiasaan terjadwal pada hari itu (hari ini ikut dihitung); konsistensi = selesai ÷ peluang.
// Hari/kebiasaan tidak terjadwal tidak dihitung terlewat. Pembanding = periode sebelumnya dengan panjang sama (tidak ada untuk "Semua waktu").
export default function Stats({habits,paused=[],comp}){
 const[per,setPer]=useState('30'),[fh,setFh]=useState('all'),[gr,setGr]=useState('day'),[tip,setTip]=useState(null),[htip,setHtip]=useState(null);
 const t=today(),H=fh==='all'?habits:habits.filter(h=>String(h.id)===fh);
 if(!habits.length||!Object.values(comp).some(v=>v>0))return <><h1>Statistik</h1><div className="panel" style={{maxWidth:520,margin:'1rem auto',textAlign:'center',padding:'2rem 1rem'}}><div style={{color:'var(--ac)'}}><Icon n="chart" s={40}/></div><h2 style={{margin:'.6rem 0 .3rem'}}>Belum ada data statistik</h2><p className="mu">Data akan muncul setelah kamu menyelesaikan kebiasaan pertamamu. Terus catat untuk membuka wawasanmu.</p><a className="btn p" style={{display:'inline-flex',textDecoration:'none'}} href={habits.length?'#home':'#new'}>{habits.length?'Ke Beranda':'Buat kebiasaan'}</a></div></>;
 const first=H.map(h=>h.start_date).sort()[0]||t,N=per==='all'?Math.max(1,Math.round((new Date(t)-new Date(first))/864e5)+1):+per,from=per==='all'?first:addD(t,-(N-1)),pTo=addD(from,-1),pFrom=addD(from,-N);
 const hstat=(h,a,b)=>{let n=0,k=0,p=0;for(let d=a>h.start_date?a:h.start_date;d<=b;d=addD(d,1)){if(!sched(h,d))continue;n++;const s=st(comp,h,d);if(s==='done')k++;else if(s==='part')p++}return{n,k,p}};
 const agg=(a,b)=>H.reduce((x,h)=>{const s=hstat(h,a,b);return{n:x.n+s.n,k:x.k+s.k,p:x.p+s.p}},{n:0,k:0,p:0});
 const cur=agg(from,t),prv=per==='all'?null:agg(pFrom,pTo),rate=pc(cur.k,cur.n),prate=prv&&prv.n?pc(prv.k,prv.n):null,dRate=rate!=null&&prate!=null?rate-prate:null,dAct=prv&&prv.n?cur.k-prv.k:null;
 const best=Math.max(0,...H.map(h=>streaks(comp,h).best));
 const daily=range(from,t).map(d=>{const r=dayRatio(comp,H,d);return{d,n:r?r.n:0,k:r?r.k:0}});
 const bk=new Map();daily.forEach(x=>{const key=gr==='day'?x.d:gr==='week'?addD(x.d,-((dow(x.d)+6)%7)):x.d.slice(0,7),b=bk.get(key)||{key,k:0,n:0};b.k+=x.k;b.n+=x.n;bk.set(key,b)});
 const B=[...bk.values()],mx=Math.max(1,...B.map(b=>b.k)),lab=b=>gr==='day'?b.key.slice(8):gr==='week'?b.key.slice(5):b.key;
 const tl=b=>gr==='day'?fd(b.key):gr==='week'?'Minggu mulai '+fd(b.key):new Date(b.key+'-01T00:00:00Z').toLocaleDateString('id-ID',{month:'long',year:'numeric',timeZone:'UTC'});
 const W=640,HH=200,L=30,R=6,T=8,Bt=22,cw=(W-L-R)/B.length,bw=Math.max(2,Math.min(cw*.7,40)),ch=HH-T-Bt,step=Math.ceil(B.length/8),C=2*Math.PI*54;
 const span=(per==='90'||per==='all')?90:30,hf=addD(t,-(span-1)),hs0=addD(hf,-((dow(hf)+6)%7)),he=addD(t,6-((dow(t)+6)%7));
 const hc=range(hs0,he).map(d=>{if(d<hf||d>t)return{d,s:'pad'};const r=dayRatio(comp,H,d);return{d,r,s:!r?'none':r.k===r.n?'done':r.k+r.p>0?'part':d<t?'miss':'open'}});
 const P=H.map(h=>{const c=hstat(h,from,t),p=per==='all'?null:hstat(h,pFrom,pTo),r=pc(c.k,c.n),pr=p&&p.n?pc(p.k,p.n):null,d=r!=null&&pr!=null?r-pr:null;
  return{h,c,r,streak:streaks(comp,h).cur,trend:d==null?'Belum cukup data':d>=5?'Meningkat ▲':d<=-5?'Menurun ▼':'Stabil ▬'}}).sort((a,b)=>(b.r??-1)-(a.r??-1));
 const ins=[];if(cur.n>=7){
  const wd=WD.map((name,w)=>{let n=0,k=0;daily.forEach(x=>{if(dow(x.d)===w){n+=x.n;k+=x.k}});return{name,n,r:pc(k,n)}}).filter(x=>x.n>=3),hi=[...wd].sort((a,b)=>b.r-a.r)[0],lo=[...wd].sort((a,b)=>a.r-b.r)[0];
  if(hi)ins.push(`Hari dengan penyelesaian tertinggi: ${hi.name} (${hi.r}%).`);if(hi&&lo&&lo.r<hi.r-10)ins.push(`Hari yang paling sering terlewat: ${lo.name} (${lo.r}%).`);
  const pr=P.filter(x=>x.c.n>=3);if(pr.length>1){ins.push(`Kebiasaan paling konsisten: ${pr[0].h.name} (${pr[0].r}%).`);const lw=pr[pr.length-1];if(lw.r<pr[0].r)ins.push(`Perlu perhatian: ${lw.h.name} (${lw.r}%).`)}
  if(dRate!=null)ins.push(dRate>0?`Konsistensimu naik ${dRate} poin dibanding periode sebelumnya.`:dRate<0?`Konsistensimu turun ${-dRate} poin dibanding periode sebelumnya.`:'Konsistensimu sama seperti periode sebelumnya.');
  if(lo&&lo.r<60)ins.push(`Saran: coba pasang pengingat khusus untuk hari ${lo.name}.`)}
 const delta=(d,u)=>d==null?(per==='all'?'Sepanjang waktu':'Belum ada pembanding'):`${d>=0?'▲ +':'▼ −'}${Math.abs(d)}${u} vs periode lalu`;
 const stat=(ic,l,v,s)=><div className="card"><span className="mu row" style={{gap:6}}><span style={{color:'var(--ac)'}}><Icon n={ic} s={16}/></span>{l}</span><b>{v}</b><span className="mu">{s}</span></div>;
 const seg=(opts,val,set,label)=><div className="row" role="group" aria-label={label} style={{flexWrap:'wrap',gap:'.4rem'}}>{opts.map(([k,l])=><button key={k} className={'btn '+(val===k?'p':'')} aria-pressed={val===k} onClick={()=>{set(k);setTip(null)}}>{l}</button>)}</div>;
 return <div className="stp"><div className="row" style={{flexWrap:'wrap',alignItems:'flex-end'}}><div className="sp" style={{minWidth:240}}><h1 style={{margin:0}}>Statistik</h1><p className="mu" style={{margin:'.2rem 0 0'}}>Pantau konsistensi dan perkembangan kebiasaanmu.</p></div>
   {seg(PER,per,setPer,'Periode')}{habits.length>1&&<select aria-label="Filter kebiasaan" style={{margin:0,maxWidth:240}} value={fh} onChange={e=>setFh(e.target.value)}><option value="all">Semua kebiasaan</option>{habits.map(h=><option key={h.id} value={h.id}>{h.icon} {h.name}</option>)}</select>}</div>
  <div className="stats">{stat('checkc','Kebiasaan Aktif',H.length,paused.length&&fh==='all'?`${paused.length} dijeda`:'Berjalan')}{stat('check','Aktivitas Selesai',cur.k,delta(dAct,''))}{stat('flame','Streak Terpanjang',`${best} hari`,'Rekor sepanjang waktu')}{stat('chart','Tingkat Konsistensi',rate==null?'–':rate+'%',delta(dRate,' poin'))}</div>
  <div className="sg">
   <section className="panel c8"><div className="row" style={{flexWrap:'wrap',marginBottom:'.6rem'}}><b className="sp">Aktivitas selesai</b>{seg(GR,gr,setGr,'Tampilan grafik')}</div>
    <svg viewBox={`0 0 ${W} ${HH}`} role="group" aria-label="Grafik aktivitas selesai" style={{width:'100%',height:'auto'}} onMouseLeave={()=>setTip(null)}>
     {[0,.5,1].map(f=><g key={f}><line x1={L} x2={W-R} y1={T+ch*(1-f)} y2={T+ch*(1-f)} stroke="var(--bd)"/><text x={L-6} y={T+ch*(1-f)+4} textAnchor="end" fontSize="10" fill="var(--mu)">{Math.round(mx*f)}</text></g>)}
     {B.map((b,i)=>{const x=L+cw*i+(cw-bw)/2,h=ch*b.k/mx;return <g key={b.key}><rect className="bar-r" x={x} y={T+ch-h} width={bw} height={b.k?Math.max(h,2):0} rx="3" style={{fill:tip===i?'var(--tx)':'var(--ac)'}}/>
      <rect x={L+cw*i} y={T} width={cw} height={ch} fill="transparent" tabIndex={0} role="img" aria-label={`${tl(b)}: ${b.k} aktivitas selesai dari ${b.n} jadwal`} onMouseEnter={()=>setTip(i)} onFocus={()=>setTip(i)} onClick={()=>setTip(i)}/>
      {i%step===0&&<text x={L+cw*i+cw/2} y={HH-6} textAnchor="middle" fontSize="10" fill="var(--mu)">{lab(b)}</text>}</g>})}</svg>
    <p className="mu" aria-live="polite" style={{margin:'.4rem 0 0',minHeight:'1.5em'}}>{tip!=null&&B[tip]?`${tl(B[tip])} · ${B[tip].k} aktivitas selesai dari ${B[tip].n} jadwal`:'Arahkan atau ketuk batang untuk melihat detail.'}</p></section>
   <section className="panel c4" style={{textAlign:'center'}}><b>Ringkasan konsistensi</b>
    <svg viewBox="0 0 140 140" width="150" height="150" role="img" aria-label={`Konsistensi ${rate==null?'belum ada':rate+' persen'}`} style={{display:'block',margin:'.6rem auto'}}><circle cx="70" cy="70" r="54" fill="none" stroke="var(--ms)" strokeWidth="14"/>{rate!=null&&<circle cx="70" cy="70" r="54" fill="none" stroke="var(--ok)" strokeWidth="14" strokeLinecap="round" strokeDasharray={`${C*rate/100} ${C}`} transform="rotate(-90 70 70)" style={{transition:'stroke-dasharray .4s'}}/>}<text x="70" y="77" textAnchor="middle" fontSize="26" fontWeight="700" fill="var(--tx)">{rate==null?'–':rate+'%'}</text></svg>
    <div className="mu" style={{display:'grid',gap:2}}><span>Selesai: <b style={{color:'var(--tx)'}}>{cur.k}</b></span><span>Sebagian: <b style={{color:'var(--tx)'}}>{cur.p}</b></span><span>Belum selesai: <b style={{color:'var(--tx)'}}>{cur.n-cur.k-cur.p}</b></span><span>Total jadwal: <b style={{color:'var(--tx)'}}>{cur.n}</b></span></div></section>
   <section className="panel c7"><b>Kalender konsistensi · {span} hari</b>
    <div style={{display:'flex',gap:6,margin:'.7rem 0 .4rem'}}><div className="hml">{DS.map(x=><span key={x}>{x}</span>)}</div><div className="hm">{hc.map(c=>c.s==='pad'?<span key={c.d} className="hmc" style={{visibility:'hidden'}}/>:<div key={c.d} className={`hmc c-${c.s}${c.d===t?' tdy':''}`} tabIndex={0} role="img" aria-label={`${fd(c.d)}: ${c.r?`${c.r.k} dari ${c.r.n} selesai`:'tidak terjadwal'}`} onMouseEnter={()=>setHtip(c)} onFocus={()=>setHtip(c)} onClick={()=>setHtip(c)}/>)}</div></div>
    <p className="mu" aria-live="polite" style={{margin:'.2rem 0',minHeight:'1.5em'}}>{htip?`${fd(htip.d)} · ${htip.r?`${htip.r.k} dari ${htip.r.n} selesai`:'tidak terjadwal'}`:'Arahkan atau ketuk kotak untuk melihat detail.'}</p>
    <div className="lg">{[['done','Semua selesai'],['part','Sebagian'],['miss','Belum selesai'],['open','Hari ini / belum'],['none','Tidak terjadwal']].map(([c,l])=><span key={c}><i className={'c-'+c}/>{l}</span>)}</div></section>
   <section className="panel c5"><b>Wawasan Personal</b>{ins.length?<ul style={{margin:'.6rem 0 0',paddingLeft:'1.1rem',display:'grid',gap:'.4rem'}}>{ins.map(x=><li key={x}>{x}</li>)}</ul>:<p className="mu" style={{margin:'.6rem 0 0'}}>Data belum cukup. Terus catat kebiasaanmu selama beberapa hari untuk membuka wawasan personal.</p>}</section>
   <section className="panel c12"><b>Performa Kebiasaan</b><div className="perf head mu" style={{border:0}}><span>Kebiasaan</span><span>Penyelesaian</span><span>Jadwal</span><span>Streak</span><span>Tren</span></div>
    {P.map(({h,c,r,streak,trend})=><div key={h.id} className="perf"><span className="pn"><span aria-hidden="true">{h.icon}</span> <b>{h.name}</b></span><span className="pb"><span className="bar" role="progressbar" aria-label={'Penyelesaian '+h.name} aria-valuenow={r||0} aria-valuemin="0" aria-valuemax="100"><i style={{width:(r||0)+'%'}}/></span><b>{r==null?'–':r+'%'}</b></span><span>{c.k} dari {c.n}</span><span>🔥 {streak} hari</span><span className="mu">{trend}</span></div>)}</section>
  </div></div>;
}
