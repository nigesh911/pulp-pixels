'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface SpotlightGridProps {
  images: {
    src: string;
    alt: string;
  }[];
}

export default function SpotlightGrid({ images }: SpotlightGridProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!gridRef.current) return;

      const rect = gridRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const grid = gridRef.current;
    if (grid) {
      grid.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (grid) {
        grid.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <div 
      ref={gridRef}
      className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 overflow-hidden"
      style={{
        background: 'radial-gradient(600px at var(--mouse-x) var(--mouse-y), rgba(65, 105, 225, 0.15), transparent 80%)',
        '--mouse-x': `${mousePosition.x}px`,
        '--mouse-y': `${mousePosition.y}px`,
      } as any}
    >
      {images.map((image, index) => (
        <div
          key={index}
          className="group relative aspect-square overflow-hidden rounded-xl bg-[#1A1A1A] transition-all duration-300"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'perspective(1000px)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#4169E1]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      ))}
    </div>
  );
} 