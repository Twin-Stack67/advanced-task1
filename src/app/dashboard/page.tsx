"use client";

import React, { useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AddEditUserModal from "@/components/modals/AddEditUserModal";
import ApiCredentialsModal from "@/components/modals/ApiCredentialsModal";
import { useTenant } from "@/context/TenantContext";

export default function DashboardPage() {
  const { currentTenant, employees, auditEvents, showToast } = useTenant();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [apiModalOpen, setApiModalOpen] = useState(false);

  const totalEmployees = employees.length > 0 ? employees.length : 148;
  const managersCount = employees.filter((e) => e.role === "Manager").length;
  const activeCount = employees.filter((e) => e.status === "Active").length;
  const inactiveCount = employees.filter((e) => e.status === "Deactivated" || e.status === "Inactive").length;

  return (
    <DashboardLayout pageTitle="Overview">
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-[1600px] w-full mx-auto flex flex-col gap-6">
        {/* Top Context & Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-secondary text-xs">
              <span>Tenant Workspace</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-on-surface font-semibold">Overview</span>
            </div>
            <h1 className="font-headline font-bold text-2xl sm:text-3xl text-on-surface tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-sm text-on-surface-variant">
              Welcome back, Sarah (Admin at {currentTenant.name})
            </p>
          </div>

          {/* Quick Action CTA Group */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setApiModalOpen(true)}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors shadow-sm border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[17px]">key</span>
              <span>View API Credentials</span>
            </button>

            <Link
              href="/users"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors shadow-sm border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[17px]">badge</span>
              <span>View All Employees</span>
            </Link>

            <button
              onClick={() => setAddModalOpen(true)}
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold shadow-md transition-all"
            >
              <span className="material-symbols-outlined text-[17px]">person_add</span>
              <span>Add New User</span>
            </button>
          </div>
        </div>

        {/* Tenant Isolation Meta Strip */}
        <div className="w-full bg-surface-container-low rounded-2xl px-5 py-3.5 shadow-sm border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
              <span className="font-semibold text-on-surface">Tenant Workspace:</span>
              <span className="font-mono text-on-surface-variant bg-surface-container-lowest px-2 py-0.5 rounded-md border border-outline-variant/20">
                {currentTenant.name} ({currentTenant.id})
              </span>
            </div>

            <div className="hidden sm:block h-3.5 w-px bg-outline-variant"></div>

            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-tertiary">dns</span>
              <span className="font-semibold text-on-surface">Isolation Tier:</span>
              <span className="text-secondary font-medium">
                Dedicated Schema ({currentTenant.region})
              </span>
            </div>

            <div className="hidden sm:block h-3.5 w-px bg-outline-variant"></div>

            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-secondary">domain</span>
              <span className="font-semibold text-on-surface">Organizational Units:</span>
              <span className="text-secondary">4 Active Departments</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-secondary self-end sm:self-auto text-xs">
            <span className="material-symbols-outlined text-[15px] text-primary">verified_user</span>
            <span>Zero-Leakage Policy Active</span>
          </div>
        </div>

        {/* Primary Metric KPIs (4 Cards Bento) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
          {/* Card 1: Total Employees */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/30 hover:shadow-md transition-shadow flex flex-col justify-between gap-4">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] uppercase text-secondary font-semibold tracking-wider">
                  Workforce Headcount
                </span>
                <span className="text-sm font-bold text-on-surface">Total Employees</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed-variant">
                <span className="material-symbols-outlined text-[20px]">groups</span>
              </div>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="font-headline font-bold text-3xl text-on-surface tracking-tight">
                {totalEmployees}
              </span>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-surface-container-high text-primary text-[11px] font-semibold">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                <span>+12 this month</span>
              </div>
            </div>
          </div>

          {/* Card 2: Managers */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/30 hover:shadow-md transition-shadow flex flex-col justify-between gap-4">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] uppercase text-secondary font-semibold tracking-wider">
                  Leadership Tier
                </span>
                <span className="text-sm font-bold text-on-surface">Managers</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container">
                <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
              </div>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="font-headline font-bold text-3xl text-on-surface tracking-tight">
                {managersCount || 18}
              </span>
              <span className="text-xs text-secondary font-medium">Across 4 teams</span>
            </div>
          </div>

          {/* Card 3: Active Users */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/30 hover:shadow-md transition-shadow flex flex-col justify-between gap-4">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] uppercase text-secondary font-semibold tracking-wider">
                  Live Engagement
                </span>
                <span className="text-sm font-bold text-on-surface">Active Users</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
              </div>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="font-headline font-bold text-3xl text-on-surface tracking-tight">
                {activeCount || 136}
              </span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-surface-container text-on-secondary-fixed text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>91.8% online</span>
              </div>
            </div>
          </div>

          {/* Card 4: Deactivated */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/30 hover:shadow-md transition-shadow flex flex-col justify-between gap-4">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] uppercase text-secondary font-semibold tracking-wider">
                  Lifecycle Status
                </span>
                <span className="text-sm font-bold text-on-surface">Inactive Users</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-error-container flex items-center justify-center text-on-error-container">
                <span className="material-symbols-outlined text-[20px]">person_off</span>
              </div>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="font-headline font-bold text-3xl text-on-surface tracking-tight">
                {inactiveCount || 12}
              </span>
              <div className="flex items-center gap-1 text-secondary text-[11px]">
                <span className="material-symbols-outlined text-[14px]">archive</span>
                <span>Records retained</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed & Role Access Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Card: Recent Employee Activity Feed (7 cols) */}
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">history</span>
                  </div>
                  <h2 className="font-headline font-bold text-lg text-on-surface">
                    Recent Employee Activity
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-secondary bg-surface-container px-2 py-0.5 rounded-md">
                  Realtime Audit
                </span>
              </div>

              {/* Activity List */}
              <div className="flex flex-col gap-3">
                {auditEvents.slice(0, 5).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-surface-container-low transition-colors border border-transparent hover:border-outline-variant/20"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        event.category === "security"
                          ? "bg-error-container text-on-error-container"
                          : event.category === "role"
                          ? "bg-primary-fixed text-on-primary-fixed-variant"
                          : event.category === "invite"
                          ? "bg-surface-container-high text-tertiary"
                          : "bg-secondary-container text-on-secondary-fixed"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {event.category === "security"
                          ? "block"
                          : event.category === "role"
                          ? "verified"
                          : event.category === "invite"
                          ? "mail"
                          : "login"}
                      </span>
                    </div>

                    <div className="flex flex-col grow min-w-0">
                      <p className="text-xs text-on-surface font-medium leading-snug">
                        {event.title}
                      </p>
                      <span className="text-[11px] text-secondary mt-0.5">
                        {event.description}
                      </span>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-outline">
                        <span>{event.timestamp}</span>
                        <span>•</span>
                        <span className="font-mono">{event.tag}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-outline-variant/20 flex items-center justify-between text-xs">
              <span className="text-[11px] text-secondary">Showing latest 5 events</span>
              <button
                type="button"
                onClick={() => showToast("Full Audit log query downloaded")}
                className="text-primary hover:underline font-semibold flex items-center gap-1"
              >
                <span>Open System Audit Logs</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Right Card: Role & Access Breakdown (5 cols) */}
          <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">shield</span>
                  </div>
                  <h2 className="font-headline font-bold text-lg text-on-surface">
                    Role &amp; Access Breakdown
                  </h2>
                </div>
                <span className="text-xs font-mono text-secondary">
                  {totalEmployees} total seats
                </span>
              </div>

              {/* Role Meter Progress Visualization */}
              <div className="w-full bg-surface-container rounded-full h-3 flex overflow-hidden mb-4 border border-outline-variant/30">
                <div className="bg-primary-container h-full" style={{ width: "6%" }} title="Admin (3)"></div>
                <div className="bg-tertiary-container h-full" style={{ width: "16%" }} title="Manager (18)"></div>
                <div className="bg-primary-fixed-dim h-full" style={{ width: "78%" }} title="Employee (127)"></div>
              </div>

              {/* Role Tier Cards */}
              <div className="flex flex-col gap-3">
                {/* Admin */}
                <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
                      <span className="text-xs font-bold text-on-surface">Admin</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-on-surface">
                        {employees.filter((e) => e.role === "Admin").length || 3}
                      </span>
                      <span className="text-[11px] text-secondary">users</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-secondary leading-relaxed">
                    Full company management, schema migration execution, tenant API secrets, billing, and role provisioning.
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-tertiary">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">lock_clock</span>
                      MFA strictly enforced
                    </span>
                    <span className="font-mono text-secondary">2.0% of seats</span>
                  </div>
                </div>

                {/* Manager */}
                <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container"></span>
                      <span className="text-xs font-bold text-on-surface">Manager</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-on-surface">
                        {employees.filter((e) => e.role === "Manager").length || 18}
                      </span>
                      <span className="text-[11px] text-secondary">users</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-secondary leading-relaxed">
                    Team employee management, member invitations, performance logs, and departmental shift scheduling.
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-secondary">
                    <span>Direct reports managed</span>
                    <span className="font-mono">12.2% of seats</span>
                  </div>
                </div>

                {/* Employee */}
                <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary-fixed-dim"></span>
                      <span className="text-xs font-bold text-on-surface">Employee</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-on-surface">
                        {employees.filter((e) => e.role === "Employee").length || 127}
                      </span>
                      <span className="text-[11px] text-secondary">users</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-secondary leading-relaxed">
                    Self-profile updates, team collaboration directory access, personal payroll docs, and request tickets.
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-secondary">
                    <span>Standard privileges</span>
                    <span className="font-mono">85.8% of seats</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-outline-variant/20 flex items-center justify-between text-xs">
              <span className="text-[11px] text-secondary">Enforced by RBAC engine</span>
              <button
                type="button"
                onClick={() => showToast("RBAC Access Policy matrix loaded")}
                className="text-primary hover:underline font-semibold flex items-center gap-1"
              >
                <span>Configure RBAC Policy</span>
                <span className="material-symbols-outlined text-[15px]">tune</span>
              </button>
            </div>
          </div>
        </div>

        {/* Database Isolation Node Health Micro-strip */}
        <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm border border-outline-variant/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary border border-outline-variant/30">
              <span className="material-symbols-outlined text-[18px]">database</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-on-surface">
                Database Isolation Node Health
              </span>
              <span className="text-[11px] text-secondary">
                Dedicated schema <code className="font-mono text-primary font-semibold">{currentTenant.databaseCluster}</code> is healthy (Latency: 12ms)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg bg-surface-container-lowest text-on-surface font-mono text-[11px] border border-outline-variant/30 font-semibold">
              SOC-2 Type II Certified
            </span>
            <button
              onClick={() => showToast("Diagnostic ping passed: 0ms replication lag.")}
              className="text-secondary hover:text-on-surface p-1.5 rounded-lg transition-colors"
              title="Health actions"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">more_vert</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <AddEditUserModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />

      {/* API Credentials Modal */}
      <ApiCredentialsModal
        isOpen={apiModalOpen}
        onClose={() => setApiModalOpen(false)}
      />
    </DashboardLayout>
  );
}
