"use client";

import React, { useState, useEffect } from "react";
import { Employee, UserRole } from "@/types";
import { useTenant } from "@/context/TenantContext";

interface AddEditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmployee?: Employee | null;
}

export default function AddEditUserModal({
  isOpen,
  onClose,
  initialEmployee,
}: AddEditUserModalProps) {
  const { currentTenant, addUser, updateUser } = useTenant();

  const [mode, setMode] = useState<"add" | "edit">("add");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [role, setRole] = useState<UserRole>("Employee");
  const [title, setTitle] = useState("");
  const [tempPassword, setTempPassword] = useState("AcmeSecure2025#");
  const [showPassword, setShowPassword] = useState(false);
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);

  useEffect(() => {
    if (initialEmployee) {
      setMode("edit");
      setFullName(initialEmployee.name);
      setEmail(initialEmployee.email);
      setDepartment(initialEmployee.department);
      setRole(initialEmployee.role);
      setTitle(initialEmployee.title || "");
    } else {
      setMode("add");
      setFullName("");
      setEmail("");
      setDepartment("Engineering");
      setRole("Employee");
      setTitle("");
      setTempPassword("AcmeSecure2025#");
    }
  }, [initialEmployee, isOpen]);

  if (!isOpen) return null;

  const handleGeneratePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*";
    let gen = "";
    for (let i = 0; i < 14; i++) {
      gen += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setTempPassword(gen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    if (mode === "edit" && initialEmployee) {
      updateUser(initialEmployee.id, {
        name: fullName,
        email,
        department,
        role,
        title: title || `${role} - ${department}`,
      });
    } else {
      addUser({
        name: fullName,
        email,
        department,
        role,
        status: "Active",
        title: title || `${role} - ${department}`,
        lastActive: "Just now",
        initials: fullName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2),
      });
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-[640px] my-auto bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all border border-outline-variant/30 animate-in fade-in zoom-in-95 duration-150">
        {/* Top Gradient Banner */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary-container to-secondary"></div>

        {/* Modal Header */}
        <div className="p-5 md:p-6 bg-surface-container-lowest flex items-start justify-between border-b border-outline-variant/20">
          <div className="flex flex-col gap-1.5">
            {/* Mode Switcher */}
            <div className="inline-flex p-1 bg-surface-container-low rounded-lg mb-1 w-fit">
              <button
                type="button"
                onClick={() => setMode("add")}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  mode === "add"
                    ? "bg-surface-container-lowest text-on-surface shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[15px] text-primary">
                  person_add
                </span>
                Add New Employee
              </button>
              <button
                type="button"
                onClick={() => setMode("edit")}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  mode === "edit"
                    ? "bg-surface-container-lowest text-on-surface shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">edit</span>
                Edit Employee
              </button>
            </div>

            <h2 className="font-headline font-bold text-xl text-on-surface tracking-tight">
              {mode === "add" ? "Register New Employee" : "Edit Employee Details"}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-[15px] text-primary">
                corporate_fare
              </span>
              <p>
                Provision access credentials for{" "}
                <span className="font-semibold text-on-surface">{currentTenant.name}</span> tenant
                workspace
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            title="Close Modal"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 md:p-6 flex flex-col gap-5 max-h-[75vh] overflow-y-auto">
          {/* Identity Grid: Full Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface flex items-center gap-1" htmlFor="full-name">
                Full Name <span className="text-error font-bold">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">
                  badge
                </span>
                <input
                  id="full-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Liam Gallagher"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-low text-on-surface text-sm border border-outline-variant/30 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all placeholder:text-outline"
                />
              </div>
              <span className="text-[11px] text-secondary">Legal name verified on directory</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface flex items-center gap-1" htmlFor="work-email">
                Work Email Address <span className="text-error font-bold">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">
                  mail
                </span>
                <input
                  id="work-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. liam.g@acmecorp.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-low text-on-surface text-sm border border-outline-variant/30 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all placeholder:text-outline"
                />
              </div>
              <div className="flex items-center gap-1 text-[11px] text-on-secondary-container">
                <span className="material-symbols-outlined text-[13px] text-primary">verified</span>
                <span>
                  Must use company domain <code className="font-mono text-primary font-medium">@{currentTenant.slug}corp.com</code>
                </span>
              </div>
            </div>
          </div>

          {/* Department & Job Title */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface flex items-center gap-1" htmlFor="department">
                Department / Team <span className="text-error font-bold">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">
                  domain
                </span>
                <select
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-surface-container-low text-on-surface text-sm border border-outline-variant/30 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Product & Design">Product &amp; Design</option>
                  <option value="Operations">Operations</option>
                  <option value="Customer Success">Customer Success</option>
                  <option value="Finance">Finance</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 text-on-surface-variant text-[18px] pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface" htmlFor="job-title">
                Job Title / Position
              </label>
              <input
                id="job-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Infrastructure Engineer"
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface text-sm border border-outline-variant/30 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all placeholder:text-outline"
              />
            </div>
          </div>

          {/* Password (for add mode) */}
          {mode === "add" && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-on-surface flex items-center gap-1" htmlFor="temp-password">
                  Temporary Password <span className="text-error font-bold">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[13px]">autorenew</span> Auto-generate
                </button>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">
                  key
                </span>
                <input
                  id="temp-password"
                  type={showPassword ? "text" : "password"}
                  value={tempPassword}
                  onChange={(e) => setTempPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 rounded-xl bg-surface-container-low text-on-surface font-mono text-sm border border-outline-variant/30 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-on-surface-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <div className="flex-1 h-1.5 rounded-full bg-surface-container-high overflow-hidden flex gap-1">
                  <div className="w-1/3 h-full bg-primary rounded-full"></div>
                  <div className="w-1/3 h-full bg-primary rounded-full"></div>
                  <div className="w-1/3 h-full bg-primary rounded-full"></div>
                </div>
                <span className="text-[11px] text-primary font-semibold">Strong (14+ chars)</span>
              </div>
            </div>
          )}

          {/* Role Selection Group */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-on-surface flex items-center gap-1">
              Tenant Role &amp; Privileges <span className="text-error font-bold">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Admin Card */}
              <div
                onClick={() => setRole("Admin")}
                className={`p-3.5 rounded-xl cursor-pointer transition-all border flex flex-col justify-between ${
                  role === "Admin"
                    ? "bg-surface-container-high border-primary shadow-sm ring-1 ring-primary/30"
                    : "bg-surface-container-low border-outline-variant/20 hover:bg-surface-container"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 rounded-lg bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">shield_person</span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      role === "Admin" ? "border-primary bg-primary" : "border-outline-variant"
                    }`}
                  >
                    {role === "Admin" && <div className="w-1.5 h-1.5 rounded-full bg-on-primary"></div>}
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-xs text-on-surface block">Admin</span>
                  <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                    Full access to company user management, roles, and settings
                  </p>
                </div>
              </div>

              {/* Manager Card */}
              <div
                onClick={() => setRole("Manager")}
                className={`p-3.5 rounded-xl cursor-pointer transition-all border flex flex-col justify-between ${
                  role === "Manager"
                    ? "bg-surface-container-high border-primary shadow-sm ring-1 ring-primary/30"
                    : "bg-surface-container-low border-outline-variant/20 hover:bg-surface-container"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 rounded-lg bg-surface-container-high text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">groups</span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      role === "Manager" ? "border-primary bg-primary" : "border-outline-variant"
                    }`}
                  >
                    {role === "Manager" && <div className="w-1.5 h-1.5 rounded-full bg-on-primary"></div>}
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-xs text-on-surface block">Manager</span>
                  <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                    View and manage team employees within assigned departments
                  </p>
                </div>
              </div>

              {/* Employee Card */}
              <div
                onClick={() => setRole("Employee")}
                className={`p-3.5 rounded-xl cursor-pointer transition-all border flex flex-col justify-between ${
                  role === "Employee"
                    ? "bg-surface-container-high border-primary shadow-sm ring-1 ring-primary/30"
                    : "bg-surface-container-low border-outline-variant/20 hover:bg-surface-container"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 rounded-lg bg-secondary-container text-on-secondary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">person</span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      role === "Employee" ? "border-primary bg-primary" : "border-outline-variant"
                    }`}
                  >
                    {role === "Employee" && <div className="w-1.5 h-1.5 rounded-full bg-on-primary"></div>}
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-xs text-on-surface block">Employee</span>
                  <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                    View own profile, company tasks, and general directory
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Email Checkbox */}
          <div className="p-3 rounded-xl bg-surface-container-low flex items-start gap-3 border border-outline-variant/20">
            <input
              id="welcome-email-chk"
              type="checkbox"
              checked={sendWelcomeEmail}
              onChange={(e) => setSendWelcomeEmail(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded accent-primary cursor-pointer"
            />
            <div className="flex flex-col">
              <label htmlFor="welcome-email-chk" className="text-xs font-semibold text-on-surface cursor-pointer">
                Send welcome email with account setup instructions
              </label>
              <p className="text-[11px] text-secondary mt-0.5">
                Includes an encrypted single-use password reset link expiring in 72 hours.
              </p>
            </div>
          </div>

          {/* Tenant SSO Notice */}
          <div className="p-3 rounded-xl bg-surface-container flex items-start gap-2.5 border border-outline-variant/20">
            <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">
              verified
            </span>
            <div className="flex flex-col text-xs text-on-surface">
              <span className="font-semibold">Automatic SSO Binding</span>
              <span className="text-[11px] text-secondary">
                User will authenticate with domain @{currentTenant.slug}corp.com via SAML 2.0 Identity Provider.
              </span>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-2 flex items-center justify-between border-t border-outline-variant/20 mt-2">
            <div className="flex items-center gap-1.5 text-[11px] text-secondary">
              <span className="material-symbols-outlined text-[15px] text-tertiary">lock</span>
              <span>Encrypted audit event logged</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container text-xs font-semibold shadow-sm border border-outline-variant/30 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all"
              >
                <span className="material-symbols-outlined text-[17px]">how_to_reg</span>
                <span>{mode === "add" ? "Save & Register Employee" : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
