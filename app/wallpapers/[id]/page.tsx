'use client';

import { useEffect, useState, use } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Download, Shield, Smartphone, Monitor, X, Mail } from 'lucide-react';
import Image from 'next/image';
import type { Wallpaper } from '@/lib/supabase';
import UPIPaymentButton from '@/components/UPIPaymentButton';
import WallpaperImage from '@/components/WallpaperImage';
import StarRating from '@/components/StarRating';
import type { Database } from '@/lib/database.d';

type Rating = Database['public']['Tables']['ratings']['Row'];

export default function WallpaperPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [wallpaper, setWallpaper] = useState<Wallpaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [paymentComplete, setPaymentComplete] = useState(false);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    fetchWallpaper();
  }, [id]);

  async function fetchWallpaper() {
    try {
      // First get the wallpaper data
      const { data, error } = await supabase
        .from('wallpapers')
        .select(`
          *,
          ratings:ratings(rating)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!data) {
        setWallpaper(null);
        setLoading(false);
        return;
      }

      // Check if the image exists in storage
      const { data: { publicUrl } } = supabase.storage
        .from('wallpapers')
        .getPublicUrl(data.image_path);

      const imageExists = await fetch(publicUrl, { method: 'HEAD' })
        .then(res => res.ok)
        .catch(() => false);

      if (!imageExists) {
        // If image doesn't exist, delete the wallpaper record
        await supabase
          .from('wallpapers')
          .delete()
          .eq('id', id);
        
        setWallpaper(null);
        setLoading(false);
        return;
      }

      // Calculate average rating and total ratings
      const ratings = (data.ratings || []) as Pick<Rating, 'rating'>[];
      const totalRatings = ratings.length;
      const averageRating = totalRatings > 0
        ? ratings.reduce((acc: number, curr: Pick<Rating, 'rating'>) => acc + curr.rating, 0) / totalRatings
        : 0;

      setWallpaper({
        ...data,
        average_rating: averageRating,
        total_ratings: totalRatings
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wallpaper:', error);
      setLoading(false);
    }
  }

  async function handleDownload() {
    if (!wallpaper) return;
    
    // For free wallpapers, show email modal directly
    if (wallpaper.price === 0) {
      setShowEmailModal(true);
      return;
    }
    
    // For paid wallpapers, check if payment is complete
    if (!paymentComplete) {
      setMessage('Please complete the payment first');
      return;
    }
    
    // If payment is complete, show email modal
    setShowEmailModal(true);
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!wallpaper || !email) return;

    try {
      setSending(true);
      setMessage('');

      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallpaperId: wallpaper.id,
          email: email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send download link');
      }

      setMessage('Download link has been sent to your email!');
      setTimeout(() => {
        setShowEmailModal(false);
        setEmail('');
        setMessage('');
      }, 3000);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to send download link');
    } finally {
      setSending(false);
    }
  }

  function handlePaymentSuccess() {
    setPaymentComplete(true);
    setShowEmailModal(true);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-spin h-8 w-8 border-4 border-[#4169E1] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!wallpaper) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <p className="text-[#F8F8F8]/60">Wallpaper not found</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section with Watermark */}
          <div className="relative w-full">
            <WallpaperImage
              src={wallpaper.image_path}
              alt={wallpaper.title}
              aspectRatio={wallpaper.category as 'mobile' | 'desktop'}
              className="w-full"
            />
          </div>

          {/* Details Section */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-[#F8F8F8] mb-4 bg-black/50 inline-block px-4 py-2 rounded-lg">
                {wallpaper.title}
              </h1>
              {wallpaper.description && (
                <p className="text-[#F8F8F8]/80 mt-4">{wallpaper.description}</p>
              )}
            </div>

            {/* Rating */}
            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm">
              <StarRating 
                wallpaperId={wallpaper.id} 
                initialRating={wallpaper.average_rating} 
                totalRatings={wallpaper.total_ratings}
              />
            </div>

            {/* Price & Download */}
            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[#F8F8F8]/60 text-sm">Price</p>
                  <p className="text-2xl font-bold text-[#F8F8F8]">
                    {wallpaper.price === 0 ? 'Free' : new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      maximumFractionDigits: 0,
                    }).format(wallpaper.price)}
                  </p>
                </div>
                {wallpaper.price === 0 ? (
                  <button
                    onClick={handleDownload}
                    className="px-4 sm:px-6 py-3 bg-[#4169E1] text-[#F8F8F8] rounded-lg hover:bg-[#4169E1]/90 transition-colors flex items-center gap-2 text-sm sm:text-base whitespace-nowrap"
                  >
                    <Download className="w-5 h-5" />
                    <span className="hidden sm:inline">Download </span>
                    {wallpaper.category === 'mobile' ? 'Mobile' : 'Desktop'}
                    <span className="hidden sm:inline"> Wallpaper</span>
                  </button>
                ) : (
                  <UPIPaymentButton 
                    wallpaper={wallpaper} 
                    onSuccess={handlePaymentSuccess}
                  />
                )}
              </div>
              {message && (
                <p className="text-red-500 text-sm mt-2">{message}</p>
              )}
            </div>

            {/* Features */}
            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-[#F8F8F8] mb-4">Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-[#F8F8F8]/80">
                  {wallpaper.category === 'mobile' ? (
                    <Smartphone className="w-5 h-5 text-[#4169E1]" />
                  ) : (
                    <Monitor className="w-5 h-5 text-[#4169E1]" />
                  )}
                  Optimized for {wallpaper.category === 'mobile' ? 'Mobile' : 'Desktop'}
                </div>
                <div className="flex items-center gap-3 text-[#F8F8F8]/80">
                  <Shield className="w-5 h-5 text-[#4169E1]" />
                  Secure Download
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="inline-block">
              <span className="bg-white/10 text-[#F8F8F8] text-sm font-medium px-3 py-1 rounded-full capitalize">
                {wallpaper.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1A1A1A] rounded-xl p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowEmailModal(false)}
              className="absolute top-4 right-4 text-[#F8F8F8]/60 hover:text-[#F8F8F8]"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <Mail className="w-6 h-6 text-[#4169E1]" />
              <h2 className="text-xl font-semibold text-[#F8F8F8]">
                Enter your email to download
              </h2>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#F8F8F8]/60 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4169E1]/50 text-[#F8F8F8]"
                  placeholder="your@email.com"
                />
              </div>

              {message && (
                <p className={`text-sm p-3 rounded-lg ${
                  message.includes('sent') 
                    ? 'bg-green-500/10 text-green-500' 
                    : 'bg-red-500/10 text-red-500'
                }`}>
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={sending || !email}
                className="w-full px-4 py-2 bg-[#4169E1] text-[#F8F8F8] rounded-lg hover:bg-[#4169E1]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Send Download Link
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
} 