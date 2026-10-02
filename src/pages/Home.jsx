import {today,sched,st,streaks,score} from '../lib/habits';import HabitCard from '../components/HabitCard';import Empty from '../components/Empty';
export default function Home({user,habits,comp,setV}){
 const t=today(),hr=+new Date().toLocaleString('en-GB',{timeZone:'Asia/Jakarta',hour:'numeric',hour12:false}),g=hr<11?'Selamat pagi':hr<15?'Selamat siang':hr<19?'Selamat sore':'Selamat malam';
 const list=habits.filter(h=>sched(h,t)),dn=list.filter(h=>st(comp,h,t)==='done').length,pc=list.length?Math.round(dn/list.length*100):0;
 const all=habits.map(h=>streaks(comp,h)),cur=Math.max(0,...all.map(x=>x.cur)),best=Math.max(0,...all.map(x=>x.best));
 return <><h1>{g}, {user.name.split(' ')[0]} 👋</h1><p className="mu">Langkah kecil, perubahan besar.</p>
  <div className="card"><div className="row"><b className="sp">Progres hari ini</b><b>{dn} / {list.length} · {pc}%</b></div><div className="bar" role="progressbar" aria-valuenow={pc} aria-valuemin="0" aria-valuemax="100"><i style={{width:pc+'%'}}/></div>
   <div className="row mu" style={{marginTop:'.7rem'}}><span className="sp">🔥 Streak: <b>{cur} hari</b> (terbaik {best})</span><span>Skor: <b>{score(comp,habits,t)}</b>/100</span></div></div>
  <h2>Kebiasaan hari ini</h2>{list.length?list.map(h=><HabitCard key={h.id} h={h} d={t} comp={comp} setV={setV}/>):<Empty msg={habits.length?'Tidak ada kebiasaan terjadwal hari ini. Istirahat yang baik!':'Bangun kebiasaan pertamamu hari ini.'}/>}</>;
}
