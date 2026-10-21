'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Building,
  Mail,
  User as UserIcon,
  Shield,
  Edit2,
  Trash2,
  RotateCcw,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/context/AuthContext';
import { userApi } from '@/lib/api';
import { IUser } from '@/types';
import { RoleBadge, StatusBadge } from '@/components/common/Badge';
import { AlertBanner } from '@/components/common/Toast';
import { EmployeeModal } from '@/components/employees/EmployeeModal';
import { DeleteModal } from '@/components/employees/DeleteModal';

interface EmployeeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function EmployeeDetailPage({ params }: EmployeeDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user: currentUser } = useAuth();

  const [employee, setEmployee] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRestoring, setIsRestoring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchEmployee = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await userApi.getUserById(id);
      if (res.data) {
        setEmployee(res.data);
      } else {
        throw new Error('Employee not found');
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || 'Failed to retrieve employee details.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  const handleRestore = async () => {
    if (!employee) return;
    setIsRestoring(true);
    setFeedback(null);
    try {
      const res = await userApi.restoreUser(employee._id);
      setEmployee(res.data);
      setFeedback({
        type: 'success',
        message: `Employee "${res.data.name}" has been successfully restored.`,
      });
    } catch (err: unknown) {
      const e = err as { message?: string };
      setFeedback({
        type: 'error',
        message: e.message || 'Failed to restore employee.',
      });
    } finally {
      setIsRestoring(false);
    }
  };

  const canManage = currentUser?.role === 'Admin' || currentUser?.role === 'Manager';
  const isAdmin = currentUser?.role === 'Admin';

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl">
        {/* Navigation back */}
        <div>
          <Link
            href="/employees"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#505B85] hover:text-[#5B65DC] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Employee Directory</span>
          </Link>
        </div>

        {feedback && (
          <AlertBanner
            type={feedback.type}
            message={feedback.message}
            onClose={() => setFeedback(null)}
          />
        )}

        {error && (
          <AlertBanner type="error" message={error} onClose={() => setError(null)} />
        )}

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 bg-[#FFFFFF] rounded-2xl border border-[#E2E4F2]">
            <Loader2 className="w-8 h-8 animate-spin text-[#5B65DC]" />
            <p className="text-sm font-medium text-[#505B85]">Loading employee record...</p>
          </div>
        ) : !employee ? (
          <div className="py-20 text-center bg-[#FFFFFF] rounded-2xl border border-[#E2E4F2] p-8">
            <h3 className="text-lg font-bold text-[#122056]">Employee Not Found</h3>
            <p className="text-sm text-[#828BAA] mt-1">
              The requested record does not exist or has been permanently moved.
            </p>
            <Link
              href="/employees"
              className="inline-block mt-4 px-4 py-2 rounded-lg bg-[#5B65DC] text-[#FFFFFF] text-xs font-semibold hover:bg-[#4852c9]"
            >
              Return to Directory
            </Link>
          </div>
        ) : (
          <>
            {/* Profile Overview Header Card */}
            <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E4F2] p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#EEEFFD] text-[#5B65DC] flex items-center justify-center font-bold text-2xl border border-[#C5CAFA] shadow-xs">
                    {employee.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className="text-xl font-bold text-[#122056]">
                        {employee.name}
                      </h2>
                      <RoleBadge role={employee.role} />
                      <StatusBadge isDeleted={employee.isDeleted} />
                    </div>
                    <p className="text-sm text-[#505B85] mt-1 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#828BAA]" />
                      <span>{employee.email}</span>
                    </p>
                  </div>
                </div>

                {/* Top Action Buttons */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {canManage && (
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#E2E4F2] bg-[#FFFFFF] text-xs font-semibold text-[#122056] hover:bg-[#EEEFFD] hover:text-[#5B65DC] transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Details</span>
                    </button>
                  )}

                  {isAdmin && (
                    <>
                      {employee.isDeleted ? (
                        <button
                          onClick={handleRestore}
                          disabled={isRestoring}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#059669] hover:bg-[#047857] text-[#FFFFFF] text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors"
                        >
                          {isRestoring ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <RotateCcw className="w-3.5 h-3.5" />
                          )}
                          <span>Restore Account</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsDeleteModalOpen(true)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] hover:bg-[#FEE2E2] text-xs font-semibold transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Soft Delete</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Detailed Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Details */}
              <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E4F2] p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-[#122056] pb-3 border-b border-[#E2E4F2]">
                  Account Information
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[#828BAA] block mb-1">Full Name</span>
                    <span className="font-semibold text-[#122056] text-sm">
                      {employee.name}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#828BAA] block mb-1">Email Address</span>
                    <span className="font-semibold text-[#122056]">
                      {employee.email}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#828BAA] block mb-1">Assigned Role</span>
                    <span className="font-semibold text-[#122056]">
                      {employee.role}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#828BAA] block mb-1">Tenant Partition ID</span>
                    <span className="font-mono text-[#5B65DC] bg-[#EEEFFD] p-1.5 rounded-md block break-all">
                      {employee.companyId}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lifecycle & Dates */}
              <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E4F2] p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-[#122056] pb-3 border-b border-[#E2E4F2]">
                  Audit & Lifecycle
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[#828BAA] block mb-1">Account Status</span>
                    <StatusBadge isDeleted={employee.isDeleted} />
                  </div>

                  <div>
                    <span className="text-[#828BAA] block mb-1">Created At</span>
                    <span className="text-[#505B85] flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#828BAA]" />
                      {new Date(employee.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#828BAA] block mb-1">Last Updated</span>
                    <span className="text-[#505B85] flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#828BAA]" />
                      {new Date(employee.updatedAt).toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#828BAA] block mb-1">Database Object ID</span>
                    <span className="font-mono text-[11px] text-[#828BAA]">
                      {employee._id}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Role Permissions Matrix */}
            <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E4F2] p-6 shadow-xs">
              <h3 className="text-sm font-bold text-[#122056] pb-3 border-b border-[#E2E4F2]">
                Role Capabilities ({employee.role})
              </h3>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-[#FAFAFD] border border-[#E2E4F2]">
                  <p className="font-semibold text-[#122056] mb-1">View Directory</p>
                  <p className="text-[#059669] flex items-center gap-1 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" /> Allowed
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAFAFD] border border-[#E2E4F2]">
                  <p className="font-semibold text-[#122056] mb-1">Create Employees</p>
                  {employee.role === 'Admin' || employee.role === 'Manager' ? (
                    <p className="text-[#059669] flex items-center gap-1 font-medium">
                      <CheckCircle className="w-3.5 h-3.5" /> Allowed
                    </p>
                  ) : (
                    <p className="text-[#DC2626] flex items-center gap-1 font-medium">
                      <XCircle className="w-3.5 h-3.5" /> Restricted
                    </p>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAFAFD] border border-[#E2E4F2]">
                  <p className="font-semibold text-[#122056] mb-1">Soft Delete & Restore</p>
                  {employee.role === 'Admin' ? (
                    <p className="text-[#059669] flex items-center gap-1 font-medium">
                      <CheckCircle className="w-3.5 h-3.5" /> Allowed (Admin Only)
                    </p>
                  ) : (
                    <p className="text-[#DC2626] flex items-center gap-1 font-medium">
                      <XCircle className="w-3.5 h-3.5" /> Restricted
                    </p>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAFAFD] border border-[#E2E4F2]">
                  <p className="font-semibold text-[#122056] mb-1">Company Settings</p>
                  {employee.role === 'Admin' ? (
                    <p className="text-[#059669] flex items-center gap-1 font-medium">
                      <CheckCircle className="w-3.5 h-3.5" /> Allowed (Admin Only)
                    </p>
                  ) : (
                    <p className="text-[#DC2626] flex items-center gap-1 font-medium">
                      <XCircle className="w-3.5 h-3.5" /> Restricted
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {employee && (
        <EmployeeModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          userToEdit={employee}
          onSuccess={(updated) => {
            setEmployee(updated);
            setFeedback({
              type: 'success',
              message: `Employee "${updated.name}" updated successfully.`,
            });
          }}
        />
      )}

      {/* Soft Delete Modal */}
      {employee && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          user={employee}
          onSuccess={(deleted) => {
            setEmployee(deleted);
            setFeedback({
              type: 'success',
              message: `Employee "${deleted.name}" has been soft-deleted.`,
            });
          }}
        />
      )}
    </AppShell>
  );
}
