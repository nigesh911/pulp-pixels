create table if not exists download_requests (
  id uuid default gen_random_uuid() primary key,
  wallpaper_id uuid references wallpapers(id) on delete cascade,
  email text not null,
  download_url text not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default now(),
  downloaded_at timestamp with time zone
);

-- Enable Row Level Security
alter table download_requests enable row level security;

-- Create policies
create policy "Enable insert access for all users" on download_requests
  for insert with check (true);

create policy "Enable read access for authenticated users" on download_requests
  for select using (
    exists (
      select 1 from wallpapers
      where wallpapers.id = download_requests.wallpaper_id
      and wallpapers.uploaded_by = auth.uid()
    )
  ); 