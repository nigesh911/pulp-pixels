import { Metadata } from 'next';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import WallpaperClient from './client';

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerComponentClient({ cookies });
  const { data: wallpaper } = await supabase
    .from('wallpapers')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!wallpaper) {
    return {
      title: 'Wallpaper Not Found',
      description: 'The requested wallpaper could not be found.'
    };
  }

  return {
    title: `${wallpaper.title} | Pulp Pixels`,
    description: wallpaper.description || `Download ${wallpaper.title} wallpaper from Pulp Pixels`,
    openGraph: {
      images: [wallpaper.preview_url]
    }
  };
}

export default async function WallpaperPage({ params }: Props) {
  const supabase = createServerComponentClient({ cookies });
  const { data: wallpaper } = await supabase
    .from('wallpapers')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!wallpaper) {
    notFound();
  }

  return <WallpaperClient wallpaper={wallpaper} />;
} 