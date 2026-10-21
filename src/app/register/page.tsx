'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, ArrowRight, Building, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/lib/api';
import { AlertBanner } from '@/components/common/Toast';

export default function RegisterPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [companyName, setCompanyName] = useState('');
  const [name, setName] = useState('');
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

    if (!companyName.trim()) {
      setError('Please provide a company name.');
      return;
    }
    if (!name.trim()) {
      setError('Please provide the administrator full name.');
      return;
    }
    if (!email.trim()) {
      setError('Please provide a valid work email.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authApi.register({
        companyName: companyName.trim(),
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (response.data?.token && response.data?.user) {
        login(response.data.token, response.data.user);
        router.push('/dashboard');
      } else {
        throw new Error('Registration completed but session initialization failed.');
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || 'Registration failed. Please check your information and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFD] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#122056] text-[#FFFFFF] font-extrabold text-xl shadow-md mb-4">
          TP
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-[#122056]">
          Register Organization
        </h2>
        <p className="mt-2 text-sm text-[#505B85]">
          Initialize your isolated multi-tenant company partition & primary administrator
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
                htmlFor="companyName"
                className="block text-xs font-semibold uppercase tracking-wider text-[#122056] mb-1.5"
              >
                Company / Organization Name <span className="text-[#DC2626]">*</span>
              </label>
              <div className="relative">
                <input
                  id="companyName"
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Corporation"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-[#E2E4F2] bg-[#FFFFFF] text-[#122056] text-sm focus:outline-none focus:border-[#5B65DC] focus:ring-2 focus:ring-[#5B65DC]/20 transition-all placeholder:text-[#828BAA]"
                />
                <Building className="w-4 h-4 text-[#828BAA] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold uppercase tracking-wider text-[#122056] mb-1.5"
              >
                Admin Full Name <span className="text-[#DC2626]">*</span>
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2E4F2] bg-[#FFFFFF] text-[#122056] text-sm focus:outline-none focus:border-[#5B65DC] focus:ring-2 focus:ring-[#5B65DC]/20 transition-all placeholder:text-[#828BAA]"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-[#122056] mb-1.5"
              >
                Admin Work Email <span className="text-[#DC2626]">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@acmecorp.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2E4F2] bg-[#FFFFFF] text-[#122056] text-sm focus:outline-none focus:border-[#5B65DC] focus:ring-2 focus:ring-[#5B65DC]/20 transition-all placeholder:text-[#828BAA]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-[#122056] mb-1.5"
              >
                Password (Min. 6 Characters) <span className="text-[#DC2626]">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
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
              className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#5B65DC] hover:bg-[#4852c9] text-[#FFFFFF] text-sm font-semibold shadow-xs disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Provisioning Workspace...</span>
                </>
              ) : (
                <>
                  <span>Create Workspace & Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#E2E4F2] text-center">
            <p className="text-xs text-[#505B85]">
              Already have an enterprise account?{' '}
              <Link href="/login" className="font-semibold text-[#5B65DC] hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#828BAA]">
          <ShieldCheck className="w-4 h-4 text-[#5B65DC]" />
          <span>Automatic Admin Role Assignment & Tenant Key Provisioning</span>
        </div>
      </div>
    </div>
  );
}
