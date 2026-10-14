"use client";

import React, { useState } from "react";
import { useTenant } from "@/context/TenantContext";

interface ApiCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApiCredentialsModal({
  isOpen,
  onClose,
}: ApiCredentialsModalProps) {
  const { currentTenant, showToast } = useTenant();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const credentials = {
    tenantId: currentTenant.id,
    apiKey: `tp_live_${currentTenant.slug}_98a2f1b88e14cb77`,
    clientSecret: `sec_${currentTenant.slug}_994a00bc19ee274da589`,
    webhookUrl: `https://${currentTenant.slug}.tenantpulse.io/api/v1/webhooks`,
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    showToast(`Copied ${fieldName} to clipboard`);
    setTimeout(() => setCopiedField(null), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/60 backdrop-blur-[2px] p-4 transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-[560px] w-full flex flex-col overflow-hidden border border-outline-variant/30 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 bg-surface-container-low flex items-center justify-between border-b border-outline-variant/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[20px]">key</span>
            </div>
            <div className="flex flex-col">
              <h3 className="font-headline font-bold text-lg text-on-surface">API Credentials</h3>
              <span className="text-[11px] text-secondary font-mono">
                Scoped to partition: {currentTenant.id}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div className="p-3 rounded-xl bg-surface-container-low flex items-start gap-2.5 border border-outline-variant/20">
            <span className="material-symbols-outlined text-tertiary text-[18px] shrink-0 mt-0.5">
              security
            </span>
            <p className="text-xs text-secondary leading-relaxed">
              These credentials grant programmatic access to your isolated tenant database and REST endpoints. Never expose them in public client bundles.
            </p>
          </div>

          {/* Tenant ID */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface">Tenant ID</label>
            <div className="flex items-center rounded-xl bg-surface-container-low border border-outline-variant/30 overflow-hidden px-3 py-2 justify-between">
              <span className="font-mono text-xs text-on-surface">{credentials.tenantId}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(credentials.tenantId, "Tenant ID")}
                className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
              >
                <span className="material-symbols-outlined text-[15px]">
                  {copiedField === "Tenant ID" ? "check" : "content_copy"}
                </span>
                {copiedField === "Tenant ID" ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* API Key */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface">Live API Key</label>
            <div className="flex items-center rounded-xl bg-surface-container-low border border-outline-variant/30 overflow-hidden px-3 py-2 justify-between">
              <span className="font-mono text-xs text-on-surface">{credentials.apiKey}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(credentials.apiKey, "API Key")}
                className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
              >
                <span className="material-symbols-outlined text-[15px]">
                  {copiedField === "API Key" ? "check" : "content_copy"}
                </span>
                {copiedField === "API Key" ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Client Secret */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface">Client Secret</label>
            <div className="flex items-center rounded-xl bg-surface-container-low border border-outline-variant/30 overflow-hidden px-3 py-2 justify-between">
              <span className="font-mono text-xs text-on-surface">{credentials.clientSecret}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(credentials.clientSecret, "Client Secret")}
                className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
              >
                <span className="material-symbols-outlined text-[15px]">
                  {copiedField === "Client Secret" ? "check" : "content_copy"}
                </span>
                {copiedField === "Client Secret" ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Webhook Endpoint */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface">Webhook Endpoint</label>
            <div className="flex items-center rounded-xl bg-surface-container-low border border-outline-variant/30 overflow-hidden px-3 py-2 justify-between">
              <span className="font-mono text-xs text-on-surface truncate pr-2">
                {credentials.webhookUrl}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(credentials.webhookUrl, "Webhook URL")}
                className="text-xs text-primary hover:underline flex items-center gap-1 font-medium shrink-0"
              >
                <span className="material-symbols-outlined text-[15px]">
                  {copiedField === "Webhook URL" ? "check" : "content_copy"}
                </span>
                {copiedField === "Webhook URL" ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-surface-container-low flex items-center justify-end border-t border-outline-variant/20">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold shadow-md hover:bg-primary-container transition-all"
            type="button"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
