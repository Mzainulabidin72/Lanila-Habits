import {today,addD,dow,dayRatio,cons,streaks} from '../lib/habits';import Empty from '../components/Empty';
const N=['Sen','Sel','Rab','Kam','Jum','Sab','Min'];
export default function Stats({habits,comp}){
 const t=today();
 if(!habits.length||!Object.keys(comp).length)return <><h1>Statistik</h1><Empty msg="Terus catat untuk membuka wawasanmu."/></>;
 const wd=[1,2,3,4,5,6,0].map(w=>{let n=0,k=0;for(let i=0;i<90;i++){const d=addD(t,-i);if(dow(d)!==w)continue;const r=dayRatio(comp,habits,d);if(r){n+=r.n;k+=r.k}}return n?Math.round(k/n*100):0});
 const per=habits.map(h=>({h,c:cons(comp,h,30)})).filter(x=>x.c!=null).sort((a,b)=>b.c-a.c);
 const done=Object.entries(comp).filter(([k,v])=>{const h=habits.find(x=>x.id==k.split('|')[0]);return h&&v>=h.target_value}).length;
 const days=new Set(Object.keys(comp).map(k=>k.split('|')[1])).size,bi=wd.indexOf(Math.max(...wd));
 return <><h1>Statistik</h1><div className="card row"><div className="sp"><b>{habits.length}</b><div className="mu">Kebiasaan aktif</div></div><div className="sp"><b>{done}</b><div className="mu">Aktivitas selesai</div></div><div className="sp"><b>{Math.max(0,...habits.map(h=>streaks(comp,h).best))}</b><div className="mu">Streak terpanjang</div></div></div>
  <h2>Per hari dalam seminggu</h2><div className="card"><div className="bw">{wd.map((v,i)=><div key={i} style={{height:Math.max(v,3)+'%'}} title={v+'%'}/>)}</div>
   <div className="bw" style={{height:'auto',marginTop:4}}>{N.map((n,i)=><span key={n} className="mu sp" style={{textAlign:'center'}}>{n}<br/>{wd[i]}%</span>)}</div></div>
  <h2>Performa kebiasaan (30 hari)</h2>{per.map(x=><div key={x.h.id} className="card"><div className="row"><span className="sp">{x.h.icon} {x.h.name}</span><b>{x.c}%</b></div><div className="bar"><i style={{width:x.c+'%'}}/></div>{x.c<60&&<div className="mu">Butuh perhatian — mulai dari langkah kecil.</div>}</div>)}
  <h2>Wawasan</h2><div className="card">{days>=7?`Konsistensimu paling tinggi di hari ${N[bi]} (${wd[bi]}%).`:'Terus catat kebiasaanmu untuk membuka wawasan personal.'}</div></>;
}
