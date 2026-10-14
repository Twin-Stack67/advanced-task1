"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTenant } from "@/context/TenantContext";

export default function RegisterCompanyPage() {
  const router = useRouter();
  const { showToast } = useTenant();

  const [step, setStep] = useState<1 | 2>(1);
  const [companyName, setCompanyName] = useState("");
  const [tenantSlug, setTenantSlug] = useState("");
  const [manualSlugEdit, setManualSlugEdit] = useState(false);
  const [industry, setIndustry] = useState("saas");
  const [orgSize, setOrgSize] = useState("10-50");

  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-slug generator
  const handleCompanyNameChange = (val: string) => {
    setCompanyName(val);
    if (!manualSlugEdit) {
      const sanitized = val
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      setTenantSlug(sanitized);
    }
  };

  // Password rules validation
  const ruleLen = adminPassword.length >= 8;
  const ruleNum = /[0-9]/.test(adminPassword);
  const ruleSym = /[^A-Za-z0-9]/.test(adminPassword);
  const ruleCase = /[a-z]/.test(adminPassword) && /[A-Z]/.test(adminPassword);

  const validateStep1 = () => {
    if (!companyName.trim()) {
      showToast("Please enter your company or organization name.");
      return;
    }
    if (!tenantSlug.trim()) {
      showToast("Please provide a dedicated subdomain slug.");
      return;
    }
    setStep(2);
  };

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      validateStep1();
      return;
    }

    if (!adminName.trim() || !adminEmail.trim()) {
      showToast("Please provide the administrator name and email.");
      return;
    }

    if (!ruleLen || !ruleNum || !ruleSym || !ruleCase) {
      showToast("Please satisfy all password complexity requirements.");
      return;
    }

    if (adminPassword !== confirmPassword) {
      showToast("Passwords do not match. Please verify and try again.");
      return;
    }

    if (!agreed) {
      showToast("Please agree to the Terms of Service and Data Isolation Agreement.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      showToast(`Company workspace ${tenantSlug}.tenantpulse.io provisioned!`);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    }, 1800);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-6 bg-background relative overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div className="absolute -top-12 -left-12 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-16 -right-12 w-96 h-96 bg-tertiary-container/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col w-full max-w-[680px] mx-auto py-8 relative z-10">
        {/* Main Card Container */}
        <div className="relative bg-surface-container-lowest shadow-2xl rounded-2xl p-6 sm:p-10 border border-outline-variant/30">
          {/* Top Branding */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/logo.png"
                alt="TenantPulse Logo"
                width={40}
                height={40}
                className="object-contain rounded-lg shadow-sm"
              />
              <div className="flex flex-col text-left">
                <span className="font-headline font-bold text-lg text-on-surface tracking-tight leading-none">
                  TenantPulse
                </span>
                <span className="text-[11px] text-secondary uppercase font-semibold tracking-wider">
                  Enterprise OS
                </span>
              </div>
            </div>

            <h1 className="font-headline font-bold text-2xl sm:text-3xl text-on-surface tracking-tight">
              Register Your Company
            </h1>
            <p className="text-sm text-secondary mt-1.5 max-w-lg">
              Create an isolated workspace for your organization and start managing your team.
            </p>
          </div>

          {/* Progress Indicator / Tabs */}
          <div className="mt-6 flex items-center justify-between bg-surface-container-low p-1 rounded-xl border border-outline-variant/20">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                step === 1
                  ? "bg-surface-container-lowest shadow-sm text-primary"
                  : "text-secondary hover:text-on-surface"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[11px] font-bold">
                1
              </span>
              <span>Company Profile</span>
            </button>

            <button
              type="button"
              onClick={() => validateStep1()}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                step === 2
                  ? "bg-surface-container-lowest shadow-sm text-primary"
                  : "text-secondary hover:text-on-surface"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  step === 2
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-high text-secondary"
                }`}
              >
                2
              </span>
              <span>Administrator</span>
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleRegistration} className="mt-6 flex flex-col gap-5">
            {/* STEP 1: COMPANY PROFILE */}
            {step === 1 && (
              <div className="flex flex-col gap-4 animate-in fade-in duration-150">
                {/* Company Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface flex items-center gap-1" htmlFor="companyName">
                    Company / Organization Name <span className="text-error font-bold">*</span>
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => handleCompanyNameChange(e.target.value)}
                    placeholder="e.g. Apex Dynamics Ltd."
                    className="w-full h-10 px-4 bg-surface-container-low text-on-surface text-sm rounded-xl border border-outline-variant/30 focus:bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-outline"
                  />
                </div>

                {/* Tenant Domain / Slug */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-on-surface flex items-center gap-1" htmlFor="tenantSlug">
                      Tenant Dedicated Domain <span className="text-error font-bold">*</span>
                    </label>
                    <span className="text-[11px] text-secondary flex items-center gap-1 font-mono">
                      <span className="material-symbols-outlined text-[13px] text-tertiary">lock</span>
                      Schema-isolated node
                    </span>
                  </div>

                  <div className="flex items-center rounded-xl bg-surface-container-low border border-outline-variant/30 overflow-hidden focus-within:bg-surface-container-lowest focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                    <span className="px-3 py-2 bg-surface-container text-secondary font-mono text-xs select-none">
                      https://
                    </span>
                    <input
                      id="tenantSlug"
                      type="text"
                      required
                      value={tenantSlug}
                      onChange={(e) => {
                        setManualSlugEdit(true);
                        setTenantSlug(e.target.value);
                      }}
                      placeholder="apex"
                      className="flex-1 h-10 px-3 bg-transparent font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none"
                    />
                    <span className="px-3 py-2 bg-surface-container text-secondary font-mono text-xs select-none">
                      .tenantpulse.io
                    </span>
                  </div>
                  <p className="text-[11px] text-secondary">
                    Unique subdomain assigned to your organization&apos;s encrypted partition.
                  </p>
                </div>

                {/* Industry & Org Size Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-on-surface" htmlFor="industry">
                      Industry Vertical
                    </label>
                    <select
                      id="industry"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="h-10 px-3 bg-surface-container-low text-on-surface text-sm rounded-xl border border-outline-variant/30 focus:bg-surface-container-lowest focus:border-primary focus:outline-none cursor-pointer"
                    >
                      <option value="fintech">Fintech &amp; Banking</option>
                      <option value="saas">Software &amp; SaaS</option>
                      <option value="healthcare">Healthcare &amp; Life Sciences</option>
                      <option value="logistics">Logistics &amp; Supply Chain</option>
                      <option value="consulting">Professional Services</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-on-surface" htmlFor="orgSize">
                      Organization Size
                    </label>
                    <select
                      id="orgSize"
                      value={orgSize}
                      onChange={(e) => setOrgSize(e.target.value)}
                      className="h-10 px-3 bg-surface-container-low text-on-surface text-sm rounded-xl border border-outline-variant/30 focus:bg-surface-container-lowest focus:border-primary focus:outline-none cursor-pointer"
                    >
                      <option value="1-9">1 - 9 employees</option>
                      <option value="10-50">10 - 50 employees</option>
                      <option value="51-250">51 - 250 employees</option>
                      <option value="251-1000">251 - 1,000 employees</option>
                      <option value="1000+">1,000+ Enterprise</option>
                    </select>
                  </div>
                </div>

                {/* Quick Continue Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={validateStep1}
                    className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Next: Primary Administrator</span>
                    <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: PRIMARY ADMINISTRATOR ACCOUNT */}
            {step === 2 && (
              <div className="flex flex-col gap-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Admin Full Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-on-surface flex items-center gap-1" htmlFor="adminName">
                      Admin Full Name <span className="text-error font-bold">*</span>
                    </label>
                    <input
                      id="adminName"
                      type="text"
                      required
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full h-10 px-4 bg-surface-container-low text-on-surface text-sm rounded-xl border border-outline-variant/30 focus:bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-outline"
                    />
                  </div>

                  {/* Business Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-on-surface flex items-center gap-1" htmlFor="adminEmail">
                      Business Email <span className="text-error font-bold">*</span>
                    </label>
                    <input
                      id="adminEmail"
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@apexdynamics.com"
                      className="w-full h-10 px-4 bg-surface-container-low text-on-surface text-sm rounded-xl border border-outline-variant/30 focus:bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-outline"
                    />
                  </div>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-on-surface flex items-center gap-1" htmlFor="adminPassword">
                      Admin Password <span className="text-error font-bold">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="adminPassword"
                        type={showAdminPass ? "text" : "password"}
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full h-10 pl-4 pr-10 bg-surface-container-low text-on-surface text-sm rounded-xl border border-outline-variant/30 focus:bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-outline"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPass(!showAdminPass)}
                        className="absolute right-3 top-2.5 text-secondary hover:text-on-surface"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {showAdminPass ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-on-surface flex items-center gap-1" htmlFor="confirmPassword">
                      Confirm Password <span className="text-error font-bold">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPass ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full h-10 pl-4 pr-10 bg-surface-container-low text-on-surface text-sm rounded-xl border border-outline-variant/30 focus:bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-outline"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-3 top-2.5 text-secondary hover:text-on-surface"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {showConfirmPass ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Requirement Checklist */}
                <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/20 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px]">
                  <span className={`flex items-center gap-1 ${ruleLen ? "text-primary font-semibold" : "text-secondary"}`}>
                    <span className="material-symbols-outlined text-[14px]">
                      {ruleLen ? "check_circle" : "radio_button_unchecked"}
                    </span>
                    8+ chars
                  </span>
                  <span className={`flex items-center gap-1 ${ruleNum ? "text-primary font-semibold" : "text-secondary"}`}>
                    <span className="material-symbols-outlined text-[14px]">
                      {ruleNum ? "check_circle" : "radio_button_unchecked"}
                    </span>
                    1 number
                  </span>
                  <span className={`flex items-center gap-1 ${ruleSym ? "text-primary font-semibold" : "text-secondary"}`}>
                    <span className="material-symbols-outlined text-[14px]">
                      {ruleSym ? "check_circle" : "radio_button_unchecked"}
                    </span>
                    1 special symbol
                  </span>
                  <span className={`flex items-center gap-1 ${ruleCase ? "text-primary font-semibold" : "text-secondary"}`}>
                    <span className="material-symbols-outlined text-[14px]">
                      {ruleCase ? "check_circle" : "radio_button_unchecked"}
                    </span>
                    Upper &amp; lowercase
                  </span>
                </div>

                {/* Previous / Edit Company Link */}
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="self-start text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  Edit Company Profile
                </button>

                {/* Multi-tenant Data Privacy Notice */}
                <div className="bg-surface-container-low rounded-xl p-3.5 flex items-start gap-3 border border-outline-variant/20">
                  <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">
                    verified_user
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-on-surface">
                      Multi-Tenant Data Privacy Guarantee
                    </span>
                    <p className="text-[11px] text-secondary leading-relaxed">
                      Your company data is strictly isolated with dedicated schema separation. Only authorized company administrators can view your employee directory.
                    </p>
                  </div>
                </div>

                {/* Agreement Checkbox */}
                <div className="flex items-start gap-2.5">
                  <input
                    id="termsAgree"
                    type="checkbox"
                    required
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded accent-primary cursor-pointer"
                  />
                  <label htmlFor="termsAgree" className="text-xs text-on-surface select-none cursor-pointer">
                    I agree to the{" "}
                    <a href="#" className="text-primary font-medium hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-primary font-medium hover:underline">
                      Data Isolation Agreement
                    </a>
                    .
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 bg-primary hover:bg-primary-container text-on-primary font-semibold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-80"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[20px]">
                        autorenew
                      </span>
                      <span>Provisioning Isolated Workspace...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px]">domain_add</span>
                      <span>Create Company Workspace</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </form>

          {/* Footer Action */}
          <div className="mt-6 pt-4 bg-surface-container-low/50 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-center gap-1.5 text-center text-xs text-secondary border border-outline-variant/15">
            <span>Already registered?</span>
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline flex items-center gap-0.5"
            >
              <span>Sign in to your tenant portal</span>
              <span className="material-symbols-outlined text-[15px]">open_in_new</span>
            </Link>
          </div>
        </div>

        {/* Security Badges Below Container */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-secondary text-xs">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-tertiary">security</span>
            SOC2 Type II Certified
          </span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-tertiary">encrypted</span>
            AES-256 Tenant Encryption
          </span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-tertiary">cloud_done</span>
            99.99% Uptime SLA
          </span>
        </div>
      </div>
    </main>
  );
}
