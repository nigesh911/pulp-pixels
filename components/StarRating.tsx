'use client';

import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface StarRatingProps {
  wallpaperId: string;
  initialRating?: number | null;
  totalRatings?: number | null;
}

export default function StarRating({ wallpaperId, initialRating = 0, totalRatings = 0 }: StarRatingProps) {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(initialRating || 0);
  const [totalRatingCount, setTotalRatingCount] = useState<number>(totalRatings || 0);
  const [hasRated, setHasRated] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    // Check if user has already rated this wallpaper
    const storedRating = localStorage.getItem(`rating_${wallpaperId}`);
    if (storedRating) {
      setRating(Number(storedRating));
      setHasRated(true);
    }
  }, [wallpaperId]);

  const handleRating = async (value: number) => {
    if (isSubmitting || hasRated) return;

    try {
      setIsSubmitting(true);

      // Insert new rating
      const { error: ratingError } = await supabase
        .from('ratings')
        .insert({
          wallpaper_id: wallpaperId,
          rating: value
        });

      if (ratingError) {
        console.error('Rating error:', ratingError);
        throw new Error(ratingError.message || 'Failed to submit rating');
      }

      // Store rating in localStorage first
      localStorage.setItem(`rating_${wallpaperId}`, value.toString());
      setRating(value);
      setHasRated(true);

      // Fetch updated rating stats
      const { data: stats, error: statsError } = await supabase
        .from('wallpapers')
        .select('average_rating, total_ratings')
        .eq('id', wallpaperId)
        .single();

      if (statsError) {
        console.error('Stats error:', statsError);
      } else if (stats) {
        setAverageRating(stats.average_rating || 0);
        setTotalRatingCount(stats.total_ratings || 0);
      }

      toast.success('Thank you for rating!');
    } catch (error) {
      console.error('Error rating wallpaper:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit rating');
      
      // Revert local state on error
      localStorage.removeItem(`rating_${wallpaperId}`);
      setRating(0);
      setHasRated(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRating(star)}
            onMouseEnter={() => !hasRated && !isSubmitting && setHover(star)}
            onMouseLeave={() => !hasRated && !isSubmitting && setHover(0)}
            disabled={hasRated || isSubmitting}
            className={`p-1 focus:outline-none transition-transform ${
              !hasRated && !isSubmitting && 'hover:scale-110'
            } ${(hasRated || isSubmitting) && 'cursor-not-allowed'}`}
          >
            <Star
              className={`w-6 h-6 transition-colors ${
                star <= (hover || rating)
                  ? 'fill-[#4169E1] text-[#4169E1]'
                  : star <= averageRating
                  ? 'fill-[#4169E1]/50 text-[#4169E1]/50'
                  : 'fill-none text-[#4169E1]/30'
              } ${isSubmitting && 'opacity-50'}`}
            />
          </button>
        ))}
      </div>
      <p className="text-sm text-[#F8F8F8]/60">
        {averageRating.toFixed(1)} ({totalRatingCount} {totalRatingCount === 1 ? 'rating' : 'ratings'})
        {hasRated && <span className="ml-2 text-[#4169E1]">• Rated</span>}
        {isSubmitting && <span className="ml-2 text-[#4169E1]">• Submitting...</span>}
      </p>
    </div>
  );
} 