'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  Building,
  Plus,
  ArrowRight,
  RefreshCw,
  Calendar,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/context/AuthContext';
import { companyApi, userApi } from '@/lib/api';
import { CompanyStatsData, IUser } from '@/types';
import { StatCard } from '@/components/common/StatCard';
import { RoleBadge } from '@/components/common/Badge';
import { AlertBanner } from '@/components/common/Toast';
import { EmployeeModal } from '@/components/employees/EmployeeModal';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<CompanyStatsData | null>(null);
  const [recentUsers, setRecentUsers] = useState<IUser[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. If Admin, fetch company stats
      if (user?.role === 'Admin') {
        const statsRes = await companyApi.getStats();
        if (statsRes.data) {
          setStats(statsRes.data);
        }
      }

      // 2. Fetch recent employees for all authenticated roles
      const usersRes = await userApi.getUsers({
        limit: 5,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      if (usersRes.data) {
        setRecentUsers(usersRes.data);
        if (usersRes.pagination) {
          setTotalCount(usersRes.pagination.totalUsers);
        }
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || 'Failed to load dashboard metrics from backend.');
    } finally {
      setIsLoading(false);
    }
  }, [user?.role]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const canManageEmployees = user?.role === 'Admin' || user?.role === 'Manager';

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#122056]">
              Tenant Workspace Dashboard
            </h1>
            <p className="text-sm text-[#505B85] mt-1">
              Real-time tenant metrics and employee directory overview
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={loadDashboardData}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E2E4F2] bg-[#FFFFFF] text-xs font-semibold text-[#505B85] hover:bg-[#FAFAFD] hover:text-[#122056] transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            {canManageEmployees && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#5B65DC] hover:bg-[#4852c9] text-xs font-semibold text-[#FFFFFF] shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Employee</span>
              </button>
            )}
          </div>
        </div>

        {error && (
          <AlertBanner type="error" message={error} onClose={() => setError(null)} />
        )}

        {/* Bento KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Active Users"
            value={stats ? stats.metrics.totalActiveUsers : totalCount}
            subtitle="Verified tenant members"
            icon={<Users className="w-5 h-5" />}
            highlight={true}
          />
          <StatCard
            title="Managers"
            value={stats ? stats.metrics.managersCount : recentUsers.filter((u) => u.role === 'Manager').length}
            subtitle="Directory administration"
            icon={<UserCheck className="w-5 h-5" />}
          />
          <StatCard
            title="Employees"
            value={stats ? stats.metrics.employeesCount : recentUsers.filter((u) => u.role === 'Employee').length}
            subtitle="Standard tenant access"
            icon={<Shield className="w-5 h-5" />}
          />
          <StatCard
            title="Soft-Deleted Users"
            value={stats ? stats.metrics.totalDeletedUsers : '0'}
            subtitle="Preserved under retention"
            icon={<UserX className="w-5 h-5" />}
          />
        </div>

        {/* Tenant Information & Partition Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-[#FFFFFF] rounded-xl border border-[#E2E4F2] p-5 shadow-xs">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E4F2]">
              <div className="p-2 rounded-lg bg-[#EEEFFD] text-[#5B65DC]">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#122056]">Company Profile</h3>
                <p className="text-xs text-[#828BAA]">Isolated tenant schema</p>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <span className="text-[#828BAA] block mb-0.5">Organization Name</span>
                <p className="text-sm font-semibold text-[#122056]">
                  {stats?.company?.name || 'Loading organization...'}
                </p>
              </div>

              <div>
                <span className="text-[#828BAA] block mb-0.5">Workspace Domain</span>
                <p className="font-mono text-[#505B85]">
                  {stats?.company?.domain || (
                    <span className="text-[#828BAA] italic">Not set (Admin can configure in Settings)</span>
                  )}
                </p>
              </div>

              <div>
                <span className="text-[#828BAA] block mb-0.5">Tenant Partition ID</span>
                <p className="font-mono text-[11px] text-[#5B65DC] bg-[#EEEFFD] p-1.5 rounded-md break-all">
                  {user?.companyId}
                </p>
              </div>

              {stats?.company?.createdAt && (
                <div className="flex items-center gap-1.5 pt-2 border-t border-[#E2E4F2] text-[#828BAA]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Created: {new Date(stats.company.createdAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {user?.role === 'Admin' && (
              <div className="mt-5 pt-3 border-t border-[#E2E4F2]">
                <Link
                  href="/settings"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5B65DC] hover:text-[#4852c9]"
                >
                  <span>Manage Workspace Settings</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Recent Employees List */}
          <div className="lg:col-span-2 bg-[#FFFFFF] rounded-xl border border-[#E2E4F2] p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E4F2]">
                <div>
                  <h3 className="text-sm font-bold text-[#122056]">Recent Employees</h3>
                  <p className="text-xs text-[#828BAA]">Latest additions to this workspace</p>
                </div>
                <Link
                  href="/employees"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#5B65DC] hover:text-[#4852c9]"
                >
                  <span>View All Directory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {isLoading ? (
                <div className="py-8 flex items-center justify-center text-sm text-[#828BAA]">
                  <RefreshCw className="w-4 h-4 animate-spin mr-2 text-[#5B65DC]" />
                  Loading directory records...
                </div>
              ) : recentUsers.length === 0 ? (
                <div className="py-8 text-center text-sm text-[#828BAA]">
                  No employees found in this workspace yet.
                </div>
              ) : (
                <div className="divide-y divide-[#E2E4F2] mt-1">
                  {recentUsers.map((emp) => (
                    <div
                      key={emp._id}
                      className="py-3 flex items-center justify-between gap-4 hover:bg-[#FAFAFD] px-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-[#EEEFFD] text-[#5B65DC] flex items-center justify-center font-bold text-xs shrink-0 border border-[#C5CAFA]">
                          {emp.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/employees/${emp._id}`}
                            className="text-xs font-bold text-[#122056] hover:text-[#5B65DC] truncate block"
                          >
                            {emp.name}
                          </Link>
                          <p className="text-[11px] text-[#828BAA] truncate">{emp.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <RoleBadge role={emp.role} />
                        <Link
                          href={`/employees/${emp._id}`}
                          className="text-xs font-semibold text-[#5B65DC] hover:underline"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#E2E4F2] flex items-center justify-between text-xs text-[#828BAA]">
              <span>Showing up to 5 recent accounts</span>
              <Link href="/employees" className="font-semibold text-[#5B65DC] hover:underline">
                Manage full team →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      <EmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          loadDashboardData();
        }}
      />
    </AppShell>
  );
}
