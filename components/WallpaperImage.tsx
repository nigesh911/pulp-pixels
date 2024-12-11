'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';

interface WallpaperImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'mobile' | 'desktop';
  isPaid?: boolean;
  fit?: 'cover' | 'contain';
}

export default function WallpaperImage({ 
  src, 
  alt, 
  className = '', 
  aspectRatio = 'mobile',
  isPaid = false,
  fit = 'cover'
}: WallpaperImageProps) {
  const [imageError, setImageError] = useState(false);

  // Prevent right click
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // Prevent drag
  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Prevent keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
    }
  };

  const getAspectRatio = () => {
    if (aspectRatio === 'mobile') {
      return fit === 'contain' ? 'aspect-[9/19.5]' : 'aspect-[9/16]';
    }
    return 'aspect-[16/9]';
  };

  if (imageError) {
    return (
      <div className={`relative ${getAspectRatio()} rounded-2xl overflow-hidden bg-[#1A1A1A] ${className} flex items-center justify-center`}>
        <div className="text-center text-[#F8F8F8]/60">
          <ImageOff className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">Image not found</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative ${getAspectRatio()} rounded-2xl overflow-hidden ${className} ${fit === 'contain' ? 'bg-[#1A1A1A]' : ''}`}
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Background blur effect for premium images */}
      {isPaid && (
        <div className="absolute inset-0 bg-[#1A1A1A] z-0">
          <Image
            src={src}
            alt=""
            fill
            className="opacity-30 blur-2xl scale-110"
            quality={1}
          />
        </div>
      )}
      
      {/* Main Image */}
      <div className="relative w-full h-full z-10">
        <Image
          src={src}
          alt={alt}
          fill
          className={`select-none pointer-events-none ${fit === 'contain' ? 'object-contain' : 'object-cover'}`}
          onError={() => setImageError(true)}
          unoptimized={isPaid}
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Premium overlay effect */}
      {isPaid && (
        <div className="absolute inset-0 bg-gradient-to-t from-[#4169E1]/10 to-transparent mix-blend-overlay z-20" />
      )}

      {/* Watermark Pattern - Always visible at 20% opacity */}
      <div className="absolute inset-0 z-30 select-none pointer-events-none">
        <div className="absolute inset-0 grid grid-cols-2 gap-4 transform rotate-[-30deg]">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="whitespace-nowrap text-white text-xl font-bold opacity-20">
              Pulp Pixels
            </div>
          ))}
        </div>
      </div>

      {/* Protection Layer for Paid Images */}
      {isPaid && (
        <div className="absolute inset-0 z-40 bg-transparent" 
          style={{ 
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none',
            userSelect: 'none'
          }} 
        />
      )}
    </div>
  );
} 