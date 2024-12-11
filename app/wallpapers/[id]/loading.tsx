'use client';

import React from 'react';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Skeleton */}
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-white/5 animate-pulse" />

        {/* Content Skeleton */}
        <div className="space-y-6">
          {/* Title */}
          <div className="h-8 w-3/4 bg-white/5 rounded animate-pulse" />

          {/* Price */}
          <div className="h-6 w-1/4 bg-white/5 rounded animate-pulse" />

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-white/5 rounded animate-pulse" />
            <div className="h-4 w-4/6 bg-white/5 rounded animate-pulse" />
          </div>

          {/* Email Form */}
          <div className="space-y-4">
            <div className="h-10 w-full bg-white/5 rounded animate-pulse" />
            <div className="h-12 w-full bg-white/5 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
} 