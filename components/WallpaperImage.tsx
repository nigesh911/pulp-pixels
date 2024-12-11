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
}

export default function WallpaperImage({ 
  src, 
  alt, 
  className = '', 
  aspectRatio = 'mobile',
  isPaid = false 
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
    <div 
      className={`relative ${aspectRatio === 'mobile' ? 'aspect-[9/16]' : 'aspect-[16/9]'} rounded-xl overflow-hidden ${className}`}
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
      
      {/* Main Image */}
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover select-none pointer-events-none"
          onError={() => setImageError(true)}
          unoptimized={isPaid} // Disable optimization for paid images
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Watermark Pattern */}
      <div className="absolute inset-0 z-20 select-none pointer-events-none">
        <div className="absolute inset-0 grid grid-cols-2 gap-4 transform rotate-[-30deg] opacity-[0.08]">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="whitespace-nowrap text-white text-xl font-bold">
              Pulp Pixels
            </div>
          ))}
        </div>
      </div>

      {/* Protection Layer for Paid Images */}
      {isPaid && (
        <div className="absolute inset-0 z-30 bg-transparent" 
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