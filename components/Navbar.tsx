'use client';

import Link from 'next/link';
import { User, Upload, Search, X, LogIn, LogOut, Settings } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Wallpaper } from '@/lib/supabase';

export default function Navbar() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Wallpaper[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkUser();

    // Add click outside listener for both dropdowns
    const handleClickOutside = (event: MouseEvent) => {
      // Close account dropdown if clicking outside
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      // Close search dropdown if clicking outside
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search
  useEffect(() => {
    const searchWallpapers = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const { data } = await response.json();
        setSearchResults(data || []);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchWallpapers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();
      setIsAdmin(!!profile?.is_admin);
    } else {
      setIsAdmin(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setShowDropdown(false);
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#121212]/80 backdrop-blur-md z-50 border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-[#F8F8F8]">
            Wallpapers
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="relative" ref={searchRef}>
              {showSearch ? (
                <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 md:relative md:inset-auto md:bg-transparent md:p-0">
                  <div className="relative w-full max-w-md md:w-80">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Try 'free mobile' or 'desktop'..."
                      className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4169E1]/50 text-[#F8F8F8] placeholder-[#F8F8F8]/60"
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        setShowSearch(false);
                        setSearchQuery('');
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F8F8F8]/60 hover:text-[#F8F8F8]"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    {/* Search Results */}
                    {searchQuery && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1A1A] rounded-lg shadow-lg border border-white/10 max-h-[60vh] overflow-y-auto">
                        {isSearching ? (
                          <div className="p-4 text-center text-[#F8F8F8]/60">
                            Searching...
                          </div>
                        ) : searchResults.length > 0 ? (
                          searchResults.map((result) => (
                            <Link
                              key={result.id}
                              href={`/wallpapers/${result.id}`}
                              className="flex items-center gap-3 p-3 hover:bg-white/5 text-[#F8F8F8]"
                              onClick={() => {
                                setShowSearch(false);
                                setSearchQuery('');
                              }}
                            >
                              {/* Preview Image */}
                              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                  src={result.preview_url}
                                  alt={result.title}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              
                              {/* Details */}
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{result.title}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-[#F8F8F8]/80 capitalize">
                                    {result.category}
                                  </span>
                                  <span className="text-sm text-[#F8F8F8]/60">
                                    {result.price === 0 ? 'Free' : new Intl.NumberFormat('en-IN', {
                                      style: 'currency',
                                      currency: 'INR',
                                      maximumFractionDigits: 0,
                                    }).format(result.price)}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          ))
                        ) : (
                          <div className="p-4 text-center text-[#F8F8F8]/60">
                            No results found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowSearch(true)}
                  className="text-[#F8F8F8]/60 hover:text-[#F8F8F8]"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Account Menu */}
            {isAdmin ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 text-[#F8F8F8]/60 hover:text-[#F8F8F8]"
                >
                  <User className="w-5 h-5" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1A1A1A] rounded-lg shadow-lg border border-white/10 py-1">
                    <Link
                      href="/upload"
                      className="flex items-center gap-2 px-4 py-2 text-[#F8F8F8]/60 hover:text-[#F8F8F8] hover:bg-white/5"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Upload className="w-4 h-4" />
                      Upload Wallpaper
                    </Link>
                    <Link
                      href="/account"
                      className="flex items-center gap-2 px-4 py-2 text-[#F8F8F8]/60 hover:text-[#F8F8F8] hover:bg-white/5"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Account Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-[#F8F8F8]/60 hover:text-[#F8F8F8] hover:bg-white/5"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 text-[#F8F8F8]/60 hover:text-[#F8F8F8]"
              >
                <LogIn className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 