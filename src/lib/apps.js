// Registry aplikasi Lanila — satu-satunya sumber daftar aplikasi, copy panel kiri, dan tujuan redirect (allowlist).
// URL aplikasi lain diisi lewat env; tanpa URL yang valid, status otomatis "soon" (tidak bisa dipilih).
const env=import.meta.env;
const safe=u=>{if(!u)return null;try{const x=new URL(u,location.origin);return /^https?:$/.test(x.protocol)?x.href:null}catch{return null}};
const RAW=[
 {id:'lanila',name:'Lanila',desc:'Ekosistem aplikasi Lanila',accent:'#5b5bd6',url:env.VITE_APP_URL_LANILA,
  headline:'Satu akun, semua aplikasi Lanila.',sub:'Kelola keuangan, rencanakan acara, bangun kebiasaan, atur waktu, dan pantau aset dalam satu ekosistem.',
  features:['Satu akun untuk semua aplikasi','Data tiap aplikasi tetap terpisah dan aman','Mudah berpindah antar aplikasi']},
 {id:'lanila-buku-kas',name:'Lanila Buku Kas',desc:'Kelola keuangan dengan lebih mudah',accent:'#1f9d63',url:env.VITE_APP_URL_BUKU_KAS,
  headline:'Kelola keuangan dengan lebih mudah dan teratur.',sub:'Catat pemasukan dan pengeluaran, pantau anggaran, dan pahami arus kasmu.',
  features:['Catat transaksi dengan cepat','Pantau anggaran dan arus kas','Lihat laporan keuangan yang jelas']},
 {id:'lanila-habits',name:'Lanila Habits',desc:'Bangun kebiasaan baik setiap hari',accent:'#f08a1c',url:'/',self:true,
  headline:'Bangun kebiasaan baik, satu hari pada satu waktu.',sub:'Track kebiasaan, bangun streak, dan lihat perkembangan dirimu dalam satu tempat.',
  features:['Buat dan kelola kebiasaan','Pantau streak dan konsistensi','Lihat perkembangan dari waktu ke waktu']},
 {id:'lanila-wedding-planner',name:'Lanila Wedding Planner',desc:'Rencanakan pernikahan dengan terstruktur',accent:'#e5484d',url:env.VITE_APP_URL_WEDDING_PLANNER,
  headline:'Rencanakan pernikahan impianmu dengan terstruktur.',sub:'Atur tamu, vendor, dan anggaran pernikahan dalam satu tempat.',
  features:['Kelola daftar tamu','Pantau vendor dan anggaran','Susun rencana langkah demi langkah']},
 {id:'lanila-time-blocking',name:'Lanila Time Blocking',desc:'Atur waktu dan tingkatkan produktivitas',accent:'#7c5cf0',url:env.VITE_APP_URL_TIME_BLOCKING,
  headline:'Atur waktu, capai lebih banyak.',sub:'Rancang harimu dalam blok waktu yang fokus dan terukur.',
  features:['Susun jadwal harian','Fokus pada prioritas','Evaluasi penggunaan waktumu']},
 {id:'lanila-asset',name:'Lanila Asset',desc:'Pantau dan kelola aset',accent:'#0ea5b7',url:env.VITE_APP_URL_ASSET,
  headline:'Pantau dan kelola aset untuk masa depan.',sub:'Catat aset, lihat nilainya, dan rencanakan dengan lebih tenang.',
  features:['Catat semua aset','Pantau nilai dari waktu ke waktu','Kelola dengan lebih terencana']}];
export const APPS=RAW.map(a=>{const url=safe(a.url);return{...a,url,icon:`/apps/${a.id}.png`,status:a.self||url?'available':'soon'}});
export const DEFAULT_APP='lanila-habits';
// ?app= dari URL divalidasi terhadap registry; id tak dikenal / belum tersedia → aplikasi ini.
export const getApp=id=>APPS.find(a=>a.id===id&&a.status==='available')||APPS.find(a=>a.id===DEFAULT_APP);
export const appFromUrl=()=>getApp(new URLSearchParams(location.search).get('app'));
