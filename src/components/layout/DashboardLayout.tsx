"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useTenant } from "@/context/TenantContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export default function DashboardLayout({
  children,
  pageTitle = "Overview",
}: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { sidebarCollapsed } = useTenant();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />
      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        <Header
          pageTitle={pageTitle}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />
        <main className="relative pt-16 w-full min-h-screen pb-12">
          {children}
        </main>
      </div>
    </div>
  );
}
