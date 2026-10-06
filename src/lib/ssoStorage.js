// Penyimpanan sesi Supabase di cookie (dibagi lintas subdomain) — dipakai SEMUA aplikasi Lanila agar sekali login berlaku di semua.
// Prod: VITE_COOKIE_DOMAIN=.lanila.app  |  Dev: kosongkan (cookie host-only "localhost" dibagi lintas port).
// Catatan: cookie ini dibaca JavaScript (tidak bisa HttpOnly di SPA). Semua subdomain Lanila harus dipercaya.
const CH=1800,dom=import.meta.env.VITE_COOKIE_DOMAIN||'';
const attrs=age=>`; Path=/; Max-Age=${age}; SameSite=Lax${dom?'; Domain='+dom:''}${location.protocol==='https:'?'; Secure':''}`;
const read=n=>{const m=document.cookie.split('; ').find(c=>c.startsWith(n+'='));return m?decodeURIComponent(m.slice(n.length+1)):null};
const write=(n,v,age)=>{document.cookie=`${n}=${encodeURIComponent(v)}${attrs(age)}`};
const clear=k=>{const n=+read(k+'.n')||0;for(let i=0;i<=n;i++)write(`${k}.${i}`,'',0);write(k+'.n','',0)};
const set=(k,v)=>{clear(k);const n=Math.ceil(v.length/CH);for(let i=0;i<n;i++)write(`${k}.${i}`,v.slice(i*CH,(i+1)*CH),31536000);write(k+'.n',String(n),31536000)};
export const cookieStorage={
 getItem(k){const n=+read(k+'.n');
  if(n){let s='';for(let i=0;i<n;i++){const p=read(`${k}.${i}`);if(p===null)return null;s+=p}return s}
  const old=localStorage.getItem(k); // migrasi sesi lama (localStorage) agar user tidak ter-logout
  if(old){set(k,old);localStorage.removeItem(k)}return old},
 setItem:set,
 removeItem(k){clear(k);localStorage.removeItem(k)}};
