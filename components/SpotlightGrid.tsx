'use client';

import Image from 'next/image';
import Link from 'next/link';

interface SpotlightGridProps {
  images: {
    src: string;
    alt: string;
    href?: string;
    price?: number;
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
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Price Badge */}
      {typeof image.price === 'number' && (
        <span className="absolute top-2 right-2 bg-[#4169E1] text-[#F8F8F8] text-xs font-medium px-2 py-1 rounded-full z-10">
          {image.price === 0 ? 'Free' : `₹${image.price}`}
        </span>
      )}
      
      {/* Title on Hover */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <p className="text-sm font-medium truncate">{image.alt}</p>
      </div>
    </>
  );
} 