import {useState} from 'react';import {sb,ok} from '../lib/supabase';import {today} from '../lib/habits';import {toast} from '../lib/theme';
const SUG={Kesehatan:[['Minum 2L air','💧',2,'liter'],['Olahraga','🏃',1,''],['Tidur sebelum 23:00','😴',1,'']],Belajar:[['Baca 10 halaman','📖',10,'halaman'],['Belajar 30 menit','🧠',30,'menit'],['Latihan bahasa Inggris','🗣️',15,'menit']],Produktivitas:[['Rencanakan hari esok','🗓️',1,''],['Deep work 60 menit','💻',60,'menit'],['Kurangi media sosial','📵',1,'']],Spiritual:[['Meditasi 10 menit','🧘',10,'menit']],Keuangan:[['Catat pengeluaran','💰',1,'']]};
export default function Onboarding({habits,load,onClose}){
 const[ch,setCh]=useState([]);
 const tg=c=>setCh(ch.includes(c)?ch.filter(x=>x!==c):[...ch,c]);
 const add=async(c,i)=>{const[name,icon,target_value,unit]=SUG[c][i];try{await ok(sb.from('lh_habits').insert({name,icon,category:c,frequency:'daily',target_value,unit,start_date:today()}));await load()}catch(e){toast(e.message)}};
 return <><h1>Mulai membangun kebiasaanmu</h1><p className="mu">Belum ada kebiasaan yang dibuat. Pilih kategori untuk mendapatkan rekomendasi.</p>
  <div className="row" style={{flexWrap:'wrap'}}>{Object.keys(SUG).map(c=><button key={c} className={'btn '+(ch.includes(c)?'p':'')} aria-pressed={ch.includes(c)} onClick={()=>tg(c)}>{c}</button>)}</div>
  {ch.length>0&&<h2>Saran kebiasaan</h2>}
  {ch.flatMap(c=>SUG[c].map((x,i)=>{const a=habits.some(h=>h.name===x[0]);return <div key={c+i} className="card h"><div className="ic">{x[1]}</div><div className="sp"><b>{x[0]}</b><div className="mu">{c}</div></div><button className="btn" disabled={a} onClick={()=>add(c,i)}>{a?'Ditambahkan ✓':'Tambah'}</button></div>}))}
  <div className="row" style={{marginTop:'1rem'}}><a className="btn p" style={{display:'flex',alignItems:'center',textDecoration:'none'}} href="#new" onClick={onClose}>Mulai membuat kebiasaan</a><span className="sp"/><button className="btn" onClick={onClose}>{habits.length?'Selesai':'Lewati untuk sekarang'}</button></div></>;
}
