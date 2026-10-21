'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/lib/api';
import { AlertBanner } from '@/components/common/Toast';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isAuthLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authApi.login({
        email: email.trim(),
        password,
      });

      if (response.data?.token && response.data?.user) {
        login(response.data.token, response.data.user);
        router.push('/dashboard');
      } else {
        throw new Error('Authentication succeeded but session data was incomplete.');
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFD] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand logo */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#122056] text-[#FFFFFF] font-extrabold text-xl shadow-md mb-4">
          TP
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-[#122056]">
          Sign in to TenantPulse
        </h2>
        <p className="mt-2 text-sm text-[#505B85]">
          Enter your enterprise credentials to access your tenant partition
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-[#FFFFFF] py-8 px-6 sm:px-10 rounded-2xl border border-[#E2E4F2] shadow-sm">
          {error && (
            <div className="mb-5">
              <AlertBanner type="error" message={error} onClose={() => setError(null)} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-[#122056] mb-1.5"
              >
                Work Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2E4F2] bg-[#FFFFFF] text-[#122056] text-sm focus:outline-none focus:border-[#5B65DC] focus:ring-2 focus:ring-[#5B65DC]/20 transition-all placeholder:text-[#828BAA]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-[#122056] mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-lg border border-[#E2E4F2] bg-[#FFFFFF] text-[#122056] text-sm focus:outline-none focus:border-[#5B65DC] focus:ring-2 focus:ring-[#5B65DC]/20 transition-all placeholder:text-[#828BAA]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#828BAA] hover:text-[#122056] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#5B65DC] hover:bg-[#4852c9] text-[#FFFFFF] text-sm font-semibold shadow-xs disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Registration link */}
          <div className="mt-6 pt-6 border-t border-[#E2E4F2] text-center">
            <p className="text-xs text-[#505B85]">
              New organization?{' '}
              <Link
                href="/register"
                className="font-semibold text-[#5B65DC] hover:underline"
              >
                Register a new company workspace
              </Link>
            </p>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#828BAA]">
          <ShieldCheck className="w-4 h-4 text-[#5B65DC]" />
          <span>Strict Schema Multi-Tenant Isolation Enforced</span>
        </div>
      </div>
    </div>
  );
}
