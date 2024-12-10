'use client';

import { useState } from 'react';
import type { Wallpaper } from '@/lib/supabase';
import { ShoppingCart } from 'lucide-react';

export default function AddToCartButton({ wallpaper }: { wallpaper: Wallpaper }) {
  const [isLoading, setIsLoading] = useState(false);

  const addToCart = async () => {
    setIsLoading(true);
    try {
      // Here you would typically:
      // 1. Add the item to a cart in your database
      // 2. Update local cart state
      // 3. Show a success message
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      alert('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={addToCart}
      disabled={isLoading}
      className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ShoppingCart className="w-5 h-5" />
      {isLoading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
} 