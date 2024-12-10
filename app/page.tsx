import { supabase } from '@/lib/supabase';
import type { Wallpaper } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

async function getFeaturedWallpapers() {
  const { data } = await supabase
    .from('wallpapers')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6);
  return data as Wallpaper[];
}

async function getCategoryPreviews() {
  const { data: mobile } = await supabase
    .from('wallpapers')
    .select('preview_url')
    .eq('category', 'mobile')
    .order('created_at', { ascending: false })
    .limit(4);

  const { data: desktop } = await supabase
    .from('wallpapers')
    .select('preview_url')
    .eq('category', 'desktop')
    .order('created_at', { ascending: false })
    .limit(4);

  return {
    mobile: mobile || [],
    desktop: desktop || []
  };
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export default async function Home() {
  const featuredWallpapers = await getFeaturedWallpapers();
  const categoryPreviews = await getCategoryPreviews();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[#F8F8F8] max-w-3xl mx-auto">
          Premium Wallpapers for Your Devices
        </h1>
        <p className="text-xl text-[#F8F8F8]/60 max-w-2xl mx-auto">
          High-quality wallpapers for your desktop, laptop, and mobile devices
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/wallpapers"
            className="px-6 py-3 bg-[#4169E1] text-[#F8F8F8] rounded-lg hover:bg-[#4169E1]/90 transition-colors"
          >
            Browse Collection
          </Link>
        </div>
      </section>

      {/* Featured Wallpapers */}
      <section className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#F8F8F8]">Featured Wallpapers</h2>
          <Link
            href="/wallpapers"
            className="text-[#4169E1] hover:text-[#4169E1]/80 transition-colors"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredWallpapers?.map((wallpaper) => (
            <Link
              href={`/wallpapers/${wallpaper.id}`}
              key={wallpaper.id}
              className="group bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-[#4169E1]/50 transition-all duration-300"
            >
              <div className="relative aspect-[9/16] sm:aspect-[3/4] overflow-hidden">
                <Image
                  src={wallpaper.preview_url}
                  alt={wallpaper.title}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                {wallpaper.price === 0 && (
                  <span className="absolute top-2 right-2 bg-[#4169E1] text-[#F8F8F8] text-xs font-medium px-2 py-1 rounded-full">
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
      </section>

      {/* Categories Section */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold text-[#F8F8F8]">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              name: 'Mobile',
              description: 'High-resolution wallpapers optimized for smartphones',
              previews: categoryPreviews.mobile
            },
            {
              name: 'Desktop',
              description: 'Premium wallpapers for your computer and laptop screens',
              previews: categoryPreviews.desktop
            }
          ].map((category) => (
            <Link
              key={category.name}
              href={`/wallpapers?category=${category.name.toLowerCase()}`}
              className="group relative rounded-2xl bg-white/5 border border-white/10 hover:border-[#4169E1]/50 transition-all p-6"
            >
              {/* Preview Grid */}
              <div className="grid grid-cols-2 gap-2 mb-4 aspect-video">
                {category.previews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg overflow-hidden"
                  >
                    <Image
                      src={preview.preview_url}
                      alt={`${category.name} preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Category Info */}
              <div>
                <h3 className="text-2xl font-bold text-[#F8F8F8] group-hover:text-[#4169E1] transition-colors">
                  {category.name}
                </h3>
                <p className="mt-2 text-[#F8F8F8]/80 text-sm md:text-base">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
