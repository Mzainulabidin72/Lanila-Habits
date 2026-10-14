import {sb} from './supabase';
// Keluar dari akun (perangkat ini saja) dengan konfirmasi.
export const signOut=()=>{if(confirm('Keluar dari akun Lanila di perangkat ini?'))sb.auth.signOut({scope:'local'})};
