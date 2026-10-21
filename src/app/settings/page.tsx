'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Building2,
  Globe,
  Save,
  Loader2,
  ShieldAlert,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/context/AuthContext';
import { companyApi } from '@/lib/api';
import { ICompany } from '@/types';
import { AlertBanner } from '@/components/common/Toast';

export default function SettingsPage() {
  const { user } = useAuth();

  const [company, setCompany] = useState<ICompany | null>(null);
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const isAdmin = user?.role === 'Admin';

  const fetchCompanyDetails = useCallback(async () => {
    if (!isAdmin) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setFeedback(null);
    try {
      const res = await companyApi.getStats();
      if (res.data?.company) {
        setCompany(res.data.company);
        setName(res.data.company.name || '');
        setDomain(res.data.company.domain || '');
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      setFeedback({
        type: 'error',
        message: e.message || 'Failed to retrieve company configuration.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchCompanyDetails();
  }, [fetchCompanyDetails]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    if (!name.trim()) {
      setFeedback({
        type: 'error',
        message: 'Organization name cannot be empty.',
      });
      return;
    }

    setIsSaving(true);
    setFeedback(null);
    try {
      const res = await companyApi.updateCompany({
        name: name.trim(),
        domain: domain.trim() || undefined,
      });

      if (res.data) {
        setCompany(res.data);
        setName(res.data.name || '');
        setDomain(res.data.domain || '');
        setFeedback({
          type: 'success',
          message: 'Company configuration successfully updated in database.',
        });
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      setFeedback({
        type: 'error',
        message: e.message || 'Failed to update company configuration.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#122056]">
            Company & Workspace Settings
          </h1>
          <p className="text-sm text-[#505B85] mt-1">
            Manage organization identity and tenant partition domain configuration
          </p>
        </div>

        {feedback && (
          <AlertBanner
            type={feedback.type}
            message={feedback.message}
            onClose={() => setFeedback(null)}
          />
        )}

        {!isAdmin ? (
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E4F2] p-8 text-center shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-[#122056]">
              Administrator Privileges Required
            </h2>
            <p className="text-sm text-[#505B85] mt-2 max-w-md mx-auto leading-relaxed">
              Your account currently has the{' '}
              <strong className="text-[#122056]">{user?.role}</strong> role. Only
              Administrators are authorized to modify company-wide settings and domains.
            </p>
          </div>
        ) : isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 bg-[#FFFFFF] rounded-2xl border border-[#E2E4F2]">
            <Loader2 className="w-8 h-8 animate-spin text-[#5B65DC]" />
            <p className="text-sm font-medium text-[#505B85]">
              Loading company configuration...
            </p>
          </div>
        ) : (
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E4F2] shadow-xs overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              {/* Organization Name */}
              <div>
                <label
                  htmlFor="companyName"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#122056] mb-1.5"
                >
                  Organization Name <span className="text-[#DC2626]">*</span>
                </label>
                <div className="relative">
                  <input
                    id="companyName"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Acme Corporation"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-[#E2E4F2] bg-[#FFFFFF] text-[#122056] text-sm focus:outline-none focus:border-[#5B65DC] focus:ring-2 focus:ring-[#5B65DC]/20 transition-all placeholder:text-[#828BAA]"
                  />
                  <Building2 className="w-4 h-4 text-[#828BAA] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <p className="mt-1 text-[11px] text-[#828BAA]">
                  Displayed to all members within this tenant partition.
                </p>
              </div>

              {/* Domain */}
              <div>
                <label
                  htmlFor="domain"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#122056] mb-1.5"
                >
                  Workspace Domain Slug (Optional)
                </label>
                <div className="relative">
                  <input
                    id="domain"
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="e.g. acmecorp.com or acme"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-[#E2E4F2] bg-[#FFFFFF] text-[#122056] text-sm focus:outline-none focus:border-[#5B65DC] focus:ring-2 focus:ring-[#5B65DC]/20 transition-all placeholder:text-[#828BAA]"
                  />
                  <Globe className="w-4 h-4 text-[#828BAA] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <p className="mt-1 text-[11px] text-[#828BAA]">
                  Must be globally unique if specified. Used for email domain matching.
                </p>
              </div>

              {/* Readonly partition metadata */}
              <div className="p-4 rounded-xl bg-[#FAFAFD] border border-[#E2E4F2] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#828BAA]">Tenant ID:</span>
                  <span className="font-mono text-[#5B65DC] font-semibold break-all">
                    {company?._id}
                  </span>
                </div>
                {company?.createdAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#828BAA]">Created Date:</span>
                    <span className="text-[#505B85] font-medium">
                      {new Date(company.createdAt).toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[#828BAA]">Multi-Tenant Isolation:</span>
                  <span className="text-[#059669] font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Enforced by Database
                  </span>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4 border-t border-[#E2E4F2] flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#5B65DC] hover:bg-[#4852c9] text-[#FFFFFF] text-sm font-semibold shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Company Settings</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AppShell>
  );
}
