'use client';

import React, { useState } from 'react';
import type { Wallpaper } from '@/lib/supabase';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import StarRating from './StarRating';
import WallpaperImage from './WallpaperImage';

interface WallpaperDetailsProps {
  wallpaper: Wallpaper;
}

export default function WallpaperDetails({ wallpaper }: WallpaperDetailsProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleDownload(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      await sendDownloadLink();
      toast.success('Download link sent to your email!');
      setEmail('');
    } catch (error) {
      toast.error('Failed to send download link');
      console.error('Download error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function sendDownloadLink() {
    const response = await fetch('/api/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wallpaperId: wallpaper.id,
        email: email
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send download link');
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Wallpaper Preview */}
        <div className="relative">
          <WallpaperImage
            src={wallpaper.preview_url}
            alt={wallpaper.title}
            aspectRatio={wallpaper.category as 'mobile' | 'desktop'}
            isPaid={wallpaper.price > 0}
            fit="contain"
            className="w-full shadow-xl"
          />
        </div>

        {/* Details */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-[#F8F8F8]">{wallpaper.title}</h1>
            <p className="text-[#F8F8F8]/60 mt-2">{wallpaper.description}</p>
          </div>

          <div className="flex items-center gap-4">
            <StarRating 
              wallpaperId={wallpaper.id}
              initialRating={wallpaper.average_rating}
              totalRatings={wallpaper.total_ratings}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#F8F8F8]">
                {wallpaper.price === 0 ? 'Free' : `₹${wallpaper.price}`}
              </span>
              {wallpaper.price > 0 && (
                <span className="text-[#F8F8F8]/60">One-time purchase</span>
              )}
            </div>

            <form onSubmit={handleDownload} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#F8F8F8]/80 mb-2">
                  Enter your email to receive the download link
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4169E1]/50 text-[#F8F8F8]"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#4169E1] text-white py-3 rounded-lg hover:bg-[#4169E1]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Get Download Link'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 