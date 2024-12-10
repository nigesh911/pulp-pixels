'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WallpaperUploadClient() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'mobile',
    tags: '',
    isFree: false,
  });

  // Check session on component mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login?returnTo=/upload');
      }
    };
    checkSession();
  }, [router, supabase.auth]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Verify session before upload
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Please log in to upload wallpapers');
      }

      const form = e.currentTarget;
      const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement;
      const file = fileInput.files?.[0];

      if (!file) {
        throw new Error('Please select an image file');
      }

      // Upload image to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('wallpapers')
        .upload(fileName, file);

      if (uploadError) {
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('wallpapers')
        .getPublicUrl(fileName);

      // Save wallpaper data
      const { error: insertError } = await supabase
        .from('wallpapers')
        .insert({
          title: formData.title.trim(),
          description: formData.description.trim(),
          price: formData.isFree ? 0 : parseFloat(formData.price),
          category: formData.category,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
          image_url: publicUrl,
          preview_url: publicUrl,
          image_path: fileName,
          is_featured: false,
          uploaded_by: session.user.id,
        });

      if (insertError) {
        throw new Error(`Database error: ${insertError.message}`);
      }

      // Clear form after successful upload
      setFormData({
        title: '',
        description: '',
        price: '',
        category: 'mobile',
        tags: '',
        isFree: false,
      });
      fileInput.value = '';
      setMessage('Wallpaper uploaded successfully!');
      
      // Refresh the page data
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to upload wallpaper');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-[#F8F8F8] mb-8">Upload Wallpaper</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-[#F8F8F8] mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4169E1]/50 text-[#F8F8F8]"
            placeholder="Enter wallpaper title"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-[#F8F8F8] mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4169E1]/50 text-[#F8F8F8] h-32"
            placeholder="Enter wallpaper description"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-[#F8F8F8] mb-2">
            Category
          </label>
          <select
            id="category"
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4169E1]/50 text-[#F8F8F8]"
          >
            <option value="mobile">Mobile</option>
            <option value="desktop">Desktop</option>
          </select>
        </div>

        {/* Price */}
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isFree"
              checked={formData.isFree}
              onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="isFree" className="text-sm font-medium text-[#F8F8F8]">
              Free wallpaper
            </label>
          </div>
          
          {!formData.isFree && (
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-[#F8F8F8] mb-2">
                Price (INR)
              </label>
              <input
                type="number"
                id="price"
                required={!formData.isFree}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                min="0"
                step="1"
                className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4169E1]/50 text-[#F8F8F8]"
                placeholder="Enter price in INR"
              />
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-[#F8F8F8] mb-2">
            Tags (comma separated)
          </label>
          <input
            type="text"
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4169E1]/50 text-[#F8F8F8]"
            placeholder="abstract, dark, minimal"
          />
        </div>

        {/* File Upload */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-[#F8F8F8] mb-2">
            Wallpaper Image
          </label>
          <input
            type="file"
            id="image"
            required
            accept="image/*"
            className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4169E1]/50 text-[#F8F8F8]"
          />
        </div>

        {message && (
          <p className={`text-sm p-3 rounded-lg ${
            message.includes('successfully') 
              ? 'bg-green-500/10 text-green-500' 
              : 'bg-red-500/10 text-red-500'
          }`}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-[#4169E1] text-[#F8F8F8] rounded-lg hover:bg-[#4169E1]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Uploading...' : 'Upload Wallpaper'}
        </button>
      </form>
    </div>
  );
} 