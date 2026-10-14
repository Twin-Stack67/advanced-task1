"use client";

import React from "react";
import { useTenant } from "@/context/TenantContext";

export default function Toast() {
  const { toastMessage, hideToast } = useTenant();

  if (!toastMessage) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-space-lg py-space-md rounded-xl shadow-2xl flex items-center gap-space-md transition-all animate-in fade-in slide-in-from-bottom-5 duration-200 border border-outline/20"
      role="alert"
    >
      <span className="material-symbols-outlined text-tertiary-fixed-dim text-[20px]">
        check_circle
      </span>
      <span className="font-body-sm text-[13px] font-medium">{toastMessage}</span>
      <button
        onClick={hideToast}
        type="button"
        className="ml-space-sm text-inverse-on-surface/60 hover:text-inverse-on-surface transition-colors p-1"
        aria-label="Dismiss toast"
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  );
}
