'use client';

import React from 'react';
import Link from 'next/link';
import { ImageOff, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
          <ImageOff className="w-8 h-8 text-[#4169E1]" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-[#F8F8F8]">Wallpaper Not Found</h1>
          <p className="text-[#F8F8F8]/60 max-w-md">
            The wallpaper you're looking for doesn't exist or has been removed.
          </p>
        </div>

        <Link 
          href="/wallpapers"
          className="inline-flex items-center gap-2 text-[#4169E1] hover:text-[#4169E1]/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Wallpapers
        </Link>
      </div>
    </div>
  );
} 