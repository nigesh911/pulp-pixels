import { useState } from 'react';
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ImageOff } from 'lucide-react';

interface WallpaperImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'mobile' | 'desktop';
}

export default function WallpaperImage({ src, alt, className = '', aspectRatio = 'mobile' }: WallpaperImageProps) {
  const [imageError, setImageError] = useState(false);
  const supabase = createClientComponentClient();
  const imageUrl = supabase.storage.from('wallpapers').getPublicUrl(src).data.publicUrl;

  if (imageError) {
    return (
      <div className={`relative ${aspectRatio === 'mobile' ? 'aspect-[9/16]' : 'aspect-[16/9]'} rounded-xl overflow-hidden bg-white/5 ${className} flex items-center justify-center`}>
        <div className="text-center text-[#F8F8F8]/60">
          <ImageOff className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">Image not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${aspectRatio === 'mobile' ? 'aspect-[9/16]' : 'aspect-[16/9]'} rounded-xl overflow-hidden ${className}`}>
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
      
      {/* Main Image */}
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className="object-cover select-none"
        onContextMenu={(e) => e.preventDefault()}
        draggable={false}
        onError={() => setImageError(true)}
      />

      {/* Watermark Pattern */}
      <div className="absolute inset-0 z-20 select-none pointer-events-none flex items-center justify-center">
        <div className="transform rotate-[-30deg]">
          <div className="text-white text-3xl font-bold opacity-[0.08] whitespace-nowrap">
            Pulp Pixels
          </div>
        </div>
      </div>
    </div>
  );
} 