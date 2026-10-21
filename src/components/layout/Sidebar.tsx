'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Building2,
  LogOut,
  ShieldCheck,
  ChevronRight,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { RoleBadge } from '@/components/common/Badge';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['Admin', 'Manager', 'Employee'],
    },
    {
      label: 'Employees',
      href: '/employees',
      icon: Users,
      roles: ['Admin', 'Manager', 'Employee'],
    },
    {
      label: 'Company Settings',
      href: '/settings',
      icon: Building2,
      roles: ['Admin'],
    },
  ];

  const visibleItems = navItems.filter(
    (item) => !user || item.roles.includes(user.role)
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#FFFFFF] border-r border-[#E2E4F2] flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="h-16 flex items-center justify-between px-6 border-b border-[#E2E4F2]">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 font-bold text-lg text-[#122056] tracking-tight group"
              onClick={onClose}
            >
              <div className="w-8 h-8 rounded-lg bg-[#122056] text-[#FFFFFF] flex items-center justify-center font-extrabold text-sm shadow-sm group-hover:bg-[#5B65DC] transition-colors">
                TP
              </div>
              <span className="flex items-center gap-1">
                Tenant<span className="text-[#5B65DC]">Pulse</span>
              </span>
            </Link>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-[#505B85] hover:bg-[#EEEFFD] lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Role Card inside sidebar */}
          {user && (
            <div className="mx-4 my-4 p-3 rounded-xl bg-[#FAFAFD] border border-[#E2E4F2]">
              <div className="flex items-center gap-2 text-xs text-[#505B85] font-medium mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#5B65DC]" />
                <span>Tenant Partition</span>
              </div>
              <p className="text-xs font-mono text-[#828BAA] truncate">
                ID: {user.companyId}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#122056] truncate max-w-[120px]">
                  {user.name}
                </span>
                <RoleBadge role={user.role} />
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#EEEFFD] text-[#5B65DC] font-semibold shadow-xs'
                      : 'text-[#505B85] hover:bg-[#FAFAFD] hover:text-[#122056]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-[#5B65DC]' : 'text-[#828BAA]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-[#5B65DC]" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-[#E2E4F2]">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
