import {APPS} from '../lib/apps';import {useT} from '../lib/i18n';
// Kartu ekosistem Lanila dari registry. Hanya kartu dengan status "available" dan URL valid yang bisa diklik. Nama aplikasi tidak diterjemahkan.
export default function AppLauncher(){
 const t=useT();
 return <div className="agrid" style={{marginTop:'.8rem'}}>{APPS.map(a=>{const link=a.status==='available'&&!a.self&&a.url,s={borderLeft:`4px solid ${a.accent}`};
  const inner=<><img src={a.icon} alt="" width="40" height="40" style={{borderRadius:10,flex:'none'}}/><span className="sp" style={{minWidth:0}}><b>{a.name}</b><br/><span className="mu">{t('app.'+a.id)}</span></span>
   <span className={'bdg'+(a.self?' run':a.status==='available'?' ok':'')}>{a.self?t('st.current'):t('st.'+(a.status==='available'?'available':a.status==='unavailable'?'unavailable':'soon'))}</span></>;
  return link?<a key={a.id} href={a.url} className="card row eco" style={s} aria-label={t('open',{name:a.name})}>{inner}</a>:<div key={a.id} className="card row eco off" style={s}>{inner}</div>})}</div>;
}
