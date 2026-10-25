import Logo from './Logo';import ThemeToggle from './ThemeToggle';import {useT} from '../lib/i18n';
// Layout dua kolom khusus Lanila Habits: kiri = identitas produk, kanan = kartu autentikasi.
export default function AuthLayout({children}){
 const t=useT();
 return <div className="authx">
  <ThemeToggle/><aside className="authx-l"><div className="authx-g"><div className="authx-lg"><Logo/></div>
   <div className="authx-c"><span className="authx-pill"><img src="/apps/lanila-habits.png" alt="" width="28" height="28"/>Lanila Habits</span>
    <h2>{t('lp.headline')}</h2><p className="mu">{t('lp.sub')}</p>
    <ul className="authx-f">{['lp.f1','lp.f2','lp.f3'].map(k=><li key={k}>{t(k)}</li>)}</ul></div></div>
   <small className="mu">© Lanila 2026</small></aside>
  <section className="authx-r"><div className="authx-card">{children}</div></section></div>;
}
