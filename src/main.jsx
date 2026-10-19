import React from 'react';import {createRoot} from 'react-dom/client';import './styles/app.css';import {applyTheme} from './lib/theme';import {getLang} from './lib/i18n';
applyTheme();document.documentElement.lang=getLang();
const root=createRoot(document.getElementById('root'));
const Msg=({title,text})=><div role="alert" style={{maxWidth:520,margin:'15vh auto',padding:'1.5rem',fontFamily:'system-ui,sans-serif',color:'var(--tx)'}}><h1 style={{fontSize:'1.3rem'}}>{title}</h1><p style={{color:'var(--mu)'}}>{text}</p></div>;
// Mencegah layar kosong: pesan jelas bila render gagal.
class EB extends React.Component{state={e:null};static getDerivedStateFromError(e){return{e}}componentDidCatch(e){console.error(e)}
 render(){return this.state.e?<Msg title="Terjadi kesalahan" text="Halaman gagal dimuat. Muat ulang; jika berulang, buka console browser (F12) untuk detail error."/>:this.props.children}}
const miss=['VITE_SUPABASE_URL','VITE_SUPABASE_ANON_KEY'].filter(k=>!import.meta.env[k]);
if(miss.length)root.render(<Msg title="Konfigurasi belum lengkap" text={`Variabel lingkungan belum diisi: ${miss.join(', ')}. Isi di Vercel → Settings → Environment Variables, lalu redeploy.`}/>);
else import('./App').then(m=>root.render(<EB><m.default/></EB>)).catch(e=>{console.error(e);root.render(<Msg title="Terjadi kesalahan" text="Aplikasi gagal dimuat. Buka console browser (F12) untuk detail error."/>)});
