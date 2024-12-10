-- Drop existing table if it exists
drop table if exists contact_submissions;

-- Create the table
create table contact_submissions (
  id uuid default uuid_generate_v4() primary key,
  email text not null,
  last_submission timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Create an index on email and last_submission for faster lookups
create index contact_submissions_email_submission_idx on contact_submissions(email, last_submission);

-- Enable RLS
alter table contact_submissions enable row level security;

-- Create a more permissive policy for public access
create policy "Enable all access to contact_submissions"
  on contact_submissions
  for all
  to public
  using (true)
  with check (true);