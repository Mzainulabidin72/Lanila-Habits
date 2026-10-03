import {today,addD,sched,st,score} from '../lib/habits';import Empty from '../components/Empty';
const M=['😞','😐','🙂','😄','🤩'];
export default function History({habits,comp,refl}){
 const t=today(),rm=Object.fromEntries(refl.map(r=>[r.date,r]));
 const rows=[...Array(60)].map((_,i)=>addD(t,-i)).map(d=>{const l=habits.filter(h=>sched(h,d));return l.length?{d,n:l.length,k:l.filter(h=>st(comp,h,d)==='done').length,s:score(comp,habits,d),r:rm[d]}:null}).filter(Boolean);
 if(!rows.length)return <><h1>Riwayat</h1><Empty msg="Belum ada riwayat. Mulai catat kebiasaanmu."/></>;
 return <><h1>Riwayat</h1><p className="mu">60 hari terakhir</p>
  {rows.map(x=><div key={x.d} className="card row"><div className="sp"><b>{new Date(x.d+'T00:00:00Z').toLocaleDateString('id-ID',{day:'numeric',month:'long',timeZone:'UTC'})}</b><div className="mu">{x.k} / {x.n} kebiasaan · Skor {x.s}</div></div>
   <span style={{fontSize:'1.5rem'}} aria-label={x.r?`Mood ${x.r.mood} dari 5`:'Belum ada mood'}>{x.r?M[x.r.mood-1]:'–'}</span>
   {x.r&&(x.r.went_well||x.r.improvement)&&<span title="Ada refleksi" aria-label="Ada refleksi">📝</span>}</div>)}</>;
}
