-- Optional backend for public, moderated wishes.
-- Paste into Supabase SQL Editor. Review the deployment checklist in README.md.
-- Clients may insert ONLY pending records. They may read ONLY approved records.
-- Nothing can be approved from the public website.
create extension if not exists pgcrypto;
create table if not exists public.krathong_wishes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  message varchar(120) not null check (char_length(trim(message)) between 1 and 120),
  design jsonb not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  constraint valid_design check (jsonb_typeof(design) = 'object')
);

create index if not exists krathong_wishes_approved_recent
  on public.krathong_wishes (created_at desc) where status = 'approved';

alter table public.krathong_wishes enable row level security;
revoke all on public.krathong_wishes from public;
revoke all on public.krathong_wishes from anon, authenticated;
grant select (id,created_at,message,design,status) on public.krathong_wishes to anon, authenticated;
grant insert (message,design) on public.krathong_wishes to anon, authenticated;

-- No select permission for pending/rejected rows under RLS.
drop policy if exists "Read approved public wishes" on public.krathong_wishes;
create policy "Read approved public wishes"
on public.krathong_wishes for select to anon,authenticated
using (status = 'approved');

drop policy if exists "Submit pending wishes" on public.krathong_wishes;
create policy "Submit pending wishes"
on public.krathong_wishes for insert to anon,authenticated
with check (status = 'pending' and char_length(trim(message)) between 1 and 120);

-- Deliberately no anon/auth UPDATE/DELETE policies.
-- In the Supabase dashboard, an authorized moderator can approve a message:
-- update public.krathong_wishes set status='approved' where id='UUID';
-- Add rate limiting, CAPTCHA and an abuse-reporting workflow BEFORE public launch.
