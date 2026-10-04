import {useState,useRef,useEffect} from 'react';import {APPS} from '../lib/apps';
function Icon({a,s=34}){const[bad,setBad]=useState(false);
 return bad?<span aria-hidden="true" style={{width:s,height:s,borderRadius:9,background:a.accent,color:'#fff',display:'grid',placeItems:'center',fontWeight:700,flex:'none'}}>{a.name.replace('Lanila ','')[0]}</span>
  :<img src={a.icon} alt="" width={s} height={s} style={{borderRadius:9,flex:'none'}} onError={()=>setBad(true)}/>}
export default function AppSwitcher({value,onChange}){
 const[open,setOpen]=useState(false),[hi,setHi]=useState(0),box=useRef(),cur=APPS.find(a=>a.id===value.id);
 useEffect(()=>{if(!open)return;const f=e=>{if(!box.current.contains(e.target))setOpen(false)};document.addEventListener('mousedown',f);return()=>document.removeEventListener('mousedown',f)},[open]);
 const openIt=()=>{setHi(APPS.indexOf(cur));setOpen(true)};
 const pick=a=>{if(a.status!=='available')return;onChange(a);setOpen(false)};
 const key=e=>{
  if(!open){if(['ArrowDown','ArrowUp','Enter',' '].includes(e.key)){e.preventDefault();openIt()}return}
  if(e.key==='Escape'){e.preventDefault();setOpen(false)}
  else if(e.key==='ArrowDown'){e.preventDefault();setHi((hi+1)%APPS.length)}
  else if(e.key==='ArrowUp'){e.preventDefault();setHi((hi+APPS.length-1)%APPS.length)}
  else if(e.key==='Home'){e.preventDefault();setHi(0)}else if(e.key==='End'){e.preventDefault();setHi(APPS.length-1)}
  else if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(APPS[hi])}
  else if(e.key==='Tab')setOpen(false)};
 return <div className="sw" ref={box}><span id="sw-l" className="mu">Aplikasi tujuan</span>
  <div className="sw-t" role="combobox" tabIndex={0} aria-haspopup="listbox" aria-expanded={open} aria-controls="sw-list" aria-labelledby="sw-l" aria-activedescendant={open?'opt-'+APPS[hi].id:undefined}
   style={{borderLeft:`4px solid ${cur.accent}`}} onClick={()=>open?setOpen(false):openIt()} onKeyDown={key}>
   <Icon a={cur}/><b className="sp" style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{cur.name}</b><span aria-hidden="true">{open?'▴':'▾'}</span></div>
  {open&&<ul id="sw-list" className="sw-l" role="listbox" aria-label="Pilih aplikasi Lanila"><li className="mu" role="presentation" style={{padding:'.3rem .6rem'}}>Pilih aplikasi Lanila</li>
   {APPS.map((a,i)=><li key={a.id} id={'opt-'+a.id} role="option" aria-selected={a.id===cur.id} aria-disabled={a.status!=='available'} className="sw-o" data-hi={i===hi} style={{borderLeftColor:a.accent}}
    onMouseEnter={()=>setHi(i)} onClick={()=>pick(a)}><Icon a={a}/><span className="sp" style={{minWidth:0}}><b>{a.name}</b><br/><span className="mu">{a.desc}</span></span>
    {a.status!=='available'?<span className="sw-b">Segera hadir</span>:a.id===cur.id&&<b aria-label="Dipilih">✓</b>}</li>)}</ul>}</div>;
}
