'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  RefreshCw,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  ArrowUpDown,
  Trash2,
  Edit2,
  ExternalLink,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/context/AuthContext';
import { userApi } from '@/lib/api';
import { IUser, PaginationMeta, UserRole } from '@/types';
import { RoleBadge } from '@/components/common/Badge';
import { AlertBanner } from '@/components/common/Toast';
import { EmployeeModal } from '@/components/employees/EmployeeModal';
import { DeleteModal } from '@/components/employees/DeleteModal';

export default function EmployeesPage() {
  const { user: currentUser } = useAuth();

  const [employees, setEmployees] = useState<IUser[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    totalUsers: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<IUser | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);

  const fetchEmployees = useCallback(
    async (pageToLoad = 1) => {
      setIsLoading(true);
      try {
        const res = await userApi.getUsers({
          page: pageToLoad,
          limit: pagination.limit,
          search: searchTerm.trim() || undefined,
          role: (selectedRole as UserRole) || undefined,
          sortBy,
          sortOrder,
        });

        if (res.data) {
          setEmployees(res.data);
        }
        if (res.pagination) {
          setPagination(res.pagination);
        }
      } catch (err: unknown) {
        const e = err as { message?: string };
        setFeedback({
          type: 'error',
          message: e.message || 'Failed to retrieve employee directory.',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [pagination.limit, searchTerm, selectedRole, sortBy, sortOrder]
  );

  // Trigger fetch when filter or sort criteria change
  useEffect(() => {
    fetchEmployees(1);
  }, [searchTerm, selectedRole, sortBy, sortOrder]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchEmployees(newPage);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination((prev) => ({ ...prev, limit: newLimit }));
    // useEffect will refetch due to limit update
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const canManage = currentUser?.role === 'Admin' || currentUser?.role === 'Manager';
  const isAdmin = currentUser?.role === 'Admin';

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#122056]">
              Employee Directory
            </h1>
            <p className="text-sm text-[#505B85] mt-1">
              Manage enterprise directory members, roles, and partition assignments
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => fetchEmployees(pagination.currentPage)}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E2E4F2] bg-[#FFFFFF] text-xs font-semibold text-[#505B85] hover:bg-[#FAFAFD] hover:text-[#122056] transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            {canManage && (
              <button
                onClick={() => {
                  setUserToEdit(null);
                  setIsAddEditModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#5B65DC] hover:bg-[#4852c9] text-xs font-semibold text-[#FFFFFF] shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Employee</span>
              </button>
            )}
          </div>
        </div>

        {feedback && (
          <AlertBanner
            type={feedback.type}
            message={feedback.message}
            onClose={() => setFeedback(null)}
          />
        )}

        {/* Filter & Search Bar */}
        <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#E2E4F2] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-[#E2E4F2] bg-[#FFFFFF] text-xs text-[#122056] focus:outline-none focus:border-[#5B65DC] focus:ring-2 focus:ring-[#5B65DC]/20 transition-all placeholder:text-[#828BAA]"
            />
            <Search className="w-4 h-4 text-[#828BAA] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            {/* Role Filter */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 rounded-lg border border-[#E2E4F2] bg-[#FFFFFF] text-xs font-medium text-[#122056] focus:outline-none focus:border-[#5B65DC] transition-all"
            >
              <option value="">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Employee">Employee</option>
            </select>

            {/* Rows Per Page */}
            <select
              value={pagination.limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="px-3 py-2 rounded-lg border border-[#E2E4F2] bg-[#FFFFFF] text-xs font-medium text-[#122056] focus:outline-none focus:border-[#5B65DC] transition-all"
            >
              <option value={5}>5 / page</option>
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </div>
        </div>

        {/* Employees Table */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E4F2] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAFAFD] border-b border-[#E2E4F2] text-[11px] font-bold uppercase tracking-wider text-[#505B85]">
                  <th
                    className="py-3.5 px-4 sm:px-6 cursor-pointer hover:text-[#122056] transition-colors"
                    onClick={() => toggleSort('name')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Employee</span>
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-[#122056] transition-colors"
                    onClick={() => toggleSort('role')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Role</span>
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-[#122056] transition-colors hidden md:table-cell"
                    onClick={() => toggleSort('createdAt')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Joined Date</span>
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E4F2] text-xs">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-[#828BAA]">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin text-[#5B65DC]" />
                        <span>Loading active employee records...</span>
                      </div>
                    </td>
                  </tr>
                ) : employees.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-[#828BAA]">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <UserPlus className="w-8 h-8 text-[#C5CAFA]" />
                        <span className="font-semibold text-sm text-[#122056]">
                          No employees matched your criteria
                        </span>
                        <p className="text-xs text-[#828BAA]">
                          Try adjusting your search query or role filter.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  employees.map((emp) => (
                    <tr
                      key={emp._id}
                      className="hover:bg-[#FAFAFD] transition-colors"
                    >
                      {/* Name & Email */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#EEEFFD] text-[#5B65DC] flex items-center justify-center font-bold text-xs shrink-0 border border-[#C5CAFA]">
                            {emp.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/employees/${emp._id}`}
                              className="font-semibold text-[#122056] hover:text-[#5B65DC] block truncate"
                            >
                              {emp.name}
                            </Link>
                            <span className="text-[11px] text-[#828BAA] block truncate">
                              {emp.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4">
                        <RoleBadge role={emp.role} />
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 text-[#505B85] hidden md:table-cell">
                        {new Date(emp.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Link
                            href={`/employees/${emp._id}`}
                            title="View Employee Profile"
                            className="p-1.5 rounded-lg text-[#505B85] hover:text-[#5B65DC] hover:bg-[#EEEFFD] transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          {canManage && (
                            <button
                              onClick={() => {
                                setUserToEdit(emp);
                                setIsAddEditModalOpen(true);
                              }}
                              title="Edit Employee"
                              className="p-1.5 rounded-lg text-[#505B85] hover:text-[#5B65DC] hover:bg-[#EEEFFD] transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}

                          {isAdmin && (
                            <button
                              onClick={() => {
                                setUserToDelete(emp);
                                setIsDeleteModalOpen(true);
                              }}
                              title="Soft Delete Employee"
                              className="p-1.5 rounded-lg text-[#828BAA] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {!isLoading && pagination.totalUsers > 0 && (
            <div className="px-4 sm:px-6 py-3.5 bg-[#FAFAFD] border-t border-[#E2E4F2] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#505B85]">
              <div>
                Showing{' '}
                <span className="font-semibold text-[#122056]">
                  {(pagination.currentPage - 1) * pagination.limit + 1}
                </span>{' '}
                to{' '}
                <span className="font-semibold text-[#122056]">
                  {Math.min(
                    pagination.currentPage * pagination.limit,
                    pagination.totalUsers
                  )}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-[#122056]">
                  {pagination.totalUsers}
                </span>{' '}
                directory members
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage <= 1}
                  className="p-1.5 rounded-lg border border-[#E2E4F2] bg-[#FFFFFF] text-[#505B85] hover:bg-[#FAFAFD] disabled:opacity-40 disabled:hover:bg-[#FFFFFF] transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="px-3 py-1 font-semibold text-[#122056]">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage >= pagination.totalPages}
                  className="p-1.5 rounded-lg border border-[#E2E4F2] bg-[#FFFFFF] text-[#505B85] hover:bg-[#FAFAFD] disabled:opacity-40 disabled:hover:bg-[#FFFFFF] transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Employee Modal */}
      <EmployeeModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setUserToEdit(null);
        }}
        userToEdit={userToEdit}
        onSuccess={(savedUser) => {
          setFeedback({
            type: 'success',
            message: `Employee "${savedUser.name}" saved successfully.`,
          });
          fetchEmployees(pagination.currentPage);
        }}
      />

      {/* Soft Delete Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        user={userToDelete}
        onSuccess={(deletedUser) => {
          setFeedback({
            type: 'success',
            message: `Employee "${deletedUser.name}" has been soft-deleted.`,
          });
          fetchEmployees(pagination.currentPage);
        }}
      />
    </AppShell>
  );
}
