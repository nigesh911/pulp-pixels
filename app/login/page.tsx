'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { LogIn } from 'lucide-react';

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();
  const returnTo = searchParams.get('returnTo') || '/account';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(`Auth error: ${error.message}`);
        return;
      }

      if (!data?.user) {
        setError('No user data received');
        return;
      }

      // Check if user is admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        setError(`Profile error: ${profileError.message}`);
        return;
      }

      if (!profile?.is_admin) {
        await supabase.auth.signOut();
        setError('Access denied: Not an admin user');
        return;
      }

      router.push(returnTo);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        setError(`Error: ${error.message}`);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A]">
      <div className="max-w-md w-full space-y-8 p-8 bg-white/5 rounded-xl backdrop-blur-sm">
        <div>
          <h2 className="text-center text-3xl font-bold text-[#F8F8F8]">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-white/10 bg-white/5 text-[#F8F8F8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4169E1]/50 focus:border-transparent"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-white/10 bg-white/5 text-[#F8F8F8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4169E1]/50 focus:border-transparent"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-[#F8F8F8] bg-[#4169E1] hover:bg-[#4169E1]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4169E1]/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LogIn className="h-5 w-5 text-[#F8F8F8] group-hover:text-[#F8F8F8]/90" aria-hidden="true" />
              </span>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          {error && (
            <p className="text-sm p-3 rounded-lg bg-red-500/10 text-red-500">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
} 