"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useTenant } from "@/context/TenantContext";

export default function SettingsPage() {
  const { currentTenant, showToast } = useTenant();

  const [activeTab, setActiveTab] = useState<"general" | "security" | "sso" | "audit">("general");
  const [workspaceName, setWorkspaceName] = useState(currentTenant.name);
  const [sessionTimeout, setSessionTimeout] = useState("60");
  const [mfaEnforced, setMfaEnforced] = useState(true);
  const [softDeleteRetentionYears, setSoftDeleteRetentionYears] = useState("7");
  const [idpEntityId, setIdpEntityId] = useState(`https://${currentTenant.slug}.okta.com/app/saml2`);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Tenant settings saved successfully.");
  };

  return (
    <DashboardLayout pageTitle="Settings">
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-[1400px] w-full mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-secondary">
            <span>Workspace</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface font-semibold">Tenant Configuration</span>
          </div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-on-surface tracking-tight">
            Tenant Settings &amp; Governance
          </h1>
          <p className="text-sm text-on-surface-variant">
            Manage organization encryption scopes, SAML SSO integration, and compliance policies for {currentTenant.name}.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === "general"
                ? "bg-primary-container text-on-primary shadow-sm"
                : "text-secondary hover:text-on-surface hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">domain</span>
            <span>General &amp; Partition</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("sso")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === "sso"
                ? "bg-primary-container text-on-primary shadow-sm"
                : "text-secondary hover:text-on-surface hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">passkey</span>
            <span>SSO &amp; Authentication</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === "security"
                ? "bg-primary-container text-on-primary shadow-sm"
                : "text-secondary hover:text-on-surface hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">shield</span>
            <span>Security &amp; RLS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("audit")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === "audit"
                ? "bg-primary-container text-on-primary shadow-sm"
                : "text-secondary hover:text-on-surface hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">history</span>
            <span>Compliance &amp; Retention</span>
          </button>
        </div>

        {/* Settings Panels */}
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          {activeTab === "general" && (
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-5">
              <h2 className="font-headline font-bold text-lg text-on-surface">Workspace Properties</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface">Organization Name</label>
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="px-3.5 py-2 rounded-xl bg-surface-container-low text-on-surface text-sm border border-outline-variant/30 focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface">Dedicated Subdomain</label>
                  <div className="flex items-center rounded-xl bg-surface-container-low border border-outline-variant/30 overflow-hidden px-3.5 py-2">
                    <span className="font-mono text-xs text-on-surface">{currentTenant.slug}</span>
                    <span className="text-xs text-secondary font-mono">.tenantpulse.io</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface">Partition Cluster</label>
                  <input
                    type="text"
                    disabled
                    value={currentTenant.databaseCluster}
                    className="px-3.5 py-2 rounded-xl bg-surface-container text-secondary font-mono text-xs border border-outline-variant/20 cursor-not-allowed"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface">Cloud Region</label>
                  <input
                    type="text"
                    disabled
                    value={currentTenant.region}
                    className="px-3.5 py-2 rounded-xl bg-surface-container text-secondary font-mono text-xs border border-outline-variant/20 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "sso" && (
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-5">
              <h2 className="font-headline font-bold text-lg text-on-surface">SAML 2.0 Single Sign-On</h2>
              <p className="text-xs text-secondary">
                Connect your corporate identity provider (Okta, Azure Entra ID, Google Workspace) to enforce unified tenant logins.
              </p>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface">Identity Provider Entity ID</label>
                  <input
                    type="text"
                    value={idpEntityId}
                    onChange={(e) => setIdpEntityId(e.target.value)}
                    className="px-3.5 py-2 rounded-xl bg-surface-container-low text-on-surface text-sm border border-outline-variant/30 focus:outline-none focus:border-primary font-mono text-xs"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-surface-container-low flex items-start gap-3 border border-outline-variant/20">
                  <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">verified</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface">SCIM 2.0 User Sync Enforced</span>
                    <span className="text-[11px] text-secondary">
                      Deactivating an employee in Okta automatically soft-deletes the record in TenantPulse.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-5">
              <h2 className="font-headline font-bold text-lg text-on-surface">Security &amp; Row-Level Security (RLS)</h2>

              <div className="flex flex-col gap-3">
                <label className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 cursor-pointer">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface">Enforce Multi-Factor Authentication (MFA)</span>
                    <span className="text-[11px] text-secondary">
                      Mandatory hardware security key or TOTP for all Admins and Managers.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={mfaEnforced}
                    onChange={(e) => setMfaEnforced(e.target.checked)}
                    className="w-4 h-4 rounded accent-primary cursor-pointer"
                  />
                </label>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface">Session Inactivity Timeout (minutes)</label>
                  <select
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    className="px-3.5 py-2 rounded-xl bg-surface-container-low text-on-surface text-sm border border-outline-variant/30 focus:outline-none"
                  >
                    <option value="15">15 minutes (Strict)</option>
                    <option value="30">30 minutes</option>
                    <option value="60">60 minutes (Default)</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "audit" && (
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-5">
              <h2 className="font-headline font-bold text-lg text-on-surface">Data Retention &amp; Soft Delete Compliance</h2>

              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-3">
                <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">policy</span>
                  SOC-2 / GDPR Soft-Deletion Policy
                </span>
                <p className="text-xs text-secondary leading-relaxed">
                  When an employee is deactivated, their audit logs, past activity, and foreign key relations are preserved in the encrypted compliance vault. Destructive deletion is blocked by database constraints.
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <label className="text-xs font-semibold text-on-surface">Compliance Vault Retention:</label>
                  <select
                    value={softDeleteRetentionYears}
                    onChange={(e) => setSoftDeleteRetentionYears(e.target.value)}
                    className="px-3 py-1 rounded-lg bg-surface-container-lowest text-on-surface text-xs border border-outline-variant/30 focus:outline-none"
                  >
                    <option value="1">1 Year</option>
                    <option value="3">3 Years</option>
                    <option value="7">7 Years (Default SOC-2 DRP-98)</option>
                    <option value="10">10 Years</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[17px]">save</span>
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
