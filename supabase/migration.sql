-- Lanila Habits — jalankan di Supabase Dashboard > SQL Editor. Aman diulang.
-- Prefix lh_ agar tidak bentrok dengan tabel aplikasi Lanila lain. Auth memakai auth.users bersama.
create table if not exists public.lh_habits(
 id bigint generated always as identity primary key,
 user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 name text not null check(char_length(name) between 1 and 80),
 category text not null default 'Personal',
 icon text not null default '⭐',
 frequency text not null check(frequency in('daily','weekdays','weekends')),
 target_value double precision not null default 1 check(target_value>0),
 unit text not null default '',
 start_date date not null,
 status text not null default 'active' check(status in('active','paused','archived')),
 created_at timestamptz not null default now());
create table if not exists public.lh_completions(
 id bigint generated always as identity primary key,
 habit_id bigint not null references public.lh_habits(id) on delete cascade,
 user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 date date not null,
 value double precision not null check(value>=0),
 updated_at timestamptz not null default now(),
 unique(habit_id,date));
create table if not exists public.lh_reflections(
 id bigint generated always as identity primary key,
 user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 date date not null,
 mood smallint not null check(mood between 1 and 5),
 went_well text not null default '' check(char_length(went_well)<=2000),
 improvement text not null default '' check(char_length(improvement)<=2000),
 unique(user_id,date));
create index if not exists lh_habits_user on public.lh_habits(user_id,status);
create index if not exists lh_comp_user_date on public.lh_completions(user_id,date);
alter table public.lh_habits enable row level security;
alter table public.lh_completions enable row level security;
alter table public.lh_reflections enable row level security;
drop policy if exists own on public.lh_habits;
create policy own on public.lh_habits for all to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
drop policy if exists own on public.lh_completions;
create policy own on public.lh_completions for all to authenticated using(user_id=(select auth.uid()))
 with check(user_id=(select auth.uid()) and exists(select 1 from public.lh_habits h where h.id=habit_id and h.user_id=(select auth.uid())));
drop policy if exists own on public.lh_reflections;
create policy own on public.lh_reflections for all to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
