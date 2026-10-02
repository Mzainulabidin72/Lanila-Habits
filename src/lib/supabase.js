import {createClient} from '@supabase/supabase-js';
export const sb=createClient(import.meta.env.VITE_SUPABASE_URL,import.meta.env.VITE_SUPABASE_ANON_KEY);
export const ok=async p=>{const{data,error}=await p;if(error)throw Error('Terjadi kesalahan. Coba lagi.');return data};
export const pg=async mk=>{let o=[],i=0,d;do{d=await ok(mk().range(i,i+999));o=o.concat(d);i+=1000}while(d.length===1000);return o};
