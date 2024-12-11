-- Add ratings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.ratings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    wallpaper_id UUID REFERENCES public.wallpapers(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    browser_fingerprint TEXT,
    user_ip TEXT,
    UNIQUE(wallpaper_id, browser_fingerprint)
);

-- Add rating columns to wallpapers table if they don't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'wallpapers' AND column_name = 'average_rating') THEN
        ALTER TABLE public.wallpapers ADD COLUMN average_rating DECIMAL(3,2);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'wallpapers' AND column_name = 'total_ratings') THEN
        ALTER TABLE public.wallpapers ADD COLUMN total_ratings INTEGER DEFAULT 0;
    END IF;
END $$;

-- Create function to update wallpaper ratings
CREATE OR REPLACE FUNCTION update_wallpaper_rating()
RETURNS TRIGGER AS $$
BEGIN
  WITH rating_stats AS (
    SELECT 
      wallpaper_id,
      ROUND(AVG(rating)::numeric, 2) as avg_rating,
      COUNT(*) as total
    FROM ratings
    WHERE wallpaper_id = COALESCE(NEW.wallpaper_id, OLD.wallpaper_id)
    GROUP BY wallpaper_id
  )
  UPDATE wallpapers w
  SET 
    average_rating = rs.avg_rating,
    total_ratings = rs.total
  FROM rating_stats rs
  WHERE w.id = rs.wallpaper_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for ratings
DROP TRIGGER IF EXISTS update_wallpaper_rating_trigger ON ratings;
CREATE TRIGGER update_wallpaper_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON ratings
FOR EACH ROW
EXECUTE FUNCTION update_wallpaper_rating();

-- Create RLS policies for ratings
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.ratings
FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.ratings
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for users who created the rating" ON public.ratings
FOR UPDATE USING (
    browser_fingerprint = current_setting('request.headers')::json->>'browser-fingerprint'
);

CREATE POLICY "Enable delete for users who created the rating" ON public.ratings
FOR DELETE USING (
    browser_fingerprint = current_setting('request.headers')::json->>'browser-fingerprint'
); 