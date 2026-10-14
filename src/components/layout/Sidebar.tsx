"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTenant } from "@/context/TenantContext";

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { currentTenant, sidebarCollapsed, setSidebarCollapsed } = useTenant();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: "grid_view" },
    { name: "Users", href: "/users", icon: "group" },
    { name: "Settings", href: "/settings", icon: "tune" },
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full bg-surface-container-lowest border-r border-outline-variant/30 select-none">
      {/* Top Part */}
      <div className="flex flex-col">
        {/* Brand Logo & Title */}
        <div className={`p-4 md:p-5 flex items-center overflow-hidden ${sidebarCollapsed ? "justify-center" : "gap-3"}`}>
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-surface-container-low shadow-sm shrink-0">
            <Image
              src="/images/logo.png"
              alt="TenantPulse Logo"
              width={26}
              height={26}
              className="object-contain"
            />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-fixed-dim opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col min-w-0 overflow-hidden">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-headline font-bold text-base text-on-surface tracking-tight truncate">
                  TenantPulse
                </span>
                <span className="text-[10px] font-mono bg-secondary-container text-on-secondary-container px-1 py-0.5 rounded font-semibold shrink-0">
                  v3.8
                </span>
              </div>
              <span className="text-[11px] text-secondary">Enterprise Gateway</span>
            </div>
          )}
        </div>

        {/* Tenant Organization Badge */}
        {!sidebarCollapsed && (
          <div className="mx-4 mb-4 p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div className="flex flex-col min-w-0 pr-2">
                <span className="text-xs font-semibold text-on-surface truncate">
                  {currentTenant.name}
                </span>
                <span className="text-[11px] font-mono text-on-surface-variant truncate">
                  {currentTenant.id}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-secondary-container text-on-secondary-fixed text-[10px] font-bold shrink-0">
                Active
              </span>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="px-3 flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                  sidebarCollapsed ? "justify-center" : ""
                } ${
                  isActive
                    ? "bg-primary-container text-on-primary font-semibold shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
                title={item.name}
              >
                <span className="material-symbols-outlined text-[20px] shrink-0">
                  {item.icon}
                </span>
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Part: Tenant Isolation Card & Collapse Toggle */}
      <div className="p-3">
        {!sidebarCollapsed && (
          <div className="p-3 mb-2 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-tertiary">
              <span className="material-symbols-outlined text-[15px]">lock</span>
              <span className="text-[11px] font-bold uppercase tracking-wider">Tenant Isolation</span>
            </div>
            <span className="text-[11px] text-on-surface-variant font-mono">
              Dedicated DB • {currentTenant.region}
            </span>
          </div>
        )}

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={`hidden lg:flex w-full items-center ${
            sidebarCollapsed ? "justify-center" : "justify-between"
          } px-3 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors text-xs font-medium`}
          type="button"
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {!sidebarCollapsed && <span>Collapse Sidebar</span>}
          <span className="material-symbols-outlined text-[18px]">
            {sidebarCollapsed ? "last_page" : "first_page"}
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside
        className={`hidden lg:block fixed left-0 top-0 h-full z-40 transition-all duration-300 overflow-hidden ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="lg:hidden fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Mobile Drawer Panel */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
}
