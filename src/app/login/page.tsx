"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTenant } from "@/context/TenantContext";

export default function LoginPage() {
  const router = useRouter();
  const { showToast, switchTenant } = useTenant();

  const [workspace, setWorkspace] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [detectedDomain, setDetectedDomain] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (val.includes("@") && !workspace.trim()) {
      const parts = val.split("@");
      if (parts[1] && parts[1].length > 3) {
        const potentialTenant = parts[1].split(".")[0];
        if (
          potentialTenant &&
          !["gmail", "outlook", "yahoo", "hotmail", "icloud"].includes(potentialTenant)
        ) {
          setDetectedDomain(`detected: ${potentialTenant}`);
          return;
        }
      }
    }
    if (!workspace.trim()) {
      setDetectedDomain(null);
    }
  };

  const handleWorkspaceChange = (val: string) => {
    setWorkspace(val);
    if (val.trim()) {
      setDetectedDomain("workspace locked");
    } else {
      setDetectedDomain(null);
    }
  };

  const quickFill = (
    ws: string,
    em: string,
    pass: string,
    roleLabel: string,
    company: string,
    tenantId: string
  ) => {
    setWorkspace(ws);
    setEmail(em);
    setPassword(pass);
    setDetectedDomain(company);
    switchTenant(tenantId);
    showToast(`Loaded ${roleLabel} persona credentials`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setSubmitSuccess(true);
      showToast("Tenant verified! Welcome to TenantPulse.");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    }, 1200);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-6 bg-background relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-container/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col w-full max-w-[480px] mx-auto py-8 relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-surface-container-low shadow-sm mb-3 border border-outline-variant/30">
            <Image
              src="/images/logo.png"
              alt="TenantPulse Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-fixed-dim opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-primary"></span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <h1 className="font-headline font-bold text-2xl text-on-surface tracking-tight">
              TenantPulse
            </h1>
            <span className="font-mono text-xs bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
              v3.8
            </span>
          </div>
          <p className="text-xs text-secondary mt-1">
            Isolated Multi-Tenant Enterprise Gateway
          </p>
        </div>

        {/* Primary Authentication Surface Card */}
        <div className="relative bg-surface-container-lowest rounded-2xl shadow-xl p-6 sm:p-8 border border-outline-variant/30">
          {/* Ambient top glow */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary-container to-secondary rounded-t-2xl"></div>

          <div className="mb-6">
            <h2 className="font-headline font-bold text-xl text-on-surface">
              Sign in to your account
            </h2>
            <p className="text-xs text-secondary mt-1">
              Enter your credentials to access your company dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Workspace Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="workspaceInput"
                  className="text-xs font-semibold text-on-surface-variant flex items-center gap-1.5"
                >
                  <span>Company Workspace</span>
                  <span className="text-[11px] text-secondary font-normal">(optional)</span>
                </label>
                {detectedDomain && (
                  <span className="font-mono text-[11px] text-primary font-medium bg-surface-container px-2 py-0.5 rounded">
                    {detectedDomain}
                  </span>
                )}
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-secondary text-[20px] pointer-events-none">
                  domain
                </span>
                <input
                  id="workspaceInput"
                  type="text"
                  value={workspace}
                  onChange={(e) => handleWorkspaceChange(e.target.value)}
                  placeholder="e.g. acme or leave blank for auto-redirect"
                  className="w-full h-10 pl-10 pr-4 rounded-xl bg-surface-container-low text-on-surface text-sm border border-outline-variant/30 focus:bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-outline"
                />
              </div>
              <p className="text-[11px] text-secondary">
                Custom subdomain routed automatically if omitted.
              </p>
            </div>

            {/* Work Email Field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="emailInput"
                className="text-xs font-semibold text-on-surface-variant flex items-center gap-1"
              >
                <span>Work Email</span>
                <span className="text-error font-bold">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-secondary text-[20px] pointer-events-none">
                  mail
                </span>
                <input
                  id="emailInput"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full h-10 pl-10 pr-4 rounded-xl bg-surface-container-low text-on-surface text-sm border border-outline-variant/30 focus:bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-outline"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="passwordInput"
                  className="text-xs font-semibold text-on-surface-variant flex items-center gap-1"
                >
                  <span>Password</span>
                  <span className="text-error font-bold">*</span>
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast("Password reset instructions sent to domain admin.");
                  }}
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-secondary text-[20px] pointer-events-none">
                  lock
                </span>
                <input
                  id="passwordInput"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-10 pl-10 pr-10 rounded-xl bg-surface-container-low text-on-surface text-sm border border-outline-variant/30 focus:bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-outline"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 text-secondary hover:text-on-surface p-1 flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Checkbox & SSO Trust Anchor */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-0 cursor-pointer accent-primary"
                />
                <span className="text-xs text-on-surface">Remember this device</span>
              </label>
              <div className="flex items-center gap-1 text-secondary text-xs">
                <span className="material-symbols-outlined text-[15px] text-tertiary">
                  lock_reset
                </span>
                <span>SSO Ready</span>
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full h-11 text-on-primary font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2 ${
                submitSuccess
                  ? "bg-tertiary-container"
                  : isSubmitting
                  ? "bg-primary-container opacity-90 cursor-wait"
                  : "bg-primary hover:bg-primary-container"
              }`}
            >
              {isSubmitting ? (
                submitSuccess ? (
                  <>
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span>Redirecting to Dashboard...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[18px]">
                      progress_activity
                    </span>
                    <span>Authenticating tenant...</span>
                  </>
                )
              ) : (
                <>
                  <span>Sign In</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Quick-Fill Persona Selectors */}
          <div className="mt-6 pt-5 bg-surface-container-low rounded-xl p-4 border border-outline-variant/20">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] text-secondary uppercase font-bold tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                Evaluator Quick-Fill
              </span>
              <span className="text-[11px] text-on-surface-variant">Click to test role</span>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() =>
                  quickFill(
                    "acme",
                    "sarah.admin@acmecorp.io",
                    "Admin•Enterprise2024!",
                    "Admin - Acme Corp",
                    "Acme Corp",
                    "acme_prod_9821"
                  )
                }
                className="group w-full flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container transition-all text-left shadow-sm border border-outline-variant/10"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-6 h-6 rounded bg-primary-container text-on-primary flex items-center justify-center text-xs font-mono font-bold shrink-0">
                    A
                  </span>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                      Admin - Acme Corp
                    </p>
                    <p className="text-[11px] text-secondary font-mono truncate">
                      sarah.admin@acmecorp.io
                    </p>
                  </div>
                </div>
                <span className="text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-medium shrink-0">
                  Tier 1
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  quickFill(
                    "novasystems",
                    "marcus.mgr@novasystems.dev",
                    "Mgr•Passcode99#",
                    "Manager - Nova Systems",
                    "Nova Systems",
                    "novasystems_dev_314"
                  )
                }
                className="group w-full flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container transition-all text-left shadow-sm border border-outline-variant/10"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-6 h-6 rounded bg-tertiary-container text-on-tertiary flex items-center justify-center text-xs font-mono font-bold shrink-0">
                    M
                  </span>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                      Manager - Nova Systems
                    </p>
                    <p className="text-[11px] text-secondary font-mono truncate">
                      marcus.mgr@novasystems.dev
                    </p>
                  </div>
                </div>
                <span className="text-[10px] bg-surface-container text-on-surface-variant px-2 py-0.5 rounded font-medium shrink-0">
                  Tier 2
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  quickFill(
                    "",
                    "elena.ops@vertexlogistics.com",
                    "Emp•SecureToken!1",
                    "Employee (Auto-detect)",
                    "Vertex Logistics",
                    "vertex_ops_552"
                  )
                }
                className="group w-full flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container transition-all text-left shadow-sm border border-outline-variant/10"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-6 h-6 rounded bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center text-xs font-mono font-bold shrink-0">
                    E
                  </span>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                      Employee (Domain Auto-detect)
                    </p>
                    <p className="text-[11px] text-secondary font-mono truncate">
                      elena.ops@vertexlogistics.com
                    </p>
                  </div>
                </div>
                <span className="text-[10px] bg-surface-container text-on-surface-variant px-2 py-0.5 rounded font-medium shrink-0">
                  Member
                </span>
              </button>
            </div>
          </div>

          {/* Supplementary Register Link */}
          <div className="mt-5 flex items-center justify-center text-xs">
            <Link
              href="/register"
              className="text-on-surface-variant hover:text-primary font-semibold transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[17px]">domain_add</span>
              <span>Register new company workspace</span>
            </Link>
          </div>
        </div>

        {/* Enterprise Security Footnote */}
        <div className="mt-6 flex flex-col items-center gap-2 text-center">
          <div className="inline-flex items-center gap-1.5 bg-surface-container-low px-3 py-1 rounded-full border border-outline-variant/20">
            <span
              className="material-symbols-outlined text-primary text-[15px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified_user
            </span>
            <span className="text-[11px] text-secondary font-medium">
              Protected by enterprise multi-tenant security · SOC2 Compliant
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-outline mt-1">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              All Systems Normal
            </span>
            <span>•</span>
            <span>TLS 1.3 Strict Isolation</span>
            <span>•</span>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                showToast("Compliance Portal: All 14 controls verified (SOC-2 Type II).");
              }}
              className="hover:text-secondary underline underline-offset-2"
            >
              Compliance Portal
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
