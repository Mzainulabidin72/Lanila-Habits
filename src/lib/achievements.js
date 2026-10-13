import {today,addD,streaks,cons,sched,st} from './habits';
// Format tiap pencapaian: [ikon, nama, deskripsi, nilai, target, kategori, xp, satuan, halaman, tanggalDiperoleh|null]
// Pencapaian tidak disimpan di database: status & tanggal dihitung dari catatan nyata (tanggal = hari syarat pertama kali terpenuhi).
// XP = 10 per aktivitas selesai + bonus tiap pencapaian terbuka.
export const XP_PER=10;
const streakDate=(c,h,N)=>{const t=today();let run=0;for(let d=h.start_date;d<=t;d=addD(d,1)){if(!sched(h,d))continue;if(st(c,h,d)==='done'){run++;if(run>=N)return d}else if(d!==t)run=0}return null};
export function achievements(habits,comp,gd=0,gdate=null){
 const t=today(),best=Math.max(0,...habits.map(h=>streaks(comp,h).best)),cm=Math.max(0,...habits.filter(h=>h.start_date<=addD(t,-13)).map(h=>cons(comp,h,30)||0));
 const dd=[];Object.entries(comp).forEach(([k,v])=>{const [i,d]=k.split('|'),h=habits.find(x=>String(x.id)===i);if(h&&v>=h.target_value)dd.push(d)});dd.sort();
 const sd=N=>habits.map(h=>streakDate(comp,h,N)).filter(Boolean).sort()[0]||null,done=dd.length;
 return [['👣','First Step','Selesaikan kebiasaan pertamamu.',done,1,'Aktivitas',50,'aktivitas','habits',dd[0]||null],
  ['🔥','7 Day Streak','Pertahankan satu kebiasaan 7 hari terjadwal berturut-turut.',best,7,'Streak',100,'hari','habits',sd(7)],
  ['🏗️','30 Day Builder','Pertahankan satu kebiasaan 30 hari terjadwal berturut-turut.',best,30,'Streak',300,'hari','habits',sd(30)],
  ['🎯','Consistency Master','Capai konsistensi 90% dalam 30 hari terakhir.',cm,90,'Konsistensi',250,'%','habits',null],
  ['💯','Habit Builder','Selesaikan 100 aktivitas kebiasaan.',done,100,'Aktivitas',200,'aktivitas','habits',dd[99]||null],
  ['🏆','Goal Crusher','Selesaikan target pertamamu.',gd,1,'Target',150,'target','goals',gdate]];
}
