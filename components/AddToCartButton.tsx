'use client';

import { useState } from 'react';
import type { Wallpaper } from '@/lib/supabase';
import { ShoppingCart } from 'lucide-react';

interface AddToCartButtonProps {
  onClick: () => void;
  className?: string;
}

export default function AddToCartButton({ onClick, className = '' }: AddToCartButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`bg-[#4169E1] text-white px-6 py-2 rounded-lg hover:bg-[#4169E1]/90 transition-colors ${className}`}
    >
      Add to Cart
    </button>
  );
} 