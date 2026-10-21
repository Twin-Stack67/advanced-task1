'use client';

import React from 'react';
import { Menu, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { RoleBadge } from '@/components/common/Badge';

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#FFFFFF] border-b border-[#E2E4F2] px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-[#505B85] hover:bg-[#EEEFFD] lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider text-[#828BAA]">
          Multi-Tenant Administration
        </span>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#EEEFFD] text-[#5B65DC] flex items-center justify-center font-bold text-xs border border-[#C5CAFA]">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-xs font-semibold text-[#122056] leading-none">
                {user.name}
              </p>
              <p className="text-[11px] text-[#828BAA] mt-1 leading-none truncate max-w-[150px]">
                {user.email}
              </p>
            </div>
            <RoleBadge role={user.role} />
          </div>

          <div className="h-6 w-px bg-[#E2E4F2] hidden sm:block" />

          <button
            onClick={logout}
            title="Sign Out"
            className="p-2 rounded-lg text-[#828BAA] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
}
