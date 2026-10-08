import {today,addD,streaks,cons} from './habits';
// Daftar pencapaian [ikon, nama, deskripsi, nilai, target] — dipakai halaman Pencapaian dan preview di Beranda.
export function achievements(habits,comp,gd=0){
 const t=today(),best=Math.max(0,...habits.map(h=>streaks(comp,h).best)),cm=Math.max(0,...habits.filter(h=>h.start_date<=addD(t,-13)).map(h=>cons(comp,h,30)||0));
 const done=Object.entries(comp).filter(([k,v])=>{const h=habits.find(x=>String(x.id)===k.split('|')[0]);return h&&v>=h.target_value}).length;
 return [['👣','First Step','Selesaikan kebiasaan pertamamu.',done,1],['🔥','7 Day Streak','Pertahankan satu kebiasaan 7 hari terjadwal berturut-turut.',best,7],['🏗️','30 Day Builder','Pertahankan satu kebiasaan 30 hari terjadwal berturut-turut.',best,30],['🎯','Consistency Master','Capai konsistensi 90% dalam 30 hari terakhir.',cm,90],['💯','Habit Builder','Selesaikan 100 aktivitas kebiasaan.',done,100],['🏆','Goal Crusher','Selesaikan target pertamamu.',gd,1]];
}
