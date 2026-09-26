-- Contact form submissions.
-- Written only by the Next.js server using the Supabase secret key.
-- RLS is enabled with no policies, so the public anon/publishable key can neither read nor write.

create table if not exists public.contact_submissions (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),

  first_name    text not null check (char_length(first_name) between 1 and 80),
  last_name     text not null check (char_length(last_name) between 1 and 80),
  email         text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  company       text check (char_length(company) <= 120),
  job_title     text check (char_length(job_title) <= 120),
  phone         text check (char_length(phone) <= 20),
  company_size  text check (company_size in ('1-10', '11-50', '51-200', '201-1000', '1000+')),
  topic         text not null check (topic in ('sales', 'demo', 'support', 'partnership', 'press', 'other')),
  message       text not null check (char_length(message) between 20 and 5000),
  consent       boolean not null check (consent),

  -- Triage workflow for the team.
  status        text not null default 'new' check (status in ('new', 'in_progress', 'resolved', 'spam')),

  -- Abuse prevention. Raw IPs are never stored — only a salted SHA-256 hash.
  ip_hash       text,
  user_agent    text check (char_length(user_agent) <= 500)
);

comment on table public.contact_submissions is 'Messages submitted through the website contact form.';

create index if not exists contact_submissions_created_at_idx on public.contact_submissions (created_at desc);
create index if not exists contact_submissions_ip_hash_created_at_idx on public.contact_submissions (ip_hash, created_at desc);
create index if not exists contact_submissions_status_idx on public.contact_submissions (status) where status <> 'resolved';

alter table public.contact_submissions enable row level security;

-- Belt and braces: make sure client-facing roles have no table privileges at all.
revoke all on table public.contact_submissions from anon, authenticated;
