'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface FileWithPreview {
  file: File;
  preview: string;
}

export default function WallpaperUploadClient() {
  const router = useRouter();
  const [fileData, setFileData] = useState<FileWithPreview | null>(null);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('0');
  const [title, setTitle] = useState('');
  const [customTitle, setCustomTitle] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login?returnTo=/upload');
      }
    };
    checkSession();
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    const preview = URL.createObjectURL(file);
    
    // Set default title from filename without extension and replace dashes/underscores with spaces
    const defaultTitle = file.name.split('.')[0].replace(/[-_]/g, ' ');
    setTitle(customTitle || defaultTitle);

    setFileData({
      file,
      preview
    });
  };

  const clearFile = () => {
    if (fileData?.preview) {
      URL.revokeObjectURL(fileData.preview);
    }
    setFileData(null);
    setTitle('');
  };

  useEffect(() => {
    return () => {
      if (fileData?.preview) {
        URL.revokeObjectURL(fileData.preview);
      }
    };
  }, [fileData]);

  const handleUpload = async () => {
    if (!fileData) return;
    if (!category) {
      alert('Please select a category');
      return;
    }
    if (!title.trim()) {
      alert('Please provide a title');
      return;
    }

    setUploading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Please log in to upload wallpapers');
      }

      const fileExt = fileData.file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('wallpapers')
        .upload(filePath, fileData.file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('wallpapers')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('wallpapers')
        .insert([{
          title: title.trim(),
          description: null,
          price: Number(price),
          category,
          tags: [],
          image_path: filePath,
          preview_url: publicUrl,
          is_featured: false,
          uploaded_by: session.user.id
        }]);

      if (dbError) throw dbError;

      clearFile();
      alert('Wallpaper uploaded successfully!');
      router.refresh();
    } catch (error) {
      console.error('Error uploading wallpaper:', error);
      alert('Error uploading wallpaper. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Upload Image</h1>

      <div className="space-y-6">
        {/* Title Input - Always visible */}
        <div>
          <label className="block text-[#F8F8F8]/80 mb-1">Custom Title</label>
          <input
            type="text"
            value={customTitle}
            onChange={(e) => {
              setCustomTitle(e.target.value);
              if (fileData) {
                setTitle(e.target.value);
              }
            }}
            placeholder="Enter custom title (optional)"
            className="w-full rounded-lg bg-[#1A1A1A] border border-white/10 px-3 py-2 text-[#F8F8F8] focus:border-[#4169E1] focus:ring-[#4169E1] focus:ring-opacity-50"
          />
          <p className="mt-1 text-sm text-[#F8F8F8]/40">
            If not provided, the filename will be used as the title
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[#F8F8F8]/80 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg bg-[#1A1A1A] border border-white/10 px-3 py-2 text-[#F8F8F8] focus:border-[#4169E1] focus:ring-[#4169E1] focus:ring-opacity-50"
            >
              <option value="">Select category</option>
              <option value="mobile">Mobile</option>
              <option value="desktop">Desktop</option>
            </select>
          </div>

          <div>
            <label className="block text-[#F8F8F8]/80 mb-1">Price (₹)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              className="w-full rounded-lg bg-[#1A1A1A] border border-white/10 px-3 py-2 text-[#F8F8F8] focus:border-[#4169E1] focus:ring-[#4169E1] focus:ring-opacity-50"
            />
          </div>
        </div>

        {!fileData ? (
          <div>
            <label className="block p-4 border-2 border-dashed border-white/10 rounded-lg hover:border-[#4169E1]/50 transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="text-center">
                <p className="text-[#F8F8F8]/60">Choose File</p>
              </div>
            </label>
            <p className="mt-2 text-sm text-[#F8F8F8]/40">Max file size: 50MB</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                <Image
                  src={fileData.preview}
                  alt={title || fileData.file.name}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={clearFile}
                  className="absolute top-2 right-2 p-2 bg-black/40 rounded-full hover:bg-black/60 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={handleUpload}
              disabled={uploading || !category || !title.trim()}
              className="w-full py-3 bg-[#4169E1] text-white rounded-lg hover:bg-[#4169E1]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload Wallpaper'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 