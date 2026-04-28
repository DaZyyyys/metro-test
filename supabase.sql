create table if not exists metro_trainee_results (
  id text primary key,
  username text not null,
  display_name text not null,
  submitted_at timestamptz not null,
  status text not null,
  answers jsonb not null,
  grading jsonb not null,
  attempt integer not null,
  comment text
);

-- Für einfachen RP-Betrieb ohne Supabase Auth:
alter table metro_trainee_results disable row level security;
