-- Drop existing table if it exists
drop table if exists payments;

-- Create payments table with correct schema
create table if not exists payments (
  id uuid default gen_random_uuid() primary key,
  transaction_id text not null,
  wallpaper_id uuid references wallpapers(id) on delete restrict,
  user_id text not null,
  amount decimal not null,
  status text not null check (status in ('pending', 'completed', 'failed')),
  payment_method text not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table payments enable row level security;

-- Create policies
create policy "Enable read access for all users" on payments
  for select using (true);

create policy "Enable insert for all users" on payments
  for insert with check (true);
 