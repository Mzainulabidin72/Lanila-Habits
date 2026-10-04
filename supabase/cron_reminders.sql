-- Jadwal tiap menit untuk Edge Function send-reminders. Ganti GANTI_CRON_SECRET (sama dengan secret CRON_SECRET). Jalankan sekali.
create extension if not exists pg_cron;
create extension if not exists pg_net;
select cron.schedule('lh-send-reminders','* * * * *',$$
 select net.http_post(url:='https://otumcninbgypccbftwto.supabase.co/functions/v1/send-reminders',
  headers:='{"Content-Type":"application/json","x-cron-secret":"GANTI_CRON_SECRET"}'::jsonb) $$);
-- Hentikan jadwal: select cron.unschedule('lh-send-reminders');
