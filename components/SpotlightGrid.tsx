'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ImageOff, Star } from 'lucide-react';

interface SpotlightGridProps {
  images: {
    src: string;
    alt: string;
    href?: string;
    price?: number;
    rating?: number;
    totalRatings?: number;
  }[];
}

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#1A1A1A" offset="20%" />
      <stop stop-color="#262626" offset="50%" />
      <stop stop-color="#1A1A1A" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#1A1A1A" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

export default function SpotlightGrid({ images }: SpotlightGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image, index) => (
        image.href ? (
          <Link
            key={index}
            href={image.href}
            className="group relative aspect-square overflow-hidden rounded-xl bg-[#1A1A1A] transition-all duration-300 hover:scale-[1.02]"
          >
            <GridItemContent image={image} priority={index < 4} />
          </Link>
        ) : (
          <div
            key={index}
            className="group relative aspect-square overflow-hidden rounded-xl bg-[#1A1A1A] transition-all duration-300 hover:scale-[1.02]"
          >
            <GridItemContent image={image} priority={index < 4} />
          </div>
        )
      ))}
    </div>
  );
}

function GridItemContent({ image, priority = false }: { image: SpotlightGridProps['images'][0], priority?: boolean }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#1A1A1A]">
        <div className="text-center text-[#F8F8F8]/60">
          <ImageOff className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">Image not found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-[#4169E1]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority={priority}
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        placeholder="blur"
        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(400, 400))}`}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        onError={() => setError(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Price Badge */}
      {typeof image.price === 'number' && (
        <span className="absolute top-2 right-2 bg-[#4169E1] text-[#F8F8F8] text-xs font-medium px-2 py-1 rounded-full z-10">
          {image.price === 0 ? 'Free' : `₹${image.price}`}
        </span>
      )}
      
      {/* Content on Hover */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <p className="text-sm font-medium truncate mb-1">{image.alt}</p>
        {image.rating !== undefined && (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-[#4169E1] text-[#4169E1]" />
            <span className="text-xs">
              {image.rating.toFixed(1)}
              {image.totalRatings !== undefined && (
                <span className="text-white/60 ml-1">
                  ({image.totalRatings})
                </span>
              )}
            </span>
          </div>
        )}
      </div>
    </>
  );
} 