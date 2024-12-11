'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Download } from 'lucide-react';
import StarRating from '@/components/StarRating';
import { toast } from 'react-hot-toast';
import type { Wallpaper } from '@/lib/supabase';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface WallpaperDetailsProps {
  wallpaper: Wallpaper;
}

export default function WallpaperDetails({ wallpaper }: WallpaperDetailsProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleDownload(e: React.FormEvent) {
    e.preventDefault();
    if (!email || isSubmitting) return;

    try {
      setIsSubmitting(true);

      if (wallpaper.price > 0) {
        // Handle paid download
        const response = await fetch('/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: wallpaper.price * 100, // Convert to paise
            wallpaperId: wallpaper.id
          })
        });

        const data = await response.json();
        
        if (!response.ok) {
          console.error('Order creation failed:', data);
          throw new Error(data.details || 'Failed to create order');
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: data.currency,
          name: 'Pulp Pixels',
          description: `Payment for ${wallpaper.title}`,
          order_id: data.orderId,
          handler: async function (response: any) {
            try {
              const verifyResponse = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                  wallpaperId: wallpaper.id
                })
              });

              if (!verifyResponse.ok) {
                throw new Error('Payment verification failed');
              }

              await sendDownloadLink();
              toast.success('Payment successful! Check your email for the download link.');
            } catch (error) {
              console.error('Payment verification error:', error);
              toast.error('Payment verification failed. Please contact support.');
            } finally {
              setIsSubmitting(false);
            }
          },
          prefill: {
            email: email
          },
          theme: {
            color: '#4169E1'
          },
          modal: {
            ondismiss: function() {
              setIsSubmitting(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        
        rzp.on('payment.failed', function(response: any) {
          console.error('Payment failed:', response.error);
          toast.error('Payment failed. Please try again.');
          setIsSubmitting(false);
        });

        rzp.open();
      } else {
        // Handle free download
        await sendDownloadLink();
        toast.success('Check your email for the download link!');
        setIsSubmitting(false);
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
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
        {/* Image Preview */}
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
          <Image
            src={wallpaper.preview_url}
            alt={wallpaper.title}
            fill
            className="object-cover"
            priority
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
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-2 bg-[#4169E1] text-white px-6 py-3 rounded-lg hover:bg-[#4169E1]/90 transition-colors ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Download className="w-5 h-5" />
                {isSubmitting ? 'Processing...' : wallpaper.price === 0 ? 'Download Now' : 'Buy Now'}
              </button>
            </form>
          </div>

          {/* Additional Info */}
          <div className="space-y-4 pt-8 border-t border-white/10">
            <h3 className="text-lg font-semibold text-[#F8F8F8]">About this wallpaper</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[#F8F8F8]/60">Category</p>
                <p className="text-[#F8F8F8] capitalize">{wallpaper.category}</p>
              </div>
              <div>
                <p className="text-[#F8F8F8]/60">Resolution</p>
                <p className="text-[#F8F8F8]">4K Ultra HD</p>
              </div>
              <div>
                <p className="text-[#F8F8F8]/60">Format</p>
                <p className="text-[#F8F8F8]">JPG</p>
              </div>
              <div>
                <p className="text-[#F8F8F8]/60">License</p>
                <p className="text-[#F8F8F8]">Personal Use</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 