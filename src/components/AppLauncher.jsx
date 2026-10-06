import {APPS} from '../lib/apps';
export default function AppLauncher(){
 return <div className="card"><b>Aplikasi Lanila</b><p className="mu">Satu akun untuk semua aplikasi Lanila.</p>
  {APPS.filter(a=>!a.self).map(a=><div key={a.id} className="row" style={{minHeight:52}}><img src={a.icon} alt="" width="34" height="34" style={{borderRadius:9}}/>
   <span className="sp"><b>{a.name}</b><br/><span className="mu">{a.desc}</span></span>
   {a.status==='available'?<a className="btn" style={{display:'inline-flex',alignItems:'center',textDecoration:'none'}} href={a.url}>Buka</a>:<span className="sw-b">Segera hadir</span>}</div>)}</div>;
}
