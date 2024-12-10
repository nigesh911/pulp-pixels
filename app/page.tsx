'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Wallpaper } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SpotlightGrid from '@/components/SpotlightGrid';
import WallpaperImage from '@/components/WallpaperImage';

export default function HomePage() {
  const [featuredWallpapers, setFeaturedWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedWallpapers();
  }, []);

  async function fetchFeaturedWallpapers() {
    try {
      const { data, error } = await supabase
        .from('wallpapers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) throw error;
      setFeaturedWallpapers(data || []);
    } catch (error) {
      console.error('Error fetching wallpapers:', error);
    } finally {
      setLoading(false);
    }
  }

  const images = featuredWallpapers.map(wallpaper => ({
    src: wallpaper.preview_url,
    alt: wallpaper.title,
    href: `/wallpapers/${wallpaper.id}`,
    price: wallpaper.price
  }));

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#1A1A1A] to-black">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
          <div className="text-center space-y-8">
            <h1 className="text-4xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#4169E1] to-[#7B68EE]">
              Premium Wallpapers for Your Devices
            </h1>
            <p className="text-lg sm:text-xl text-[#F8F8F8]/60 max-w-2xl mx-auto">
              Discover a curated collection of high-quality wallpapers for your mobile and desktop devices.
            </p>
            <div>
              <Link
                href="/browse"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#4169E1] text-white rounded-lg hover:bg-[#4169E1]/90 transition-colors"
              >
                Browse Collection
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Wallpapers */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[#F8F8F8]">Latest Wallpapers</h2>
          <Link 
            href="/browse" 
            className="inline-flex items-center text-[#4169E1] hover:text-[#4169E1]/80 transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="animate-spin h-8 w-8 border-4 border-[#4169E1] border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <SpotlightGrid images={images} />
        )}
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-[#F8F8F8] mb-8">Browse by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link 
            href="/mobile" 
            className="group relative aspect-[16/9] overflow-hidden rounded-xl bg-gradient-to-br from-[#4169E1]/20 to-[#7B68EE]/20 hover:from-[#4169E1]/30 hover:to-[#7B68EE]/30 transition-all duration-300"
          >
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
              <h3 className="text-2xl font-bold mb-2">Mobile Wallpapers</h3>
              <p className="text-white/60">Perfect for smartphones and tablets</p>
            </div>
          </Link>
          <Link 
            href="/desktop" 
            className="group relative aspect-[16/9] overflow-hidden rounded-xl bg-gradient-to-br from-[#7B68EE]/20 to-[#4169E1]/20 hover:from-[#7B68EE]/30 hover:to-[#4169E1]/30 transition-all duration-300"
          >
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
              <h3 className="text-2xl font-bold mb-2">Desktop Wallpapers</h3>
              <p className="text-white/60">For your computer and laptop screens</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
