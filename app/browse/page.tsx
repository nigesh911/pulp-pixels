'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Wallpaper } from '@/lib/supabase';
import SpotlightGrid from '@/components/SpotlightGrid';
import { ArrowUpDown, Filter } from 'lucide-react';

export default function BrowsePage() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchWallpapers();
  }, [category, sortBy]);

  async function fetchWallpapers() {
    try {
      let query = supabase
        .from('wallpapers')
        .select('*');

      if (category) {
        query = query.eq('category', category);
      }

      switch (sortBy) {
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      setWallpapers(data || []);
    } catch (error) {
      console.error('Error fetching wallpapers:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-spin h-8 w-8 border-4 border-[#4169E1] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const images = wallpapers.map(wallpaper => ({
    src: wallpaper.preview_url,
    alt: wallpaper.title,
    href: `/wallpapers/${wallpaper.id}`,
    price: wallpaper.price
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-[#F8F8F8]">Browse Wallpapers</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="appearance-none bg-white/10 text-[#F8F8F8] pl-4 pr-10 py-2.5 border border-[#4169E1]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4169E1]/50 hover:border-[#4169E1]/40 transition-colors"
            >
              <option value="">All Categories</option>
              <option value="mobile">Mobile</option>
              <option value="desktop">Desktop</option>
            </select>
            <Filter className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4169E1]" />
          </div>
          <div className="relative group">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white/10 text-[#F8F8F8] pl-4 pr-10 py-2.5 border border-[#4169E1]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4169E1]/50 hover:border-[#4169E1]/40 transition-colors"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <ArrowUpDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4169E1]" />
          </div>
        </div>
      </div>

      <SpotlightGrid images={images} />
    </div>
  );
} 