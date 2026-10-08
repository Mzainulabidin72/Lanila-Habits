import {useState,useEffect} from 'react';import useData from './hooks/useData';
import Auth from './pages/Auth';import Home from './pages/Home';import Habits from './pages/Habits';import NewHabit from './pages/NewHabit';
import Calendar from './pages/Calendar';import Stats from './pages/Stats';import Reflect from './pages/Reflect';import Settings from './pages/Settings';import HabitDetail from './pages/HabitDetail';
import Goals from './pages/Goals';import Achievements from './pages/Achievements';import Profile from './pages/Profile';import useReminders from './hooks/useReminders';import History from './pages/History';import {appFromUrl} from './lib/apps';import Icon from './components/Icon';import Logo from './components/Logo';import {setTheme} from './lib/theme';import ResetPassword from './pages/ResetPassword';
// [id, ikon, label, kelas] — 'dm' disembunyikan di bottom nav HP (masuk Menu), 'mo' hanya tampil di HP
const NAV=[['home','home','Beranda'],['habits','checkc','Kebiasaan'],['calendar','calendar','Kalender'],['goals','target','Target'],['stats','chart','Statistik','dm'],['reflect','pen','Refleksi','dm'],['achievements','award','Pencapaian','dm'],['history','clock','Riwayat','dm'],['profile','user','Profil','dm'],['settings','sliders','Pengaturan','dm'],['menu','menu','Menu','mo']];
export default function App(){
 const d=useData();useReminders(d.habits,d.comp);const[,tick]=useState(0);const [page,setPage]=useState(location.hash.slice(1)||'home'),[ob,setOb]=useState(null);
 useEffect(()=>{const f=()=>setPage(location.hash.slice(1)||'home');addEventListener('hashchange',f);return()=>removeEventListener('hashchange',f)},[]);
 useEffect(()=>{if(d.user&&ob===null)setOb(!d.habits.length&&!localStorage.getItem('ob:'+d.user.id));if(d.user&&d.habits.length)localStorage.setItem('ob:'+d.user.id,'1')},[d.user,d.habits,ob]);
 // Sudah login & datang dengan ?app=<aplikasi lain>: lanjutkan ke tujuan (URL hanya dari registry; sekali per 30 dtk anti-loop)
 useEffect(()=>{if(!d.user)return;const a=appFromUrl();if(a.self||!a.url)return;const k='sso:'+a.id;if(Date.now()-(+sessionStorage.getItem(k)||0)<30000)return;sessionStorage.setItem(k,String(Date.now()));location.replace(a.url)},[d.user]);
 if(d.loading)return <main><div className="card" aria-busy="true">Memuat…</div></main>;
 if(d.rec&&d.user)return <ResetPassword onDone={d.clearRec}/>;
 if(!d.user)return <Auth onDone={d.load}/>;
 const hid=page.startsWith('habit/')?page.slice(6):null,p=hid?'habit':[...NAV.map(n=>n[0]),'new'].includes(page)?page:'home',close=()=>{localStorage.setItem('ob:'+d.user.id,'1');setOb(false)};
 const cur=p==='habit'||p==='new'?'habits':p,sub=NAV.filter(n=>n[3]==='dm');
 let view;
 if(p==='home')view=<Home {...d} onboard={ob} onSkip={close}/>;
 else view={habits:<Habits {...d}/>,new:<NewHabit load={d.load}/>,habit:<HabitDetail id={hid} {...d}/>,calendar:<Calendar {...d}/>,goals:<Goals {...d}/>,stats:<Stats {...d}/>,reflect:<Reflect {...d}/>,achievements:<Achievements {...d}/>,history:<History {...d}/>,profile:<Profile {...d}/>,settings:<Settings {...d}/>,
  menu:<><h1>Menu</h1>{sub.map(n=><a key={n[0]} href={'#'+n[0]} className="card h" style={{textDecoration:'none',color:'inherit'}}><div className="ic"><Icon n={n[1]}/></div><b>{n[2]}</b></a>)}</>}[p];
 return <><nav aria-label="Navigasi utama"><div className="brand"><Logo/><span>Habits</span></div>{NAV.map(n=>{const on=n[0]===cur||(n[0]==='menu'&&sub.some(s=>s[0]===cur));return <a key={n[0]} href={'#'+n[0]} className={[n[3],on?'on':''].join(' ').trim()} aria-current={on?'page':undefined}><Icon n={n[1]}/>{n[2]}</a>})}</nav><main className={p==='home'?'wide':''}><header className="topbar"><b className="sp">{(NAV.find(n=>n[0]===cur)||[])[2]||'Lanila Habits'}</b>
  <button className="ib" aria-label="Ganti tema" onClick={()=>{setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');tick(n=>n+1)}}><Icon n={document.documentElement.dataset.theme==='dark'?'sun':'moon'}/></button>
  <a className="ib" href="#settings" aria-label="Pengingat dan notifikasi"><Icon n="bell"/></a>
  <a className="ib av" href="#profile" aria-label="Profil">{d.user.avatar?<img src={d.user.avatar} alt="" width="44" height="44"/>:d.user.name[0].toUpperCase()}</a></header>{view}</main></>;
}
