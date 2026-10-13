import {useState,useEffect,useCallback} from 'react';import {sb,ok} from '../lib/supabase';import {today,addD,sched,st} from '../lib/habits';import {toast} from '../lib/theme';import Icon from '../components/Icon';
const CA=['Kesehatan','Produktivitas','Belajar','Kebugaran','Spiritual','Keuangan','Tidur','Personal'],PR={high:'Tinggi',medium:'Sedang',low:'Rendah'},LB=['Belum dimulai','Berjalan','Tercapai','Terlambat'];
const SC={Tercapai:'ok','Terlambat':'late',Berjalan:'run','Belum dimulai':'idle'},norm=s=>(s||'').trim().toLowerCase();
const fmt=d=>d?new Date(d+'T00:00:00Z').toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}):'–';
// Progres target — tiga mode:
//  qty    : ada kebiasaan terkait + target angka + satuan SAMA dengan semua kebiasaan terkait → jumlah catatan nilai (1 catatan per kebiasaan per tanggal, tidak dihitung ganda)
//  cons   : ada kebiasaan terkait tapi tanpa pemetaan satuan → persentase penyelesaian hari terjadwal (mulai dari tanggal mulai target s/d min(hari ini, tenggat))
//  manual : tanpa kebiasaan aktif → nilai yang diisi sendiri (÷ target angka bila ada, atau langsung persen)
// Tercapai = ditandai manual, atau progres ≥100% pada mode qty/manual. Mode cons tidak otomatis "tercapai" (hari pertama bisa 100%).
function calc(g,ids,habits,comp){
 const t=today(),hs=habits.filter(h=>ids.includes(h.id)),end=g.target_date&&g.target_date<t?g.target_date:t;let mode,cur=0,pct=0,n=0,k=0;
 if(hs.length){
  if(g.target_value&&g.unit&&hs.every(h=>norm(h.unit)===norm(g.unit))){mode='qty';const set=new Set(hs.map(h=>String(h.id)));
   for(const key in comp){const[i,d]=key.split('|');if(set.has(i)&&d>=g.start_date&&d<=end)cur+=comp[key]}pct=Math.min(100,Math.round(cur/g.target_value*100))}
  else{mode='cons';hs.forEach(h=>{for(let d=g.start_date>h.start_date?g.start_date:h.start_date;d<=end;d=addD(d,1)){if(!sched(h,d))continue;const x=st(comp,h,d)==='done';if(d===t&&!x)continue;n++;if(x)k++}});pct=n?Math.round(k/n*100):0}
 }else{mode='manual';cur=g.current_value||0;pct=Math.min(100,Math.round(g.target_value?cur/g.target_value*100:cur))}
 const done=g.status==='completed'||(mode!=='cons'&&pct>=100);
 return{mode,cur,pct,hs,done,lost:ids.length>0&&!hs.length,label:done?'Tercapai':g.target_date&&g.target_date<t?'Terlambat':g.start_date>t||pct===0?'Belum dimulai':'Berjalan'};
}
function Form({goal,habits,links,onClose,onSaved}){
 const[f,setF]=useState({name:goal?.name||'',description:goal?.description||'',category:goal?.category||'Personal',priority:goal?.priority||'medium',start_date:goal?.start_date||today(),target_date:goal?.target_date||'',target_value:goal?.target_value?String(goal.target_value):'',unit:goal?.unit||'',ids:links}),[err,setErr]=useState(''),[busy,setBusy]=useState(false);
 const u=k=>e=>setF({...f,[k]:e.target.value}),tg=id=>setF({...f,ids:f.ids.includes(id)?f.ids.filter(x=>x!==id):[...f.ids,id]});
 const save=async e=>{e.preventDefault();if(busy)return;setErr('');
  if(!f.name.trim())return setErr('Nama target wajib diisi.');if(!f.start_date)return setErr('Tanggal mulai wajib diisi.');
  if(f.target_date&&f.target_date<f.start_date)return setErr('Tenggat tidak boleh sebelum tanggal mulai.');
  if(f.target_value&&!(+f.target_value>0))return setErr('Target angka harus lebih besar dari 0.');
  const body={name:f.name.trim(),description:f.description.trim(),category:f.category,priority:f.priority,start_date:f.start_date,target_date:f.target_date||null,target_value:f.target_value?+f.target_value:null,unit:f.unit.trim()};setBusy(true);
  try{let id=goal?.id;
   if(goal)await ok(sb.from('lh_goals').update(body).eq('id',id));else id=(await ok(sb.from('lh_goals').insert(body).select('id').single())).id;
   const add=f.ids.filter(x=>!links.includes(x)),rem=links.filter(x=>!f.ids.includes(x));
   if(rem.length)await ok(sb.from('lh_goal_habits').delete().eq('goal_id',id).in('habit_id',rem));
   if(add.length)await ok(sb.from('lh_goal_habits').insert(add.map(h=>({goal_id:id,habit_id:h}))));
   await onSaved(goal?'Target diperbarui':'Target dibuat')}catch(x){setErr(x.message);setBusy(false)}};
 return <form className="panel" onSubmit={save} noValidate style={{borderColor:'var(--ac)'}}><h2 style={{marginTop:0}}>{goal?'Edit target':'Buat target'}</h2>
  <label htmlFor="gn">Nama target</label><input id="gn" maxLength={80} value={f.name} onChange={u('name')}/>
  <label htmlFor="gd">Deskripsi (opsional)</label><textarea id="gd" rows="2" maxLength={500} value={f.description} onChange={u('description')}/>
  <div className="fg"><div><label htmlFor="gc">Kategori</label><select id="gc" value={f.category} onChange={u('category')}>{CA.map(c=><option key={c}>{c}</option>)}</select></div><div><label htmlFor="gp">Prioritas</label><select id="gp" value={f.priority} onChange={u('priority')}>{Object.entries(PR).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></div>
   <div><label htmlFor="gs">Tanggal mulai</label><input id="gs" type="date" value={f.start_date} onChange={u('start_date')}/></div><div><label htmlFor="gt">Tenggat (opsional)</label><input id="gt" type="date" min={f.start_date} value={f.target_date} onChange={u('target_date')}/></div>
   <div><label htmlFor="gv">Target angka (opsional)</label><input id="gv" type="number" min="0" step="any" value={f.target_value} onChange={u('target_value')}/></div><div><label htmlFor="gu">Satuan</label><input id="gu" maxLength={20} placeholder="mis. km, halaman" value={f.unit} onChange={u('unit')}/></div></div>
  <b>Kebiasaan terkait (opsional)</b>{habits.length?habits.map(h=><label key={h.id} className="row" style={{minHeight:44}}><input type="checkbox" style={{width:22,minHeight:22,margin:0}} checked={f.ids.includes(h.id)} onChange={()=>tg(h.id)}/> {h.icon} {h.name}{h.unit?<span className="mu"> · {h.unit}</span>:null}</label>):<p className="mu">Belum ada kebiasaan aktif.</p>}
  <p className="mu">Jika target angka dan satuannya sama dengan satuan kebiasaan terkait, progres dihitung dari catatan kebiasaan. Jika tidak, progres dihitung dari konsistensi kebiasaan. Tanpa kebiasaan, progres kamu isi sendiri.</p>
  <div className="err" role="alert">{err}</div><div className="row"><button className="btn p" disabled={busy}>{busy?'Menyimpan…':'Simpan target'}</button><button type="button" className="btn" onClick={onClose}>Batal</button></div></form>;
}
export default function Goals({habits,comp}){
 const[g,setG]=useState(null),[gh,setGh]=useState([]),[err,setErr]=useState(''),[form,setForm]=useState(null),[open,setOpen]=useState(null),[q,setQ]=useState(''),[fs,setFs]=useState('all'),[fc,setFc]=useState('all'),[sort,setSort]=useState('deadline');
 const load=useCallback(async()=>{try{const[a,b]=await Promise.all([ok(sb.from('lh_goals').select('*').order('id',{ascending:false})),ok(sb.from('lh_goal_habits').select('goal_id,habit_id'))]);setG(a);setGh(b);setErr('')}catch{setG([]);setErr('Data target gagal dimuat. Pastikan migration_goals.sql dan migration_goals_v2.sql sudah dijalankan.')}},[]);
 useEffect(()=>{load()},[load]);
 const act=async(fn,msg)=>{try{await fn();await load();if(msg)toast(msg)}catch(e){toast(e.message)}};
 const linksOf=id=>gh.filter(r=>r.goal_id===id).map(r=>r.habit_id);
 const rows=(g||[]).map(x=>({x,c:calc(x,linksOf(x.id),habits,comp)})),act2=rows.filter(r=>!r.c.done),avg=act2.length?Math.round(act2.reduce((a,r)=>a+r.c.pct,0)/act2.length):null;
 const list=rows.filter(({x,c})=>x.name.toLowerCase().includes(q.trim().toLowerCase())&&(fs==='all'||c.label===fs)&&(fc==='all'||x.category===fc))
  .sort((a,b)=>sort==='progress'?b.c.pct-a.c.pct:sort==='new'?b.x.id-a.x.id:(a.x.target_date||'9999')<(b.x.target_date||'9999')?-1:1);
 const stat=(a,b,c)=><div className="card"><span className="mu">{a}</span><b>{b}</b><span className="mu">{c}</span></div>,filtered=q||fs!=='all'||fc!=='all';
 return <><div className="row" style={{flexWrap:'wrap'}}><div className="sp" style={{minWidth:240}}><h1 style={{margin:0}}>Target</h1><p className="mu" style={{margin:'.2rem 0 0'}}>Tetapkan tujuan, pantau progres, dan rayakan setiap pencapaian.</p></div>
   <button className="btn p" style={{display:'inline-flex',alignItems:'center',gap:6}} onClick={()=>setForm('new')}><Icon n="plus" s={16}/>Buat target</button></div>
  <div className="stats s3">{stat('Target aktif',g===null?'…':act2.length,'Belum tercapai')}{stat('Target tercapai',g===null?'…':rows.length-act2.length,'Selesai')}{stat('Progres rata-rata',avg==null?'–':avg+'%','Target aktif')}</div>
  {err&&<div className="panel err" role="alert">{err}</div>}
  {form&&<Form key={form==='new'?'new':form.id} goal={form==='new'?null:form} habits={habits} links={form==='new'?[]:linksOf(form.id)} onClose={()=>setForm(null)} onSaved={async m=>{setForm(null);await load();toast(m)}}/>}
  {g===null?<div className="ggrid" aria-busy="true">{[1,2,3].map(i=><div key={i} className="panel" style={{margin:0,minHeight:160,opacity:.5}}/>)}</div>
  :!g.length?(!err&&!form&&<div className="panel" style={{maxWidth:520,margin:'1rem auto',textAlign:'center',padding:'2rem 1rem'}}><div style={{color:'var(--ac)'}}><Icon n="target" s={40}/></div><h2 style={{margin:'.6rem 0 .3rem'}}>Mulai dari satu target kecil</h2><p className="mu">Pilih sesuatu yang ingin kamu capai, tentukan tenggat waktunya, lalu bangun kebiasaan untuk mewujudkannya.</p><button className="btn p" onClick={()=>setForm('new')}>Buat target pertama</button></div>)
  :<><div className="tb"><input type="search" aria-label="Cari target" placeholder="Cari target…" style={{flex:'2 1 160px'}} value={q} onChange={e=>setQ(e.target.value)}/>
    <select aria-label="Status" style={{flex:'1 1 130px'}} value={fs} onChange={e=>setFs(e.target.value)}><option value="all">Semua status</option>{LB.map(l=><option key={l}>{l}</option>)}</select>
    <select aria-label="Kategori" style={{flex:'1 1 130px'}} value={fc} onChange={e=>setFc(e.target.value)}><option value="all">Semua kategori</option>{[...new Set(g.map(x=>x.category))].map(c=><option key={c}>{c}</option>)}</select>
    <select aria-label="Urutkan" style={{flex:'1 1 130px'}} value={sort} onChange={e=>setSort(e.target.value)}><option value="deadline">Tenggat terdekat</option><option value="progress">Progres tertinggi</option><option value="new">Terbaru</option></select></div>
   {list.length?<div className="ggrid">{list.map(({x,c})=><article key={x.id} className="panel" style={{margin:0}}>
    <div className="row" style={{alignItems:'flex-start'}}><div className="sp" style={{minWidth:0}}><b style={{fontSize:'1.05rem'}}>{x.name}</b>{x.description&&<div className="mu clamp">{x.description}</div>}</div><span className={'bdg '+SC[c.label]}>{c.label}</span></div>
    <div className="mu" style={{margin:'.5rem 0'}}>{x.category} · Prioritas {PR[x.priority]} · {fmt(x.start_date)} – {fmt(x.target_date)}</div>
    <div className="row mu" style={{marginBottom:4}}><span className="sp">{c.mode==='qty'?`${+c.cur.toFixed(1)} / ${x.target_value} ${x.unit}`:c.mode==='cons'?'Konsistensi kebiasaan terkait':x.target_value?`${c.cur} / ${x.target_value} ${x.unit}`:'Progres manual'}</span><b style={{color:'var(--tx)'}}>{c.pct}%</b></div>
    <div className="bar" role="progressbar" aria-label={'Progres '+x.name} aria-valuenow={c.pct} aria-valuemin="0" aria-valuemax="100"><i style={{width:c.pct+'%'}}/></div>
    {c.lost&&<p className="mu" style={{margin:'.5rem 0 0'}}>Kebiasaan terkait sedang tidak aktif — perbarui progres secara manual.</p>}
    {c.mode==='manual'&&!c.done&&<form className="row" style={{marginTop:'.6rem'}} onSubmit={e=>{e.preventDefault();const v=+e.target.elements.v.value;if(!(v>=0))return toast('Nilai tidak valid.');act(()=>ok(sb.from('lh_goals').update({current_value:v}).eq('id',x.id)),'Progres diperbarui')}}>
     <label htmlFor={'p'+x.id} className="mu">Progres{x.target_value?` (${x.unit||'angka'})`:' (%)'}</label><input id={'p'+x.id} name="v" className="num" type="number" min="0" step="any" defaultValue={x.current_value} key={x.current_value}/><button className="btn">Simpan</button></form>}
    {open===x.id&&<div className="mu" style={{marginTop:'.7rem',borderTop:'1px solid var(--bd)',paddingTop:'.6rem'}}>
     <div>Dibuat {fmt(x.created_at?.slice(0,10))}{x.completed_at?` · Tercapai ${fmt(x.completed_at.slice(0,10))}`:''}</div>
     <div>Cara hitung: {c.mode==='qty'?'jumlah nilai dari kebiasaan terkait':c.mode==='cons'?'persentase penyelesaian hari terjadwal kebiasaan terkait':'diisi manual'}.</div>
     {c.mode==='cons'&&x.target_value&&x.unit&&<div>Satuan target tidak sama dengan satuan kebiasaan terkait, jadi memakai konsistensi.</div>}
     <div>Kebiasaan terkait: {c.hs.length?c.hs.map(h=>h.icon+' '+h.name).join(', '):'tidak ada'}</div></div>}
    <div className="row" style={{flexWrap:'wrap',marginTop:'.8rem'}}><button className="btn" aria-expanded={open===x.id} onClick={()=>setOpen(open===x.id?null:x.id)}>Detail</button><button className="btn" onClick={()=>{setForm(x);window.scrollTo({top:0,behavior:'smooth'})}}>Edit</button>
     {x.status==='completed'?<button className="btn" onClick={()=>act(()=>ok(sb.from('lh_goals').update({status:'active',completed_at:null}).eq('id',x.id)),'Target dibuka kembali')}>Buka kembali</button>:<button className="btn p" onClick={()=>act(()=>ok(sb.from('lh_goals').update({status:'completed',completed_at:new Date().toISOString()}).eq('id',x.id)),'Target ditandai tercapai')}>Tandai tercapai</button>}
     <button className="btn" onClick={()=>{if(confirm('Hapus target ini? Kebiasaan dan riwayatnya tetap aman.'))act(()=>ok(sb.from('lh_goals').delete().eq('id',x.id)),'Target dihapus')}}>Hapus</button></div></article>)}</div>
   :<div style={{textAlign:'center',padding:'1.2rem 0'}}><b>Tidak ada target yang cocok</b><p className="mu">Coba kata kunci atau filter lain.</p>{filtered&&<button className="btn" onClick={()=>{setQ('');setFs('all');setFc('all')}}>Reset filter</button>}</div>}</>}</>;
}
