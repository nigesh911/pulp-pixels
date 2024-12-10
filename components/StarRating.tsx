import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.d';

interface StarRatingProps {
  wallpaperId: string;
  initialRating?: number | null;
  totalRatings?: number | null;
}

export default function StarRating({ wallpaperId, initialRating = 0, totalRatings = 0 }: StarRatingProps) {
  const [rating, setRating] = useState(initialRating || 0);
  const [hover, setHover] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [ratingCount, setRatingCount] = useState(totalRatings || 0);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClientComponentClient<Database>();

  // Check if user has already rated this wallpaper
  useEffect(() => {
    const checkExistingRating = async () => {
      try {
        const { data: existingRating } = await supabase
          .from('ratings')
          .select('rating')
          .eq('wallpaper_id', wallpaperId)
          .maybeSingle();

        if (existingRating) {
          setHasRated(true);
          setRating(existingRating.rating);
        }
      } catch (error) {
        console.error('Error checking existing rating:', error);
      }
    };

    checkExistingRating();
  }, [wallpaperId]);

  // Update local state when props change
  useEffect(() => {
    setRating(initialRating || 0);
    setRatingCount(totalRatings || 0);
  }, [initialRating, totalRatings]);

  async function handleRating(value: number) {
    if (hasRated || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      // Insert the new rating
      const { error: insertError } = await supabase
        .from('ratings')
        .insert([{ wallpaper_id: wallpaperId, rating: value }]);

      if (insertError) {
        console.error('Insert Error:', insertError);
        throw new Error('Unable to submit rating. Please try again.');
      }

      // Get updated rating stats
      const { data: ratingData, error: fetchError } = await supabase
        .from('ratings')
        .select('rating')
        .eq('wallpaper_id', wallpaperId);

      if (fetchError) {
        console.error('Fetch Error:', fetchError);
        throw new Error('Unable to calculate rating. Please try again.');
      }

      if (ratingData && ratingData.length > 0) {
        const newAverage = ratingData.reduce((acc: number, curr: { rating: number }) => acc + curr.rating, 0) / ratingData.length;
        
        const { error: updateError } = await supabase
          .from('wallpapers')
          .update({ 
            average_rating: Number(newAverage.toFixed(2)),
            total_ratings: ratingData.length
          })
          .eq('id', wallpaperId);

        if (updateError) {
          console.error('Update Error:', updateError);
          throw new Error('Unable to update rating. Please try again.');
        }

        setRating(value); // Set to user's rating
        setRatingCount(ratingData.length);
      }

      setHasRated(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error submitting rating. Please try again.';
      setError(errorMessage);
      console.error('Rating Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRating(star)}
            onMouseEnter={() => !hasRated && !isSubmitting && setHover(star)}
            onMouseLeave={() => !hasRated && !isSubmitting && setHover(0)}
            disabled={hasRated || isSubmitting}
            className={`p-1 transition-colors ${
              hasRated || isSubmitting ? 'cursor-default' : 'cursor-pointer'
            }`}
          >
            <Star
              className={`w-6 h-6 ${
                star <= (hover || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-[#F8F8F8]/20'
              } ${isSubmitting ? 'opacity-50' : ''} transition-colors`}
            />
          </button>
        ))}
      </div>
      <div className="text-sm text-center">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p className="text-[#F8F8F8]/60">
            {isSubmitting 
              ? 'Submitting...' 
              : hasRated 
                ? 'Thanks for rating!' 
                : 'Rate this wallpaper'}
            {ratingCount > 0 && ` • ${ratingCount} ${ratingCount === 1 ? 'rating' : 'ratings'}`}
          </p>
        )}
      </div>
    </div>
  );
} 