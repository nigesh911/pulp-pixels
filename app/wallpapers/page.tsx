import { supabase } from '@/lib/supabase';
import type { Wallpaper } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowUpDown, Filter, Crown } from 'lucide-react';
import WallpaperImage from '@/components/WallpaperImage';

async function getWallpapers() {
  const { data } = await supabase
    .from('wallpapers')
    .select('*')
    .order('created_at', { ascending: false });
  return data as Wallpaper[];
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export default async function WallpapersPage() {
  const wallpapers = await getWallpapers();

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-[#F8F8F8] tracking-tight">
            All Wallpapers
          </h1>
          <p className="text-[#F8F8F8]/60">
            Discover our curated collection of premium wallpapers
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <select className="w-full sm:w-48 appearance-none bg-[#1A1A1A] text-[#F8F8F8] pl-4 pr-10 py-3 border border-[#4169E1]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4169E1]/50 hover:border-[#4169E1]/40 transition-all duration-300">
              <option value="">All Categories</option>
              <option value="floral">Floral</option>
              <option value="geometric">Geometric</option>
              <option value="abstract">Abstract</option>
            </select>
            <Filter className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4169E1]" />
          </div>
          <div className="relative group">
            <select className="w-full sm:w-48 appearance-none bg-[#1A1A1A] text-[#F8F8F8] pl-4 pr-10 py-3 border border-[#4169E1]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4169E1]/50 hover:border-[#4169E1]/40 transition-all duration-300">
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <ArrowUpDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4169E1]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {wallpapers?.map((wallpaper) => (
          <Link 
            href={`/wallpapers/${wallpaper.id}`} 
            key={wallpaper.id} 
            className="group relative bg-gradient-to-b from-[#1A1A1A] to-[#121212] rounded-2xl overflow-hidden border border-white/5 hover:border-[#4169E1]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#4169E1]/5"
          >
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#121212]/80 z-10" />
              <WallpaperImage
                src={wallpaper.preview_url}
                alt={wallpaper.title}
                aspectRatio={wallpaper.category as 'mobile' | 'desktop'}
                isPaid={wallpaper.price > 0}
                fit={wallpaper.category === 'mobile' ? 'contain' : 'cover'}
                className="w-full transform group-hover:scale-105 transition-transform duration-700"
              />
              {wallpaper.price > 0 ? (
                <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-[#4169E1]/90 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1.5 rounded-full">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Premium</span>
                </div>
              ) : (
                <span className="absolute top-3 right-3 z-30 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1.5 rounded-full">
                  Free
                </span>
              )}
            </div>
            <div className="relative p-5 z-20">
              <h3 className="font-medium text-[#F8F8F8] group-hover:text-[#4169E1] transition-colors duration-300 line-clamp-1">
                {wallpaper.title}
              </h3>
              <p className="text-[#F8F8F8]/60 mt-1.5 font-medium">
                {formatPrice(wallpaper.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 