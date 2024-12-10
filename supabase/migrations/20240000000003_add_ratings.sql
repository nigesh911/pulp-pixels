-- Drop existing table if it exists
drop table if exists public.ratings cascade;

-- Create ratings table
create table public.ratings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  wallpaper_id uuid references public.wallpapers(id) on delete cascade not null,
  rating smallint not null check (rating >= 1 and rating <= 5),
  user_ip text,
  browser_fingerprint text,
  -- Create a unique constraint to prevent multiple ratings from same browser
  unique(wallpaper_id, browser_fingerprint)
);

-- Add rating columns to wallpapers table if they don't exist
alter table public.wallpapers 
add column if not exists average_rating numeric(3,2) default 0,
add column if not exists total_ratings integer default 0;

-- Create indexes
create index ratings_wallpaper_id_idx on public.ratings(wallpaper_id);
create index ratings_fingerprint_idx on public.ratings(browser_fingerprint);

-- Set RLS policies
alter table public.ratings enable row level security;

-- Create policies
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

-- Create the function to update wallpaper ratings
create or replace function update_wallpaper_rating()
returns trigger as $$
begin
  update wallpapers
  set 
    average_rating = (
      select round(avg(rating)::numeric, 2)
      from ratings
      where wallpaper_id = NEW.wallpaper_id
    ),
    total_ratings = (
      select count(*)
      from ratings
      where wallpaper_id = NEW.wallpaper_id
    )
  where id = NEW.wallpaper_id;
  return NEW;
end;
$$ language plpgsql;

-- Create the trigger
create trigger update_wallpaper_rating
after insert or update or delete on ratings
for each row execute function update_wallpaper_rating();

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all privileges on public.ratings to anon, authenticated;
grant all privileges on public.wallpapers to anon, authenticated; 