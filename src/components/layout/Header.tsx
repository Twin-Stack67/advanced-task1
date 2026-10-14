"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTenant } from "@/context/TenantContext";

interface HeaderProps {
  pageTitle?: string;
  onOpenMobileMenu?: () => void;
}

export default function Header({ pageTitle = "Overview", onOpenMobileMenu }: HeaderProps) {
  const router = useRouter();
  const { currentTenant, availableTenants, switchTenant, showToast } = useTenant();
  const [tenantDropdownOpen, setTenantDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLogout = () => {
    showToast("Signed out of tenant workspace");
    router.push("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-surface/85 backdrop-blur-xl border-b border-outline-variant/30 z-30 flex items-center justify-between px-4 lg:px-6">
      {/* Left items: Mobile menu trigger, Breadcrumbs, Tenant Switcher */}
      <div className="flex items-center gap-3 md:gap-4">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            aria-label="Open navigation menu"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>
        )}

        <div className="hidden sm:flex items-center gap-1.5 text-xs md:text-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px]">corporate_fare</span>
          <span className="font-medium text-on-surface">{currentTenant.name}</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-secondary">{pageTitle}</span>
        </div>

        <div className="hidden sm:block h-4 w-[1px] bg-outline-variant"></div>

        {/* Tenant Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setTenantDropdownOpen(!tenantDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high hover:text-on-surface text-on-surface text-xs font-semibold transition-colors border border-outline-variant/40"
            type="button"
          >
            <span className="material-symbols-outlined text-[15px] text-primary">sync_alt</span>
            <span className="truncate max-w-[120px] md:max-w-none">{currentTenant.name}</span>
            <span className="material-symbols-outlined text-[14px]">
              {tenantDropdownOpen ? "expand_less" : "expand_more"}
            </span>
          </button>

          {tenantDropdownOpen && (
            <div className="absolute left-0 mt-2 w-64 rounded-xl bg-surface-container-lowest shadow-xl border border-outline-variant/40 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-secondary uppercase tracking-wider">
                Switch Organization Workspace
              </div>
              {availableTenants.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    switchTenant(t.id);
                    setTenantDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-surface-container transition-colors ${
                    t.id === currentTenant.id ? "bg-primary-fixed/30 font-semibold text-primary" : "text-on-surface"
                  }`}
                >
                  <div className="flex flex-col">
                    <span>{t.name}</span>
                    <span className="text-[10px] text-secondary font-mono">{t.region}</span>
                  </div>
                  {t.id === currentTenant.id && (
                    <span className="material-symbols-outlined text-primary text-[16px]">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right items: Search, Notifications, Profile, Logout */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px] pointer-events-none">
            search
          </span>
          <input
            className="pl-9 pr-3 py-1.5 w-48 lg:w-64 rounded-xl bg-surface-container-lowest text-on-surface text-xs shadow-sm border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-outline"
            placeholder="Search users, roles, audit..."
            type="text"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-label="Notifications"
            className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors relative"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-surface-container-lowest shadow-2xl border border-outline-variant/40 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20 mb-2">
                <span className="text-xs font-semibold text-on-surface">Tenant Notifications</span>
                <span className="text-[10px] text-primary font-medium cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                <div className="p-2 rounded-lg bg-surface-container-low text-xs flex flex-col gap-1">
                  <span className="font-semibold text-on-surface">Security Alert: SCIM Sync</span>
                  <span className="text-[11px] text-secondary">4 users successfully mapped from Okta directory.</span>
                  <span className="text-[10px] text-outline">10 mins ago</span>
                </div>
                <div className="p-2 rounded-lg bg-surface-container-low text-xs flex flex-col gap-1">
                  <span className="font-semibold text-on-surface">MFA Policy Active</span>
                  <span className="text-[11px] text-secondary">All Tenant Admins now require FIDO2/WebAuthn.</span>
                  <span className="text-[10px] text-outline">1 hour ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-[1px] bg-outline-variant"></div>

        {/* Profile */}
        <div className="flex items-center gap-2 pl-1">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-primary-container shrink-0 border border-outline-variant/50">
            <Image
              src="/images/sarah-header.png"
              alt="Sarah Jenkins"
              width={32}
              height={32}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-on-surface">Sarah Jenkins</span>
              <span className="px-1.5 py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold">
                Admin
              </span>
            </div>
            <span className="text-[11px] text-on-surface-variant font-mono">sarah.j@acme.corp</span>
          </div>

          <button
            onClick={handleLogout}
            aria-label="Logout"
            title="Sign out of tenant"
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-error transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[19px]">logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
