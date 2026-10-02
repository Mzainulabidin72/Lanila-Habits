-- Data contoh Lanila Habits: 5 kebiasaan + riwayat 59 hari + refleksi.
-- 1) Daftar dulu di aplikasi. 2) Ganti email di bawah. 3) Jalankan di SQL Editor.
-- Hapus data contoh: delete from public.lh_habits where user_id=(select id from auth.users where email='EMAIL_KAMU');
do $$
declare uid uuid; hid bigint; r record; today date := (now() at time zone 'Asia/Jakarta')::date;
begin
 select id into uid from auth.users where email='GANTI_DENGAN_EMAIL_KAMU';
 if uid is null then raise exception 'Email tidak ditemukan. Daftar dulu, lalu ganti email di baris select di atas.'; end if;
 for r in select * from (values
  ('Minum 2L air','Kesehatan','💧','daily',2.0,'liter',0.92),
  ('Coding 1 jam','Produktivitas','💻','weekdays',60.0,'menit',0.85),
  ('Baca 10 halaman','Belajar','📖','daily',10.0,'halaman',0.55),
  ('Olahraga','Kebugaran','🏃','daily',1.0,'',0.75),
  ('Tidur sebelum 23:00','Tidur','😴','daily',1.0,'',0.70)
 ) as t(name,cat,icon,freq,tv,unit,p) loop
  insert into public.lh_habits(user_id,name,category,icon,frequency,target_value,unit,start_date)
   values(uid,r.name,r.cat,r.icon,r.freq,r.tv,r.unit,today-59) returning id into hid;
  insert into public.lh_completions(habit_id,user_id,date,value)
  select hid,uid,d,case when x<r.p*0.85 then r.tv when r.unit<>'' then r.tv*0.5 else 0 end
  from (select d::date d,random() x from generate_series(today-59,today-1,interval '1 day') d
        where r.freq='daily' or extract(isodow from d)<=5) s
  where x<r.p;
 end loop;
 insert into public.lh_reflections(user_id,date,mood,went_well,improvement)
 select uid,d::date,3+floor(random()*3)::int,'Sebagian besar kebiasaan terlaksana.','Mulai lebih awal besok.'
 from generate_series(today-9,today-1,interval '1 day') d;
end $$;
