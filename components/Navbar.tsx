'use client';

import { useState, useEffect, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, ChevronDown, Home, UserCircle } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Initial session check
    checkUser();

    // Set up session listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (session?.user) {
        setUser(session.user);
        checkAdminStatus(session.user.id);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function checkUser() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await checkAdminStatus(session.user.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    }
  }

  async function checkAdminStatus(userId: string) {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      setIsAdmin(profile?.is_admin || false);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  }

  async function handleSignOut() {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAdmin(false);
      setIsDropdownOpen(false);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1A1A1A] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Back Button and Logo */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 text-[#F8F8F8]/60 hover:text-[#F8F8F8] transition-colors"
              aria-label="Back to Home"
            >
              <Home className="w-5 h-5" />
            </Link>
            <Link href="/" className="text-xl font-bold text-[#F8F8F8]">
              Pulp Pixels
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/about" className="text-[#F8F8F8]/60 hover:text-[#F8F8F8] transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-[#F8F8F8]/60 hover:text-[#F8F8F8] transition-colors">
              Contact
            </Link>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 text-[#F8F8F8]/60 hover:text-[#F8F8F8] transition-colors"
                >
                  {isAdmin && <UserCircle className="w-5 h-5" />}
                  {user.email}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1A1A1A] border border-white/10 rounded-lg shadow-lg py-1">
                    {isAdmin && (
                      <>
                        <Link
                          href="/upload"
                          className="block px-4 py-2 text-[#F8F8F8]/60 hover:text-[#F8F8F8] hover:bg-white/5 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Upload Wallpaper
                        </Link>
                        <Link
                          href="/account"
                          className="block px-4 py-2 text-[#F8F8F8]/60 hover:text-[#F8F8F8] hover:bg-white/5 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Manage Wallpapers
                        </Link>
                      </>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-[#F8F8F8]/60 hover:text-[#F8F8F8] hover:bg-white/5 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="text-[#F8F8F8]/60 hover:text-[#F8F8F8] transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={buttonRef}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-[#F8F8F8]/60 hover:text-[#F8F8F8] transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div ref={menuRef} className="md:hidden bg-[#1A1A1A] border-t border-white/10">
          <div className="px-4 py-2 space-y-1">
            <Link
              href="/about"
              className="block py-2 text-[#F8F8F8]/60 hover:text-[#F8F8F8] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block py-2 text-[#F8F8F8]/60 hover:text-[#F8F8F8] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            {user ? (
              <>
                {isAdmin && (
                  <>
                    <Link
                      href="/upload"
                      className="block py-2 text-[#F8F8F8]/60 hover:text-[#F8F8F8] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Upload Wallpaper
                    </Link>
                    <Link
                      href="/account"
                      className="block py-2 text-[#F8F8F8]/60 hover:text-[#F8F8F8] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Manage Wallpapers
                    </Link>
                  </>
                )}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleSignOut();
                  }}
                  className="block w-full text-left py-2 text-[#F8F8F8]/60 hover:text-[#F8F8F8] transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block py-2 text-[#F8F8F8]/60 hover:text-[#F8F8F8] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 