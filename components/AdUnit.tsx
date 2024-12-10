'use client';

import { useEffect } from 'react';

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical';
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function AdUnit({ slot, format = 'auto', style }: AdUnitProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('Ad loading error:', err);
    }
  }, []);

  return (
    <div className="ad-container my-4">
      <ins
        className="adsbygoogle"
        style={style || { display: 'block' }}
        data-ad-client="ca-pub-8588729139517913"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
} 