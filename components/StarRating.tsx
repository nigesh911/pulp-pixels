'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface StarRatingProps {
  wallpaperId: string;
  initialRating?: number | null;
  totalRatings?: number | null;
}

export default function StarRating({ wallpaperId, initialRating = 0, totalRatings = 0 }: StarRatingProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [averageRating, setAverageRating] = useState(initialRating ?? 0);
  const [ratingCount, setRatingCount] = useState(totalRatings ?? 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load user's previous rating from localStorage on mount
  useEffect(() => {
    const storedRating = localStorage.getItem(`rating_${wallpaperId}`);
    if (storedRating) {
      setRating(parseInt(storedRating));
      setHasRated(true);
    }
  }, [wallpaperId]);

  // Function to get a simple browser fingerprint
  const getBrowserFingerprint = () => {
    const { userAgent, language, platform } = navigator;
    return btoa(`${userAgent}${language}${platform}`);
  };

  const handleRating = async (value: number) => {
    if (isSubmitting || (hasRated && rating === value)) return;

    setIsSubmitting(true);
    const fingerprint = getBrowserFingerprint();

    try {
      const { data: existingRating } = await supabase
        .from('ratings')
        .select('rating')
        .eq('wallpaper_id', wallpaperId)
        .eq('browser_fingerprint', fingerprint)
        .single();

      if (existingRating) {
        // Update existing rating
        await supabase
          .from('ratings')
          .update({ rating: value })
          .eq('wallpaper_id', wallpaperId)
          .eq('browser_fingerprint', fingerprint);
      } else {
        // Insert new rating
        await supabase
          .from('ratings')
          .insert([
            {
              wallpaper_id: wallpaperId,
              rating: value,
              browser_fingerprint: fingerprint,
              user_ip: null // IP will be handled by RLS policies
            }
          ]);
        setRatingCount(prev => prev + 1);
      }

      // Update local state and storage
      setRating(value);
      setHasRated(true);
      localStorage.setItem(`rating_${wallpaperId}`, value.toString());

      // Fetch updated average
      const { data: updatedWallpaper } = await supabase
        .from('wallpapers')
        .select('average_rating')
        .eq('id', wallpaperId)
        .single();

      if (updatedWallpaper) {
        setAverageRating(updatedWallpaper.average_rating || 0);
      }

    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => !hasRated && handleRating(star)}
            onMouseEnter={() => !hasRated && setHover(star)}
            onMouseLeave={() => !hasRated && setHover(0)}
            disabled={hasRated || isSubmitting}
            className={`transition-transform ${!hasRated && 'hover:scale-110'} ${hasRated && 'cursor-default'}`}
          >
            <Star
              className={`w-6 h-6 ${
                star <= (hover || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      
      <div className="text-sm text-center">
        {hasRated ? (
          <p className="text-[#F8F8F8]/60">Thanks for rating!</p>
        ) : (
          <p className="text-[#F8F8F8]/60">Rate this wallpaper</p>
        )}
        {ratingCount > 0 && (
          <p className="text-[#F8F8F8]/40 text-xs">
            {averageRating.toFixed(1)} stars ({ratingCount} {ratingCount === 1 ? 'rating' : 'ratings'})
          </p>
        )}
      </div>
    </div>
  );
} 