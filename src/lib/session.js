import {sb} from './supabase';import {t} from './i18n';
// Keluar dari akun (perangkat ini saja) dengan konfirmasi.
export const signOut=()=>{if(confirm(t('act.confirm')))sb.auth.signOut({scope:'local'})};
