'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFD]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-[#EEEFFD] border-t-[#5B65DC] rounded-full animate-spin" />
        <p className="text-sm font-medium text-[#505B85]">Connecting to TenantPulse...</p>
      </div>
    </div>
  );
}
