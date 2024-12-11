'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Download } from 'lucide-react';
import StarRating from '@/components/StarRating';
import { toast } from 'react-hot-toast';
import Script from 'next/script';
import type { Wallpaper } from '@/lib/supabase';
import WallpaperImage from '@/components/WallpaperImage';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface WallpaperClientProps {
  wallpaper: Wallpaper;
}

export default function WallpaperClient({ wallpaper }: WallpaperClientProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  useEffect(() => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      setIsRazorpayLoaded(true);
    }
  }, []);

  async function handleDownload(e: React.FormEvent) {
    e.preventDefault();
    if (!email || isSubmitting) return;

    try {
      setIsSubmitting(true);

      if (wallpaper.price > 0) {
        if (!isRazorpayLoaded) {
          toast.error('Payment system is still loading. Please try again in a moment.');
          setIsSubmitting(false);
          return;
        }

        // Handle paid download
        const response = await fetch('/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: wallpaper.price,
            wallpaperId: wallpaper.id
          })
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.details || data.error || 'Failed to create order');
        }

        console.log('Received key from server:', data.key ? 'Key exists' : 'No key');
        console.log('Order data:', { 
          orderId: data.orderId,
          amount: data.amount,
          currency: data.currency
        });

        const options = {
          key: data.key,
          amount: data.amount,
          currency: data.currency,
          name: 'Pulp Pixels',
          description: `Payment for ${wallpaper.title}`,
          order_id: data.orderId,
          handler: function(response: any) {
            // Use non-async handler to avoid potential errors
            toast.loading('Processing payment...', { id: 'payment' });

            // Simple fetch with proper error handling
            fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                wallpaperId: wallpaper.id,
                email: email
              })
            })
            .then(res => res.json())
            .then(data => {
              if (data.success) {
                toast.success('Payment successful! Check your email for the download link.', { id: 'payment' });
              } else {
                toast.error(data.error || 'Payment verification failed', { id: 'payment' });
              }
            })
            .catch(() => {
              toast.error('Payment verification failed. Please contact support.', { id: 'payment' });
            })
            .finally(() => {
              setIsSubmitting(false);
            });
          },
          modal: {
            ondismiss: function() {
              setIsSubmitting(false);
              toast.error('Payment cancelled', { id: 'payment' });
            },
            escape: true,
            backdropclose: false
          },
          prefill: {
            email: email,
            contact: ''
          },
          theme: {
            color: '#4169E1'
          }
        };

        try {
          const rzp = new window.Razorpay(options);
          
          rzp.on('payment.failed', function(response: any) {
            console.error('Payment failed:', response.error);
            toast.error(`Payment failed: ${response.error.description || 'Please try again'}`, { 
              id: 'payment',
              duration: 5000 
            });
            setIsSubmitting(false);
          });

          rzp.open();
        } catch (error) {
          console.error('Razorpay initialization error:', error);
          toast.error('Failed to initialize payment. Please try again.');
          setIsSubmitting(false);
        }
      } else {
        // Handle free download
        try {
          toast.loading('Sending download link...', { id: 'download' });
          const response = await fetch('/api/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              wallpaperId: wallpaper.id,
              email: email
            })
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.details || data.error || 'Failed to send download link');
          }

          toast.success('Check your email for the download link!', { 
            id: 'download',
            duration: 5000 
          });
        } catch (error) {
          console.error('Download error:', error);
          toast.error(
            error instanceof Error ? error.message : 'Failed to send download link. Please try again.',
            { id: 'download', duration: 5000 }
          );
        } finally {
          setIsSubmitting(false);
        }
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to initialize payment. Please try again.');
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setIsRazorpayLoaded(true)}
        onError={() => {
          setIsRazorpayLoaded(false);
          toast.error('Failed to load payment system. Please refresh the page.');
        }}
      />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Preview */}
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
            <WallpaperImage
              src={wallpaper.preview_url}
              alt={wallpaper.title}
              aspectRatio="mobile"
              isPaid={wallpaper.price > 0}
              className="w-full h-full"
            />
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-[#F8F8F8]">{wallpaper.title}</h1>
              <div className="mt-4">
                <StarRating 
                  wallpaperId={wallpaper.id} 
                  initialRating={wallpaper.average_rating} 
                  totalRatings={wallpaper.total_ratings}
                />
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#F8F8F8]">
                {wallpaper.price === 0 ? 'Free' : `₹${wallpaper.price}`}
              </span>
              {wallpaper.price > 0 && (
                <span className="text-[#F8F8F8]/60">One-time purchase</span>
              )}
            </div>

            {/* Download Form */}
            <form onSubmit={handleDownload} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#F8F8F8]/80 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-2 bg-white/5 border border-[#4169E1]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4169E1]/50 text-[#F8F8F8]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || (wallpaper.price > 0 && !isRazorpayLoaded)}
                className={`w-full flex items-center justify-center gap-2 bg-[#4169E1] text-white px-6 py-3 rounded-lg hover:bg-[#4169E1]/90 transition-colors ${
                  isSubmitting || (wallpaper.price > 0 && !isRazorpayLoaded) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Download className="w-5 h-5" />
                {isSubmitting ? 'Processing...' : wallpaper.price === 0 ? 'Download Now' : 'Buy Now'}
              </button>
            </form>

            {/* Additional Info */}
            <div className="space-y-2 text-[#F8F8F8]/60">
              <p>• High resolution wallpaper</p>
              <p>• Instant download after {wallpaper.price === 0 ? 'email verification' : 'payment'}</p>
              <p>• Compatible with all devices</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 