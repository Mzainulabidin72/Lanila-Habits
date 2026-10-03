import {useState,useEffect} from 'react';import useData from './hooks/useData';
import Auth from './pages/Auth';import Home from './pages/Home';import Onboarding from './pages/Onboarding';import Habits from './pages/Habits';import NewHabit from './pages/NewHabit';
import Calendar from './pages/Calendar';import Stats from './pages/Stats';import Reflect from './pages/Reflect';import Settings from './pages/Settings';import HabitDetail from './pages/HabitDetail';
import Goals from './pages/Goals';import Achievements from './pages/Achievements';import Profile from './pages/Profile';import useReminders from './hooks/useReminders';import History from './pages/History';import ResetPassword from './pages/ResetPassword';
// [id, ikon, label, kelas] — 'dm' disembunyikan di bottom nav HP (masuk Menu), 'mo' hanya tampil di HP
const NAV=[['home','🏠','Beranda'],['habits','✅','Kebiasaan'],['calendar','📅','Kalender'],['goals','🎯','Target'],['stats','📊','Statistik','dm'],['reflect','📝','Refleksi','dm'],['achievements','🏆','Pencapaian','dm'],['history','🕘','Riwayat','dm'],['profile','👤','Profil','dm'],['settings','⚙️','Pengaturan','dm'],['menu','☰','Menu','mo']];
export default function App(){
 const d=useData();useReminders(d.habits,d.comp);const [page,setPage]=useState(location.hash.slice(1)||'home'),[ob,setOb]=useState(null);
 useEffect(()=>{const f=()=>setPage(location.hash.slice(1)||'home');addEventListener('hashchange',f);return()=>removeEventListener('hashchange',f)},[]);
 useEffect(()=>{if(d.user&&ob===null)setOb(!d.habits.length)},[d.user,d.habits,ob]);
 if(d.loading)return <main><div className="card" aria-busy="true">Memuat…</div></main>;
 if(d.rec&&d.user)return <ResetPassword onDone={d.clearRec}/>;
 if(!d.user)return <Auth onDone={d.load}/>;
 const hid=page.startsWith('habit/')?page.slice(6):null,p=hid?'habit':[...NAV.map(n=>n[0]),'new'].includes(page)?page:'home',close=()=>setOb(false);
 const cur=p==='habit'||p==='new'?'habits':p,sub=NAV.filter(n=>n[3]==='dm');
 let view;
 if(p==='home')view=ob?<Onboarding habits={d.habits} load={d.load} onClose={close}/>:<Home {...d}/>;
 else view={habits:<Habits {...d}/>,new:<NewHabit load={d.load}/>,habit:<HabitDetail id={hid} {...d}/>,calendar:<Calendar {...d}/>,goals:<Goals {...d}/>,stats:<Stats {...d}/>,reflect:<Reflect {...d}/>,achievements:<Achievements {...d}/>,history:<History {...d}/>,profile:<Profile {...d}/>,settings:<Settings {...d}/>,
  menu:<><h1>Menu</h1>{sub.map(n=><a key={n[0]} href={'#'+n[0]} className="card h" style={{textDecoration:'none',color:'inherit'}}><div className="ic" aria-hidden="true">{n[1]}</div><b>{n[2]}</b></a>)}</>}[p];
 return <><nav aria-label="Navigasi utama">{NAV.map(n=>{const on=n[0]===cur||(n[0]==='menu'&&sub.some(s=>s[0]===cur));return <a key={n[0]} href={'#'+n[0]} className={[n[3],on?'on':''].join(' ').trim()} aria-current={on?'page':undefined}><span aria-hidden="true">{n[1]}</span>{n[2]}</a>})}</nav><main>{view}</main></>;
}
