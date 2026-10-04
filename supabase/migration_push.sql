-- Lanila Habits — push notification. Jalankan sekali di Supabase SQL Editor. Aman diulang.
create table if not exists public.lh_push_subs(
 id bigint generated always as identity primary key,
 user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 endpoint text not null unique, p256dh text not null, auth text not null,
 created_at timestamptz not null default now());
alter table public.lh_push_subs enable row level security;
drop policy if exists own on public.lh_push_subs;
create policy own on public.lh_push_subs for all to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
-- Catatan pengingat yang sudah terkirim (mencegah kirim ganda). Tanpa policy = hanya service role (Edge Function) yang bisa akses.
create table if not exists public.lh_push_sent(
 habit_id bigint not null references public.lh_habits(id) on delete cascade,
 date date not null, primary key(habit_id,date));
alter table public.lh_push_sent enable row level security;
