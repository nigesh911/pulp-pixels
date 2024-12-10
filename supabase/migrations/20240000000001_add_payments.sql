-- Create payments table
create table if not exists payments (
  id uuid default gen_random_uuid() primary key,
  transaction_id text not null,
  wallpaper_id uuid references wallpapers(id) on delete restrict,
  upi_id text not null,
  amount decimal not null,
  status text not null check (status in ('pending', 'completed', 'failed')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  completed_at timestamp with time zone,
  verification_attempts integer default 0,
  payment_screenshot_url text
);

-- Enable RLS
alter table payments enable row level security;

-- Create policies
create policy "Enable read access for all users" on payments
  for select using (true);

create policy "Enable insert for all users" on payments
  for insert with check (true);

create policy "Enable update for authenticated users only" on payments
  for update using (auth.role() = 'authenticated'); 