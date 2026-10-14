"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AddEditUserModal from "@/components/modals/AddEditUserModal";
import SoftDeleteModal from "@/components/modals/SoftDeleteModal";
import { useTenant } from "@/context/TenantContext";

interface UserDetailContentProps {
  userId: string;
}

export default function UserDetailContent({ userId }: UserDetailContentProps) {
  const router = useRouter();
  const { currentTenant, employees, reactivateUser, showToast } = useTenant();

  const idParam = (userId || "").toUpperCase();

  // Find employee or fallback to Elena Rostova (EMP-1049) or first employee
  const employee =
    employees.find((e) => e.id.toUpperCase() === idParam || e.id.toLowerCase() === idParam.toLowerCase()) ||
    employees.find((e) => e.id === "EMP-1049") ||
    employees[0];

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [softDeleteModalOpen, setSoftDeleteModalOpen] = useState(false);

  const isDeactivated = employee?.status === "Deactivated";

  const handleToggleReactivate = () => {
    if (employee) {
      if (isDeactivated) {
        reactivateUser(employee.id);
      } else {
        setSoftDeleteModalOpen(true);
      }
    }
  };

  return (
    <DashboardLayout pageTitle={employee?.name || "User Details"}>
      <div className="flex flex-col w-full">
        {/* Top Context Subheader */}
        <div className="px-4 sm:px-6 lg:px-8 py-3.5 bg-surface-container-low border-b border-outline-variant/20 flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-3 max-w-[1500px] w-full mx-auto">
            <div className="flex items-center gap-2 text-xs">
              <Link
                href="/users"
                className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 font-semibold"
              >
                <span className="material-symbols-outlined text-[17px]">group</span>
                <span>Users</span>
              </Link>
              <span className="material-symbols-outlined text-[15px] text-outline">
                chevron_right
              </span>
              <span className="font-semibold text-on-surface">{employee?.name}</span>
              <span className="font-mono text-[11px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded border border-outline-variant/30">
                {employee?.id}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold shadow-sm ${
                  isDeactivated
                    ? "bg-error-container text-on-error-container"
                    : "bg-secondary-container text-on-secondary-container"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isDeactivated ? "bg-error" : "bg-emerald-500"
                  }`}
                ></span>
                {isDeactivated ? "Deactivated (Soft-Deleted)" : "Active Tenant Seat"}
              </span>

              <button
                type="button"
                onClick={handleToggleReactivate}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container shadow-sm text-xs font-semibold border border-outline-variant/30 transition-all"
              >
                <span
                  className={`material-symbols-outlined text-[17px] ${
                    isDeactivated ? "text-primary" : "text-error"
                  }`}
                >
                  {isDeactivated ? "settings_backup_restore" : "person_off"}
                </span>
                <span>
                  {isDeactivated ? "Restore Account" : "Deactivate (Soft-Delete)"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-[1500px] w-full mx-auto flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Profile Card */}
              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {employee?.avatarUrl ? (
                        <div className="w-20 h-20 rounded-full overflow-hidden shadow-sm bg-surface-container border-2 border-outline-variant/30">
                          <Image
                            src={employee.avatarUrl}
                            alt={employee.name}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ) : (
                        <div
                          className={`w-20 h-20 rounded-full ${
                            employee?.avatarBg || "bg-surface-container-high"
                          } ${
                            employee?.avatarText || "text-on-surface"
                          } flex items-center justify-center font-bold text-2xl border-2 border-outline-variant/30`}
                        >
                          {employee?.initials}
                        </div>
                      )}

                      <span
                        className={`absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-sm border-2 border-surface-container-lowest ${
                          isDeactivated
                            ? "bg-error text-on-error"
                            : "bg-emerald-500 text-white"
                        }`}
                        title={isDeactivated ? "Suspended" : "Active"}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {isDeactivated ? "block" : "check"}
                        </span>
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="font-headline font-bold text-2xl text-on-surface">
                          {employee?.name}
                        </h1>
                        <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-medium border border-outline-variant/20">
                          Tenant: {currentTenant.name}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {employee?.title} • {employee?.department}
                      </p>

                      <div className="flex items-center gap-3 mt-2 text-xs text-secondary font-mono">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">mail</span>
                          {employee?.email}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">badge</span>
                          {employee?.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setEditModalOpen(true)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold border border-outline-variant/30 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                      <span>Edit Metadata</span>
                    </button>
                  </div>
                </div>

                {/* 3 Metric Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="bg-surface-container-low rounded-xl p-3.5 flex flex-col gap-1 border border-outline-variant/20">
                    <span className="text-[10px] uppercase text-secondary font-bold tracking-wider">
                      DEPARTMENT
                    </span>
                    <span className="font-bold text-xs text-on-surface flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[18px]">domain</span>
                      {employee?.department}
                    </span>
                    <span className="text-[11px] text-secondary">Pod: Alpha Releases</span>
                  </div>

                  <div className="bg-surface-container-low rounded-xl p-3.5 flex flex-col gap-1 border border-outline-variant/20">
                    <span className="text-[10px] uppercase text-secondary font-bold tracking-wider">
                      ROLE / ACCESS LEVEL
                    </span>
                    <span className="font-bold text-xs text-on-surface flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-tertiary text-[18px]">
                        shield_person
                      </span>
                      {employee?.role} Privileges
                    </span>
                    <span className="text-[11px] text-secondary">Read-write scope</span>
                  </div>

                  <div className="bg-surface-container-low rounded-xl p-3.5 flex flex-col gap-1 border border-outline-variant/20">
                    <span className="text-[10px] uppercase text-secondary font-bold tracking-wider">
                      TENANT PARTITION
                    </span>
                    <span className="font-bold text-xs text-on-surface flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary-container text-[18px]">
                        database
                      </span>
                      {currentTenant.databaseCluster}
                    </span>
                    <span className="text-[11px] text-secondary">Sharding cluster #04</span>
                  </div>
                </div>

                {/* Permissions & Entitlements Summary */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h2 className="font-headline font-bold text-sm text-on-surface flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[18px]">
                        verified_user
                      </span>
                      Permissions &amp; Entitlements Summary
                    </h2>
                    <span className="text-[11px] text-secondary">
                      Current state: {isDeactivated ? "Inactive (Token Revoked)" : "Active"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-surface-container-low flex items-start gap-2.5 border border-outline-variant/20">
                      <span className="material-symbols-outlined text-emerald-600 text-[18px] mt-0.5 shrink-0">
                        check_circle
                      </span>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-on-surface">
                          Test Suites &amp; TestRail Sync
                        </span>
                        <span className="text-[11px] text-secondary">
                          Can run automated regress runs &amp; submit bug tickets
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-container-low flex items-start gap-2.5 border border-outline-variant/20">
                      <span className="material-symbols-outlined text-emerald-600 text-[18px] mt-0.5 shrink-0">
                        check_circle
                      </span>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-on-surface">
                          Internal Repository Read Access
                        </span>
                        <span className="text-[11px] text-secondary">
                          GitHub Acme Org / quality-assurance repos
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-container-low flex items-start gap-2.5 border border-outline-variant/20">
                      <span className="material-symbols-outlined text-outline text-[18px] mt-0.5 shrink-0">
                        cancel
                      </span>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-secondary line-through">
                          Production DB Migration Tools
                        </span>
                        <span className="text-[11px] text-secondary">
                          Requires elevated privileged role (Denied)
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-container-low flex items-start gap-2.5 border border-outline-variant/20">
                      <span className="material-symbols-outlined text-outline text-[18px] mt-0.5 shrink-0">
                        cancel
                      </span>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-secondary line-through">
                          Billing &amp; Org Settings Admin
                        </span>
                        <span className="text-[11px] text-secondary">
                          Restricted to Org Owners (Denied)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Audit Trail & Lifecycle Events */}
              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                  <h2 className="font-headline font-bold text-sm text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-tertiary text-[19px]">
                      history_edu
                    </span>
                    Audit Trail &amp; Lifecycle Events
                  </h2>
                  <button
                    type="button"
                    onClick={() => showToast("Full JSON audit stream fetched")}
                    className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>View full raw logs</span>
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </button>
                </div>

                <div className="relative pl-6 flex flex-col gap-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-container-high">
                  {/* Event 1: Soft Delete (if deactivated) */}
                  {isDeactivated && (
                    <div className="relative flex items-start gap-3">
                      <span className="absolute -left-[27px] mt-1.5 w-3.5 h-3.5 rounded-full bg-error border-2 border-surface-container-lowest shadow-sm"></span>
                      <div className="flex flex-col w-full bg-error-container/25 rounded-xl p-3.5 border border-error/20">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <span className="text-xs font-bold text-on-error-container">
                            Deactivated by {employee?.deactivatedBy || "Sarah Jenkins (Admin)"}
                          </span>
                          <span className="text-[11px] text-secondary">
                            {employee?.deactivatedAt || "Nov 02, 2024 at 14:38:12 UTC"}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface mt-1">
                          Initiated Soft-Delete protocol. Session tokens invalidated across 4 active clients. Stored tokens preserved under compliance retention policy.
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-secondary font-mono">
                          <span>Reason: {employee?.deactivationReason || "Employee left company"}</span>
                          <span>•</span>
                          <span>IP: 192.168.4.112</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Event 2 */}
                  <div className="relative flex items-start gap-3">
                    <span className="absolute -left-[27px] mt-1.5 w-3.5 h-3.5 rounded-full bg-surface-tint border-2 border-surface-container-lowest shadow-sm"></span>
                    <div className="flex flex-col w-full bg-surface-container-low rounded-xl p-3.5 border border-outline-variant/20">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="text-xs font-bold text-on-surface">Last Authentication Session</span>
                        <span className="text-[11px] text-secondary">Oct 12, 2024 at 09:12:04 UTC</span>
                      </div>
                      <p className="text-xs text-secondary mt-1">
                        Successful SAML SSO login via Okta Identity Provider (Client ID: <code className="font-mono text-primary font-semibold">okta_acme_saml2</code>).
                      </p>
                    </div>
                  </div>

                  {/* Event 3 */}
                  <div className="relative flex items-start gap-3">
                    <span className="absolute -left-[27px] mt-1.5 w-3.5 h-3.5 rounded-full bg-secondary border-2 border-surface-container-lowest shadow-sm"></span>
                    <div className="flex flex-col w-full bg-surface-container-low rounded-xl p-3.5 border border-outline-variant/20">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="text-xs font-bold text-on-surface">Account Provisioned</span>
                        <span className="text-[11px] text-secondary">Jan 14, 2024 at 10:00:00 UTC</span>
                      </div>
                      <p className="text-xs text-secondary mt-1">
                        Created by System Provisioner via SCIM sync during HR onboarding batch <code className="font-mono text-primary font-semibold">#SCIM-2024-01</code>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Deactivation Status Card */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/30 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-error">
                  <span className="material-symbols-outlined text-[22px]">warning</span>
                  <span className="font-headline font-bold text-base text-on-surface">
                    Deactivation Status
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-error-container/20 flex flex-col gap-1 border border-error/20">
                  <span className="text-xs font-bold text-on-error-container flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">lock_clock</span>
                    Soft Delete Policy in Effect
                  </span>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Deactivating an employee revokes immediate access to tenant resources and hides them from active listings. Their records, audit history, and past activity remain securely stored for compliance and can be restored at any time.
                  </p>
                </div>

                <div className="flex flex-col gap-1 text-xs text-secondary">
                  <div className="flex items-center justify-between py-1 border-b border-outline-variant/15">
                    <span>Account Status:</span>
                    <span className={`font-bold ${isDeactivated ? "text-error" : "text-emerald-600"}`}>
                      {isDeactivated ? "Suspended" : "Active"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-outline-variant/15">
                    <span>Data Retention State:</span>
                    <span className="font-semibold text-on-surface">Compliance Vault (365d)</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span>Active Auth Tokens:</span>
                    <span className="font-semibold text-on-surface">
                      {isDeactivated ? "0 revoked" : "4 active sessions"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleToggleReactivate}
                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all ${
                      isDeactivated
                        ? "bg-primary text-on-primary hover:bg-primary-container"
                        : "bg-error text-on-error hover:bg-on-error-container"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isDeactivated ? "restore_from_trash" : "person_off"}
                    </span>
                    <span>
                      {isDeactivated ? "Restore / Reactivate Account" : "Deactivate (Soft-Delete)"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => showToast(`Audit trail downloaded for ${employee?.id}`)}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold border border-outline-variant/30 transition-all"
                  >
                    <span className="material-symbols-outlined text-[17px] text-secondary">
                      assignment
                    </span>
                    <span>Audit History Log</span>
                  </button>
                </div>
              </div>

              {/* SOC-2 Compliance Notes */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/30 flex flex-col gap-3">
                <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                  SOC-2 Compliance Notes
                </span>
                <p className="text-xs text-secondary leading-relaxed">
                  Under {currentTenant.name} data retention policy <strong>DRP-98</strong>, soft-deleted employee records are retained for minimum 7 years. No automated destructive purges are scheduled for this record.
                </p>
                <div className="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between text-xs border border-outline-variant/20">
                  <span className="text-[11px] text-secondary">Cryptographic Signature</span>
                  <span className="font-mono text-[11px] text-primary font-semibold">
                    SHA256: 9b2d...471c
                  </span>
                </div>
              </div>

              {/* Data Center Image Card */}
              <div className="rounded-2xl overflow-hidden shadow-sm relative group border border-outline-variant/30 h-40">
                <div className="relative w-full h-full">
                  <Image
                    src="/images/server-datacenter.jpg"
                    alt="Tenant Vault Data Center"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/90 via-inverse-surface/40 to-transparent flex flex-col justify-end p-3.5">
                    <div className="bg-inverse-surface/80 backdrop-blur-md rounded-xl p-2 px-3 flex items-center justify-between text-inverse-on-surface border border-white/10">
                      <span className="text-[11px] font-semibold">
                        Tenant Vault: {currentTenant.region} Isolated DB
                      </span>
                      <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim">
                        lock
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      <AddEditUserModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        initialEmployee={employee}
      />

      {/* Soft Delete Confirmation Modal */}
      <SoftDeleteModal
        isOpen={softDeleteModalOpen}
        onClose={() => setSoftDeleteModalOpen(false)}
        employee={employee}
      />
    </DashboardLayout>
  );
}
