import Logo from './Logo';import ThemeToggle from './ThemeToggle';
// Layout dua kolom (acuan: login Buku Kas): kiri = pengalaman produk (berubah mengikuti aplikasi terpilih), kanan = kartu autentikasi terpadu.
export default function AuthLayout({app,children}){
 return <div className="authx" style={{'--pa':app.accent}}>
  <ThemeToggle/><aside className="authx-l"><div className="authx-g"><div className="authx-lg"><Logo/></div>
   <div className="authx-c" key={app.id}><span className="authx-pill"><img src={app.icon} alt="" width="28" height="28"/>{app.name}</span>
    <h2>{app.headline}</h2><p className="mu">{app.sub}</p>
    <ul className="authx-f">{app.features.map(f=><li key={f}>{f}</li>)}</ul></div></div>
   <small className="mu">© Lanila 2026</small></aside>
  <section className="authx-r"><div className="authx-card">{children}</div></section></div>;
}
