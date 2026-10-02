// Server statis tipis: menyajikan frontend + config Supabase dari .env (hanya URL & anon key).
const fs=require('fs'),express=require('express'),path=require('path');
const env={};try{fs.readFileSync(path.join(__dirname,'.env'),'utf8').split('\n').forEach(l=>{const m=/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(l);if(m)env[m[1]]=m[2].replace(/^["']|["']$/g,'')})}catch{}
const g=k=>process.env[k]||env[k]||'';
const app=express();
app.get('/config.js',(q,r)=>r.type('js').send('window.LANILA='+JSON.stringify({url:g('VITE_SUPABASE_URL'),key:g('VITE_SUPABASE_ANON_KEY')})+';'));
app.use(express.static(path.join(__dirname,'public')));
const P=process.env.PORT||3000;app.listen(P,()=>console.log('Lanila Habits: http://localhost:'+P));
