import { supabase } from '@/lib/supabase';
import type { Wallpaper } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

const categories = [
  { id: 'floral', name: 'Floral', description: 'Beautiful floral patterns' },
  { id: 'geometric', name: 'Geometric', description: 'Modern geometric designs' },
  { id: 'abstract', name: 'Abstract', description: 'Creative abstract patterns' },
  { id: 'traditional', name: 'Traditional', description: 'Classic traditional designs' },
  { id: 'minimalist', name: 'Minimalist', description: 'Clean minimalist patterns' },
];

async function getWallpapersByCategory(category: string) {
  const { data } = await supabase
    .from('wallpapers')
    .select('*')
    .eq('category', category)
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

export default async function CategoriesPage() {
  // Fetch wallpapers for each category
  const categoryWallpapers = await Promise.all(
    categories.map(async (category) => ({
      ...category,
      wallpapers: await getWallpapersByCategory(category.id),
    }))
  );

  return (
    <div className="space-y-12">
      <h1 className="text-3xl font-bold">Categories</h1>

      {categoryWallpapers.map((category) => (
        <section key={category.id} className="space-y-6">
          <div className="border-b pb-2">
            <h2 className="text-2xl font-semibold">{category.name}</h2>
            <p className="text-gray-600">{category.description}</p>
          </div>

          {category.wallpapers && category.wallpapers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {category.wallpapers.map((wallpaper) => (
                <Link href={`/wallpapers/${wallpaper.id}`} key={wallpaper.id} className="group">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                    <Image
                      src={wallpaper.image_path}
                      alt={wallpaper.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-2">
                    <h3 className="font-medium">{wallpaper.title}</h3>
                    <p className="text-gray-600">{formatPrice(wallpaper.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No wallpapers in this category yet</p>
          )}
        </section>
      ))}
    </div>
  );
}