'use client';

import { useState, useEffect } from 'react';
import { IndianRupee, Loader2 } from 'lucide-react';
import type { Wallpaper } from '@/lib/supabase';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface UPIPaymentButtonProps {
  wallpaper: Wallpaper;
  onSuccess?: () => void;
}

export default function UPIPaymentButton({ wallpaper, onSuccess }: UPIPaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Create order on server
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: wallpaper.price * 100, // Convert to paise
          wallpaperId: wallpaper.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: wallpaper.price * 100, // Amount in paise
        currency: 'INR',
        name: 'YV Digital',
        description: `Payment for ${wallpaper.title}`,
        order_id: data.orderId,
        handler: async function(response: any) {
          try {
            // Verify payment on server
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderId: data.orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                wallpaperId: wallpaper.id,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(verifyData.error || 'Payment verification failed');
            }

            // Payment successful
            onSuccess?.();
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#4169E1'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="px-6 py-3 bg-[#4169E1] text-[#F8F8F8] rounded-lg hover:bg-[#4169E1]/90 transition-colors flex items-center gap-2 disabled:opacity-50"
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <IndianRupee className="w-5 h-5" />
          Pay {new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
          }).format(wallpaper.price)}
        </>
      )}
    </button>
  );
} 