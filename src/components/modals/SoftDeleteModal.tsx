"use client";

import React, { useState } from "react";
import { Employee } from "@/types";
import { useTenant } from "@/context/TenantContext";

interface SoftDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

export default function SoftDeleteModal({
  isOpen,
  onClose,
  employee,
}: SoftDeleteModalProps) {
  const { softDeleteUser } = useTenant();
  const [reason, setReason] = useState("Employee left company");

  if (!isOpen || !employee) return null;

  const handleConfirm = () => {
    softDeleteUser(employee.id, reason);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/60 backdrop-blur-[2px] p-4 transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-[540px] w-full flex flex-col overflow-hidden border border-outline-variant/30 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-surface-container-low flex items-center justify-between border-b border-outline-variant/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-error-container text-on-error-container flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[22px]">person_off</span>
            </div>
            <div className="flex flex-col">
              <h3 className="font-headline font-bold text-lg text-on-surface">Deactivate Employee?</h3>
              <span className="text-[11px] text-secondary">Soft Delete Confirmation Protocol</span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-5">
          <div className="bg-surface-container-low rounded-xl p-3.5 flex items-start gap-3 border border-outline-variant/20">
            <span className="material-symbols-outlined text-primary text-[20px] mt-0.5 shrink-0">info</span>
            <p className="text-xs text-on-surface leading-relaxed">
              Are you sure you want to deactivate{" "}
              <strong className="text-on-surface font-semibold">{employee.name} ({employee.id})</strong>? They will be
              signed out immediately and unable to log in. No data will be permanently wiped.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-on-surface flex items-center gap-1">
              <span>Reason for Deactivation</span>
              <span className="text-error">*</span>
            </label>
            <div className="flex flex-col gap-2">
              <label
                onClick={() => setReason("Employee left company")}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all shadow-sm ${
                  reason === "Employee left company"
                    ? "bg-surface-container-high border-primary ring-1 ring-primary/20"
                    : "bg-surface-container-lowest border-outline-variant/20 hover:bg-surface-container-low"
                }`}
              >
                <input
                  type="radio"
                  name="deactivation_reason"
                  value="Employee left company"
                  checked={reason === "Employee left company"}
                  onChange={() => setReason("Employee left company")}
                  className="w-4 h-4 text-primary accent-primary"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-on-surface">Employee left company</span>
                  <span className="text-[11px] text-secondary">
                    Standard offboarding, revoke all cloud tokens immediately
                  </span>
                </div>
              </label>

              <label
                onClick={() => setReason("Extended leave of absence")}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all shadow-sm ${
                  reason === "Extended leave of absence"
                    ? "bg-surface-container-high border-primary ring-1 ring-primary/20"
                    : "bg-surface-container-lowest border-outline-variant/20 hover:bg-surface-container-low"
                }`}
              >
                <input
                  type="radio"
                  name="deactivation_reason"
                  value="Extended leave of absence"
                  checked={reason === "Extended leave of absence"}
                  onChange={() => setReason("Extended leave of absence")}
                  className="w-4 h-4 text-primary accent-primary"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-on-surface">Extended leave of absence</span>
                  <span className="text-[11px] text-secondary">
                    Pause active subscriptions while keeping roles intact
                  </span>
                </div>
              </label>

              <label
                onClick={() => setReason("Temporary security hold")}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all shadow-sm ${
                  reason === "Temporary security hold"
                    ? "bg-surface-container-high border-primary ring-1 ring-primary/20"
                    : "bg-surface-container-lowest border-outline-variant/20 hover:bg-surface-container-low"
                }`}
              >
                <input
                  type="radio"
                  name="deactivation_reason"
                  value="Temporary security hold"
                  checked={reason === "Temporary security hold"}
                  onChange={() => setReason("Temporary security hold")}
                  className="w-4 h-4 text-primary accent-primary"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-on-surface">Temporary security hold</span>
                  <span className="text-[11px] text-secondary">
                    Compromised credential containment per SOC-2 incident protocol
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-surface-container flex items-center justify-between text-xs text-secondary border border-outline-variant/20">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              <span>Target Action: Revoke 4 sessions</span>
            </div>
            <span className="font-mono text-[11px] font-medium text-on-surface-variant">Audit tag #SEC-291</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-surface-container-low flex items-center justify-end gap-3 border-t border-outline-variant/20">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface text-xs font-semibold shadow-sm border border-outline-variant/30 transition-colors"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-error hover:bg-on-error-container text-on-error text-xs font-semibold shadow-md transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[17px]">person_off</span>
            <span>Confirm Deactivation</span>
          </button>
        </div>
      </div>
    </div>
  );
}
