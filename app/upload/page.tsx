'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Loader, X } from 'lucide-react';

interface UploadFile {
  file: File;
  preview: string;
  uploading: boolean;
  error?: string;
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Validate file sizes (50MB limit)
    const validFiles = selectedFiles.filter(file => file.size <= 50 * 1024 * 1024);
    
    if (validFiles.length < selectedFiles.length) {
      setMessage('Some files were skipped because they exceed the 50MB limit');
    }

    const newFiles = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: false
    }));

    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    setMessage('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const category = formData.get('category') as string;
    const price = formData.get('price') as string;

    try {
      // Check session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login?returnTo=/upload');
        return;
      }

      if (!category || files.length === 0) {
        throw new Error('Please fill in all required fields and select files');
      }

      // Upload all files
      let successCount = 0;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setFiles(prev => {
          const newFiles = [...prev];
          newFiles[i].uploading = true;
          return newFiles;
        });

        try {
          // Upload image
          const fileExt = file.file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('wallpapers')
            .upload(fileName, file.file);

          if (uploadError) throw uploadError;

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('wallpapers')
            .getPublicUrl(fileName);

          // Save to database
          const { error: dbError } = await supabase
            .from('wallpapers')
            .insert({
              title: file.file.name.split('.')[0].replace(/[-_]/g, ' '),
              description: null,
              price: parseFloat(price) || 0,
              category: category.toLowerCase(),
              image_path: fileName,
              preview_url: publicUrl,
              uploaded_by: session.user.id,
              is_featured: false,
              tags: []
            });

          if (dbError) throw dbError;

          successCount++;
        } catch (error) {
          setFiles(prev => {
            const newFiles = [...prev];
            newFiles[i].error = error instanceof Error ? error.message : 'Upload failed';
            return newFiles;
          });
        } finally {
          setFiles(prev => {
            const newFiles = [...prev];
            newFiles[i].uploading = false;
            return newFiles;
          });
        }
      }

      if (successCount === files.length) {
        setMessage('All wallpapers uploaded successfully!');
        setTimeout(() => {
          router.push('/account');
          router.refresh();
        }, 1500);
      } else if (successCount > 0) {
        setMessage(`${successCount} out of ${files.length} wallpapers uploaded successfully`);
      } else {
        setMessage('Failed to upload wallpapers');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to upload wallpapers');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-[#F8F8F8] mb-6">Upload Wallpapers</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-[#F8F8F8] mb-2">
            Upload Images
          </label>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4169E1]/50 text-[#F8F8F8]"
          />
          <p className="mt-1 text-sm text-[#F8F8F8]/60">Max file size: 50MB per image</p>
        </div>

        {/* Preview Grid */}
        {files.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {files.map((file, index) => (
              <div key={index} className="relative aspect-[9/16] sm:aspect-[3/4]">
                <img
                  src={file.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  disabled={file.uploading}
                >
                  <X className="w-4 h-4" />
                </button>
                {file.uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                    <Loader className="w-6 h-6 animate-spin text-white" />
                  </div>
                )}
                {file.error && (
                  <div className="absolute bottom-2 left-2 right-2 bg-red-500/90 text-white text-xs p-1 rounded">
                    {file.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-[#F8F8F8] mb-2">
            Category
          </label>
          <select
            name="category"
            required
            defaultValue=""
            className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4169E1]/50 text-[#F8F8F8]"
          >
            <option value="" disabled>Select category</option>
            <option value="mobile">Mobile</option>
            <option value="desktop">Desktop</option>
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-[#F8F8F8] mb-2">
            Price (₹) - Same for all uploads
          </label>
          <input
            type="number"
            name="price"
            min="0"
            step="1"
            required
            defaultValue="0"
            className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4169E1]/50 text-[#F8F8F8]"
          />
        </div>

        {message && (
          <p className={`text-sm p-3 rounded-lg ${
            message.includes('success') 
              ? 'bg-green-500/10 text-green-500' 
              : 'bg-red-500/10 text-red-500'
          }`}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={isUploading || files.length === 0}
          className="w-full px-4 py-2 bg-[#4169E1] text-[#F8F8F8] rounded-lg hover:bg-[#4169E1]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? 'Uploading...' : 'Upload Wallpapers'}
        </button>
      </form>
    </div>
  );
} 