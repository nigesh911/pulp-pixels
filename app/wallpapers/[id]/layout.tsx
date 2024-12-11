import React from 'react';

interface WallpaperLayoutProps {
  children: React.ReactNode;
}

export default function WallpaperLayout({ children }: WallpaperLayoutProps) {
  return (
    <div className="container mx-auto px-4">
      {children}
    </div>
  );
} 