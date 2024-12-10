'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Trash2, Loader } from 'lucide-react';
import Image from 'next/image';
import type { Wallpaper } from '@/lib/supabase';

export default function AccountPage() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    checkUser();
    fetchUserWallpapers();
  }, []);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
    }
  }

  async function fetchUserWallpapers() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: wallpapers } = await supabase
      .from('wallpapers')
      .select('*')
      .eq('uploaded_by', session.user.id)
      .order('created_at', { ascending: false });

    if (wallpapers) {
      setWallpapers(wallpapers);
    }
    setLoading(false);
  }

  async function handleDelete(wallpaper: Wallpaper) {
    try {
      setDeleting(wallpaper.id);
      setMessage('');

      // Delete image from storage
      const { error: storageError } = await supabase.storage
        .from('wallpapers')
        .remove([wallpaper.image_path]);

      if (storageError) {
        throw new Error('Failed to delete image file');
      }

      // Delete database record
      const { error: dbError } = await supabase
        .from('wallpapers')
        .delete()
        .eq('id', wallpaper.id);

      if (dbError) {
        throw new Error('Failed to delete wallpaper record');
      }

      // Update local state
      setWallpapers(wallpapers.filter(w => w.id !== wallpaper.id));
      setMessage('Wallpaper deleted successfully');

      // Refresh the page data
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to delete wallpaper');
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-spin h-8 w-8 border-4 border-[#4169E1] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#F8F8F8]">My Uploads</h1>
        <button
          onClick={() => router.push('/upload')}
          className="px-4 py-2 bg-[#4169E1] text-[#F8F8F8] rounded-lg hover:bg-[#4169E1]/90 transition-colors"
        >
          Upload New
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('successfully') 
            ? 'bg-green-500/10 text-green-500' 
            : 'bg-red-500/10 text-red-500'
        }`}>
          {message}
        </div>
      )}

      {wallpapers.length === 0 ? (
        <div className="text-center py-12 text-[#F8F8F8]/60">
          <p>You haven't uploaded any wallpapers yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wallpapers.map((wallpaper) => (
            <div
              key={wallpaper.id}
              className="bg-white/5 rounded-xl overflow-hidden border border-white/10"
            >
              <div className="relative aspect-[9/16] sm:aspect-[3/4]">
                <Image
                  src={wallpaper.preview_url}
                  alt={wallpaper.title}
                  fill
                  className="object-cover"
                />
                {wallpaper.price === 0 && (
                  <span className="absolute top-2 right-2 bg-[#4169E1] text-[#F8F8F8] text-xs font-medium px-2 py-1 rounded-full">
                    Free
                  </span>
                )}
                <span className="absolute bottom-2 left-2 bg-white/10 text-[#F8F8F8] text-xs font-medium px-2 py-1 rounded-full capitalize">
                  {wallpaper.category}
                </span>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-[#F8F8F8] truncate">
                      {wallpaper.title}
                    </h3>
                    <p className="text-[#F8F8F8]/60 mt-1">
                      {new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0,
                      }).format(wallpaper.price)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(wallpaper)}
                    disabled={deleting === wallpaper.id}
                    className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
                  >
                    {deleting === wallpaper.id ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 