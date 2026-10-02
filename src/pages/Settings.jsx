import {useState} from 'react';import {sb} from '../lib/supabase';import {getTheme,setTheme} from '../lib/theme';
export default function Settings({user}){
 const[th,setTh]=useState(getTheme());
 return <><h1>Pengaturan</h1><div className="card"><b>{user.name}</b><div className="mu">{user.email}</div></div>
  <div className="card"><label htmlFor="th">Tampilan</label><select id="th" value={th} onChange={e=>{setTh(e.target.value);setTheme(e.target.value)}}><option value="system">Ikuti sistem</option><option value="light">Terang</option><option value="dark">Gelap</option></select><p className="mu">Bahasa: Indonesia</p></div>
  <button className="btn" onClick={()=>sb.auth.signOut()}>Keluar</button></>;
}
