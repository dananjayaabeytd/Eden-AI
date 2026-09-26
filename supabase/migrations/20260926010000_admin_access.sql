-- Admin access to contact submissions.
-- Admins sign in with Supabase Auth; this table grants them access.
-- Admin queries run with the *user's* session, so these RLS policies are the
-- real security boundary — application code cannot bypass them.

create table if not exists public.admins (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  full_name   text check (char_length(full_name) <= 120),
  created_at  timestamptz not null default now()
);

comment on table public.admins is 'Users allowed to access the admin dashboard. Add rows manually (see README).';

alter table public.admins enable row level security;

-- `security definer` lets policies check membership without granting read access to the whole table.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Admins can read their own membership row (used to render their name).
create policy "Admins can read own row"
  on public.admins for select
  to authenticated
  using (user_id = (select auth.uid()));

grant select on table public.admins to authenticated;

-- Admins can read, triage and delete submissions. Inserts still only happen server-side via the secret key.
create policy "Admins can read submissions"
  on public.contact_submissions for select
  to authenticated
  using ((select public.is_admin()));

create policy "Admins can update submissions"
  on public.contact_submissions for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete submissions"
  on public.contact_submissions for delete
  to authenticated
  using ((select public.is_admin()));

grant select, delete on table public.contact_submissions to authenticated;
-- Admins may only change the triage status, never the submitted content.
grant update (status) on table public.contact_submissions to authenticated;

-- Speeds up the dashboard's filters and search.
create index if not exists contact_submissions_topic_idx on public.contact_submissions (topic);
