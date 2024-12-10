-- Only create ratings table if it doesn't exist
create table if not exists public.ratings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  wallpaper_id uuid references public.wallpapers(id) on delete cascade not null,
  rating smallint not null check (rating >= 1 and rating <= 5),
  user_ip text
);

-- Add rating columns to wallpapers table if they don't exist
alter table public.wallpapers 
add column if not exists average_rating numeric(3,2) default 0,
add column if not exists total_ratings integer default 0;

-- Create index if it doesn't exist
create index if not exists ratings_wallpaper_id_idx on public.ratings(wallpaper_id);

-- Set RLS policies
alter table public.ratings enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Anyone can insert ratings" on public.ratings;
drop policy if exists "Anyone can view ratings" on public.ratings;
drop policy if exists "Anyone can update ratings" on public.ratings;

-- Create new policies
create policy "Anyone can insert ratings"
on public.ratings for insert
to anon, authenticated
with check (true);

create policy "Anyone can view ratings"
on public.ratings for select
to anon, authenticated
using (true);

create policy "Anyone can update ratings"
on public.ratings for update
to anon, authenticated
using (true)
with check (true);

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all privileges on public.ratings to anon, authenticated;
grant all privileges on public.wallpapers to anon, authenticated; 