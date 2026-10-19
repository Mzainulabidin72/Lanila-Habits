import {LANILA_APPS} from '../lib/lanilaApps';
// Daftar aplikasi Lanila. Hanya aplikasi "available" dengan URL valid yang bisa diklik. Gaya memakai CSS variable bila ada (fallback netral)
// agar menyatu dengan tampilan Buku Kas tanpa mengubah desainnya. Tidak menyentuh autentikasi.
export default function LanilaAppLauncher(){
 return <div style={{display:'grid',gap:10,gridTemplateColumns:'repeat(auto-fill,minmax(min(260px,100%),1fr))'}}>{LANILA_APPS.map(a=>{
  const link=a.status==='available'&&!a.self&&a.url,box={display:'flex',alignItems:'center',gap:12,flexWrap:'wrap',padding:'10px 12px',borderRadius:12,border:'1px solid var(--border,#e5e9e4)',borderLeft:`4px solid ${a.accent}`,textDecoration:'none',color:'inherit',opacity:link||a.self?1:.7};
  const body=<><img src={a.icon} alt="" width="36" height="36" style={{borderRadius:9,flex:'none'}}/><span style={{flex:1,minWidth:0}}><b>{a.name}</b><br/><small style={{opacity:.7}}>{a.desc}</small></span>
   <small style={{border:'1px solid var(--border,#e5e9e4)',borderRadius:99,padding:'1px 10px',whiteSpace:'nowrap'}}>{a.self?'Sedang dibuka':a.status==='available'?'Tersedia':'Segera hadir'}</small></>;
  return link?<a key={a.id} href={a.url} style={box} aria-label={`Buka ${a.name}`}>{body}</a>:<div key={a.id} style={box}>{body}</div>})}</div>;
}
