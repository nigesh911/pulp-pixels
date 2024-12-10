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
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    try {
      console.log('Creating order for wallpaper:', {
        id: wallpaper.id,
        title: wallpaper.title,
        price: wallpaper.price
      });

      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: wallpaper.price * 100,
          wallpaperId: wallpaper.id,
        }),
      });

      const data = await response.json();
      console.log('Order created:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'YV Digital',
        description: `Payment for ${wallpaper.title}`,
        order_id: data.orderId,
        handler: async function(response: any) {
          console.log('Payment successful:', response);
          try {
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
            console.log('Verification response:', verifyData);

            if (!verifyResponse.ok) {
              throw new Error(verifyData.error || 'Payment verification failed');
            }

            onSuccess?.();
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support if amount was deducted.');
          }
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal dismissed by user');
            setLoading(false);
          },
          confirm_close: true,
          escape: false
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#4169E1'
        },
        retry: {
          enabled: true,
          max_count: 3
        }
      };

      console.log('Initializing Razorpay with options:', {
        ...options,
        key: '***',
        amount: options.amount,
        order_id: options.order_id
      });

      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', function(response: any) {
        console.error('Payment failed response:', response);
        const { error } = response;
        let errorMessage = 'Payment failed. ';
        
        if (error) {
          if (error.description) errorMessage += error.description;
          if (error.reason) errorMessage += ` Reason: ${error.reason}`;
          if (error.step) errorMessage += ` Step: ${error.step}`;
          if (error.source) errorMessage += ` Source: ${error.source}`;
        }
        
        alert(errorMessage || 'Payment failed. Please try again.');
        setLoading(false);
      });

      razorpay.open();
    } catch (error: any) {
      console.error('Payment initialization error:', error);
      alert(error.message || 'Failed to initiate payment. Please try again.');
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