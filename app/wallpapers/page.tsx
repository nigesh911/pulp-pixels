import { supabase } from '@/lib/supabase';
import type { Wallpaper } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpDown, Filter } from 'lucide-react';
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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-[#F8F8F8]">All Wallpapers</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <select className="appearance-none bg-white/10 text-[#F8F8F8] pl-4 pr-10 py-2.5 border border-[#4169E1]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4169E1]/50 hover:border-[#4169E1]/40 transition-colors">
              <option value="">All Categories</option>
              <option value="floral">Floral</option>
              <option value="geometric">Geometric</option>
              <option value="abstract">Abstract</option>
            </select>
            <Filter className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4169E1]" />
          </div>
          <div className="relative group">
            <select className="appearance-none bg-white/10 text-[#F8F8F8] pl-4 pr-10 py-2.5 border border-[#4169E1]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4169E1]/50 hover:border-[#4169E1]/40 transition-colors">
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <ArrowUpDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4169E1]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wallpapers?.map((wallpaper, index) => (
          <Link 
            href={`/wallpapers/${wallpaper.id}`} 
            key={wallpaper.id} 
            className="group relative bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-[#4169E1]/50 transition-all duration-300"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <WallpaperImage
                src={wallpaper.preview_url}
                alt={wallpaper.title}
                aspectRatio="mobile"
                isPaid={wallpaper.price > 0}
                className="w-full h-full"
              />
              {wallpaper.price === 0 && (
                <span className="absolute top-2 right-2 bg-[#4169E1] text-[#F8F8F8] text-xs font-medium px-2 py-1 rounded-full z-30">
                  Free
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-[#F8F8F8] group-hover:text-[#4169E1] transition-colors line-clamp-1">
                {wallpaper.title}
              </h3>
              <p className="text-[#F8F8F8]/60 mt-1">
                {formatPrice(wallpaper.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 