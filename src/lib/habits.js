export const today=()=>new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Jakarta'});
export const addD=(d,n)=>{const t=new Date(d+'T00:00:00Z');t.setUTCDate(t.getUTCDate()+n);return t.toISOString().slice(0,10)};
export const dow=d=>new Date(d+'T00:00:00Z').getUTCDay();
export const sched=(h,d)=>d>=h.start_date&&(h.frequency==='daily'||(h.frequency==='weekdays'?dow(d)>0&&dow(d)<6:dow(d)%6===0));
export const val=(c,h,d)=>c[h.id+'|'+d]||0;
export const st=(c,h,d)=>{const v=val(c,h,d);return v>=h.target_value?'done':v>0?'part':'miss'};
export function streaks(c,h){const t=today();let run=0,best=0;for(let d=h.start_date;d<=t;d=addD(d,1)){if(!sched(h,d))continue;if(st(c,h,d)==='done'){run++;best=Math.max(best,run)}else if(d!==t)run=0}return{cur:run,best}}
export function cons(c,h,days){const t=today();let n=0,k=0;for(let i=0;i<days;i++){const d=addD(t,-i);if(sched(h,d)){n++;if(st(c,h,d)==='done')k++}}return n?Math.round(k/n*100):null}
export const dayRatio=(c,H,d)=>{const s=H.filter(h=>sched(h,d));return s.length?{n:s.length,k:s.filter(h=>st(c,h,d)==='done').length,p:s.filter(h=>st(c,h,d)==='part').length}:null};
export const score=(c,H,d)=>{const s=H.filter(h=>sched(h,d));return s.length?Math.round(s.reduce((a,h)=>a+Math.min(val(c,h,d)/h.target_value,1),0)/s.length*100):0};
