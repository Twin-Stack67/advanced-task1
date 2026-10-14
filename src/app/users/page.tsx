"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AddEditUserModal from "@/components/modals/AddEditUserModal";
import SoftDeleteModal from "@/components/modals/SoftDeleteModal";
import { Employee, UserRole, UserStatus } from "@/types";
import { useTenant } from "@/context/TenantContext";

export default function UsersPage() {
  const { currentTenant, employees, reactivateUser, showToast } = useTenant();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [deptFilter, setDeptFilter] = useState<string>("ALL");

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isSoftDeleteOpen, setIsSoftDeleteOpen] = useState(false);
  const [targetEmployee, setTargetEmployee] = useState<Employee | null>(null);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        emp.name.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.role.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q);

      const matchesRole = roleFilter === "ALL" || emp.role === roleFilter;
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "Deactivated"
          ? emp.status === "Deactivated"
          : emp.status === statusFilter);
      const matchesDept = deptFilter === "ALL" || emp.department === deptFilter;

      return matchesSearch && matchesRole && matchesStatus && matchesDept;
    });
  }, [employees, searchQuery, roleFilter, statusFilter, deptFilter]);

  // Pagination calculation
  const totalItems = filteredEmployees.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredEmployees.map((emp) => emp.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setRoleFilter("ALL");
    setStatusFilter("ALL");
    setDeptFilter("ALL");
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Email", "Role", "Status", "Department", "Title", "Last Active"];
    const rows = filteredEmployees.map((e) => [
      e.id,
      `"${e.name}"`,
      e.email,
      e.role,
      e.status,
      `"${e.department}"`,
      `"${e.title}"`,
      `"${e.lastActive}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${currentTenant.slug}_users_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filteredEmployees.length} employee records to CSV`);
  };

  const openAddModal = () => {
    setEditingEmployee(null);
    setIsAddEditOpen(true);
  };

  const openEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setIsAddEditOpen(true);
  };

  const openDeactivateModal = (emp: Employee) => {
    setTargetEmployee(emp);
    setIsSoftDeleteOpen(true);
  };

  // Metric counts
  const totalCount = employees.length;
  const activeCount = employees.filter((e) => e.status === "Active").length;
  const adminMgrCount = employees.filter(
    (e) => e.role === "Admin" || e.role === "Manager"
  ).length;
  const deactivatedCount = employees.filter(
    (e) => e.status === "Deactivated"
  ).length;

  return (
    <DashboardLayout pageTitle="User Management">
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-[1520px] w-full mx-auto flex flex-col gap-6">
        {/* Header & Global Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-on-surface-variant font-mono text-xs">
              <span className="font-semibold text-secondary">TENANT //</span>
              <span className="text-primary font-bold tracking-wide">
                {currentTenant.id}
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span className="text-secondary">AUTH_REALM: {currentTenant.region.toUpperCase()}</span>
            </div>
            <h1 className="font-headline font-bold text-2xl sm:text-3xl text-on-surface tracking-tight">
              User Management
            </h1>
            <p className="text-sm text-on-surface-variant">
              Manage company employees, assign permissions, and control access within {currentTenant.name}.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleExportCSV}
              type="button"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-lowest text-on-surface text-xs font-semibold shadow-sm hover:bg-surface-container border border-outline-variant/30 transition-all"
            >
              <span className="material-symbols-outlined text-[17px] text-secondary">upload_file</span>
              <span>Export CSV</span>
            </button>

            <button
              onClick={openAddModal}
              type="button"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold shadow-md transition-all"
            >
              <span className="material-symbols-outlined text-[17px]">person_add</span>
              <span>+ Add New User</span>
            </button>
          </div>
        </div>

        {/* Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                Total Headcount
              </span>
              <span className="font-headline font-bold text-2xl text-on-surface mt-1">
                {totalCount}
              </span>
              <span className="text-[11px] text-secondary mt-0.5">Scoped to tenant sandbox</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-fixed">
              <span className="material-symbols-outlined text-[20px]">groups</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                Active Seats
              </span>
              <span className="font-headline font-bold text-2xl text-on-surface mt-1">
                {activeCount}
              </span>
              <span className="text-[11px] text-primary font-semibold mt-0.5">
                {Math.round((activeCount / (totalCount || 1)) * 100)}% allocation
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                Admin &amp; Mgrs
              </span>
              <span className="font-headline font-bold text-2xl text-on-surface mt-1">
                {adminMgrCount}
              </span>
              <span className="text-[11px] text-on-surface-variant mt-0.5">Elevated clearance</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed-variant">
              <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                Deactivated
              </span>
              <span className="font-headline font-bold text-2xl text-on-surface mt-1">
                {deactivatedCount}
              </span>
              <span className="text-[11px] text-secondary mt-0.5">Soft-retained records</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-error-container flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-[20px]">person_off</span>
            </div>
          </div>
        </div>

        {/* Filters & Toolbar Container */}
        <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex flex-col gap-3">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[280px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by employee name, email or role..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-container-low text-on-surface text-xs border border-outline-variant/30 focus:outline-none focus:bg-surface-container focus:border-primary transition-all placeholder:text-outline"
              />
            </div>

            {/* Filter Selectors */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Role Filter */}
              <div className="relative">
                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="appearance-none pl-3 pr-7 py-2 rounded-xl bg-surface-container-low text-on-surface text-xs border border-outline-variant/30 focus:outline-none cursor-pointer hover:bg-surface-container transition-colors"
                >
                  <option value="ALL">All Roles</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Employee">Employee</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[16px]">
                  expand_more
                </span>
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="appearance-none pl-3 pr-7 py-2 rounded-xl bg-surface-container-low text-on-surface text-xs border border-outline-variant/30 focus:outline-none cursor-pointer hover:bg-surface-container transition-colors"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Deactivated">Deactivated / Soft-Deleted</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[16px]">
                  expand_more
                </span>
              </div>

              {/* Department Filter */}
              <div className="relative">
                <select
                  value={deptFilter}
                  onChange={(e) => {
                    setDeptFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="appearance-none pl-3 pr-7 py-2 rounded-xl bg-surface-container-low text-on-surface text-xs border border-outline-variant/30 focus:outline-none cursor-pointer hover:bg-surface-container transition-colors"
                >
                  <option value="ALL">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Product & Design">Product &amp; Design</option>
                  <option value="Operations">Operations</option>
                  <option value="Customer Success">Customer Success</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[16px]">
                  expand_more
                </span>
              </div>

              {/* Reset Button */}
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container text-xs font-medium transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Active Selection Info Bar */}
          {selectedIds.length > 0 && (
            <div className="flex items-center justify-between p-2 px-3.5 rounded-xl bg-surface-container-high border border-outline-variant/30 transition-all">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  check_box
                </span>
                <span className="text-xs text-on-surface">
                  <strong className="font-bold">{selectedIds.length}</strong> users selected across this partition
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => showToast(`Bulk role updated for ${selectedIds.length} users`)}
                  className="px-2.5 py-1 rounded-lg bg-surface-container-lowest text-on-surface text-[11px] font-semibold shadow-sm hover:bg-surface-container transition-colors"
                >
                  Bulk Role Change
                </button>
                <button
                  type="button"
                  onClick={() => showToast(`Invitations resent to ${selectedIds.length} users`)}
                  className="px-2.5 py-1 rounded-lg bg-surface-container-lowest text-on-surface text-[11px] font-semibold shadow-sm hover:bg-surface-container transition-colors"
                >
                  Resend Invitations
                </button>
                <button
                  type="button"
                  onClick={() => {
                    selectedIds.forEach((id) => reactivateUser(id));
                    setSelectedIds([]);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-error-container text-on-error-container text-[11px] font-semibold hover:bg-error hover:text-on-error transition-colors"
                >
                  Toggle Status
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Data Table Card Container */}
        <div className="rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-[11px] font-bold uppercase tracking-wider h-11 border-b border-outline-variant/20">
                  <th className="pl-5 pr-2 w-12 text-center" scope="col">
                    <input
                      type="checkbox"
                      checked={
                        paginatedEmployees.length > 0 &&
                        paginatedEmployees.every((e) => selectedIds.includes(e.id))
                      }
                      onChange={handleSelectAll}
                      className="rounded accent-primary cursor-pointer w-4 h-4 align-middle"
                    />
                  </th>
                  <th className="px-4 font-semibold" scope="col">Employee</th>
                  <th className="px-4 font-semibold" scope="col">Email</th>
                  <th className="px-4 font-semibold" scope="col">Role</th>
                  <th className="px-4 font-semibold" scope="col">Status</th>
                  <th className="px-4 font-semibold" scope="col">Last Active</th>
                  <th className="pr-6 pl-4 text-right font-semibold" scope="col">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-outline-variant/15 text-xs text-on-surface">
                {paginatedEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-secondary">
                      <span className="material-symbols-outlined text-3xl mb-2 block">person_search</span>
                      No employees match the selected filters.
                    </td>
                  </tr>
                ) : (
                  paginatedEmployees.map((emp) => {
                    const isSelected = selectedIds.includes(emp.id);
                    const isDeactivated = emp.status === "Deactivated";

                    return (
                      <tr
                        key={emp.id}
                        className={`hover:bg-surface-container-low/70 transition-colors group ${
                          isDeactivated ? "opacity-80" : ""
                        } ${isSelected ? "bg-primary-fixed/20" : ""}`}
                      >
                        <td className="pl-5 pr-2 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(emp.id)}
                            className="rounded accent-primary cursor-pointer w-4 h-4 align-middle"
                          />
                        </td>

                        {/* Employee Avatar + Info */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            {emp.avatarUrl ? (
                              <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-outline-variant/40 bg-surface-container">
                                <Image
                                  src={emp.avatarUrl}
                                  alt={emp.name}
                                  width={36}
                                  height={36}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            ) : (
                              <div
                                className={`w-9 h-9 rounded-full ${
                                  emp.avatarBg || "bg-surface-container-high"
                                } ${
                                  emp.avatarText || "text-on-surface"
                                } flex items-center justify-center font-bold text-xs shrink-0 border border-outline-variant/30`}
                              >
                                {emp.initials}
                              </div>
                            )}

                            <div className="flex flex-col min-w-0">
                              <span
                                className={`font-semibold text-on-surface truncate ${
                                  isDeactivated
                                    ? "line-through decoration-on-surface-variant text-secondary"
                                    : ""
                                }`}
                              >
                                {emp.name}
                              </span>
                              <span className="text-[11px] text-secondary truncate">
                                {emp.title} • {emp.department}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-4 py-3.5 font-mono text-[11px] text-on-surface-variant">
                          {emp.email}
                        </td>

                        {/* Role */}
                        <td className="px-4 py-3.5">
                          {emp.role === "Admin" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-bold">
                              <span className="material-symbols-outlined text-[13px]">shield_person</span>
                              Admin
                            </span>
                          )}
                          {emp.role === "Manager" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed-variant text-[11px] font-bold">
                              <span className="material-symbols-outlined text-[13px]">supervisor_account</span>
                              Manager
                            </span>
                          )}
                          {emp.role === "Employee" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-surface-container text-on-secondary-container text-[11px] font-semibold">
                              <span className="material-symbols-outlined text-[13px]">badge</span>
                              Employee
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5">
                          {emp.status === "Active" && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-surface-container text-on-surface text-[11px] font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Active
                            </span>
                          )}
                          {emp.status === "Inactive" && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-surface-container text-secondary text-[11px] font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                              Invited / Inactive
                            </span>
                          )}
                          {emp.status === "Deactivated" && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-error-container text-on-error-container text-[11px] font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                              Deactivated (Soft-Deleted)
                            </span>
                          )}
                        </td>

                        {/* Last Active */}
                        <td className="px-4 py-3.5 text-secondary">
                          <div className="flex items-center gap-1 text-[11px]">
                            <span className="material-symbols-outlined text-[14px] text-primary">
                              schedule
                            </span>
                            <span>{emp.lastActive}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="pr-6 pl-4 py-3.5 text-right">
                          <div className="inline-flex items-center gap-1">
                            {isDeactivated ? (
                              <>
                                <Link
                                  href={`/users/${emp.id.toLowerCase()}`}
                                  className="p-1.5 rounded-lg hover:bg-surface-container text-secondary hover:text-on-surface transition-colors"
                                  title="View Audit History"
                                >
                                  <span className="material-symbols-outlined text-[18px]">history</span>
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => reactivateUser(emp.id)}
                                  className="px-2 py-1 rounded-lg bg-secondary-container text-on-secondary-fixed text-[11px] font-semibold hover:bg-surface-container-high transition-colors"
                                  title="Reactivate Account"
                                >
                                  Reactivate
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => openEditModal(emp)}
                                  className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
                                  title="Edit"
                                >
                                  <span className="material-symbols-outlined text-[18px]">edit</span>
                                </button>

                                <Link
                                  href={`/users/${emp.id.toLowerCase()}`}
                                  className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
                                  title="View Details"
                                >
                                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                                </Link>

                                <button
                                  type="button"
                                  onClick={() => openDeactivateModal(emp)}
                                  className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-error transition-colors"
                                  title="Deactivate (Soft-Delete)"
                                >
                                  <span className="material-symbols-outlined text-[18px]">person_off</span>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-5 py-3.5 bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-outline-variant/20">
            <div className="flex items-center gap-4 text-xs text-on-surface-variant">
              <span>
                Showing <strong className="text-on-surface">{Math.min(startIndex + 1, totalItems)}</strong> to{" "}
                <strong className="text-on-surface">{Math.min(startIndex + rowsPerPage, totalItems)}</strong> of{" "}
                <strong className="text-on-surface">{totalItems}</strong> employees
              </span>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-secondary">Rows:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-0.5 rounded-lg bg-surface-container-lowest text-on-surface text-[11px] border border-outline-variant/30 focus:outline-none cursor-pointer"
                >
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>
            </div>

            {/* Page Buttons */}
            <div className="flex items-center gap-1 text-xs">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded-lg bg-surface-container-lowest text-secondary hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-40 border border-outline-variant/20"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setCurrentPage(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors ${
                    currentPage === p
                      ? "bg-primary text-on-primary shadow-sm"
                      : "bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/20"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 rounded-lg bg-surface-container-lowest text-secondary hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-40 border border-outline-variant/20"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Security & Isolation Footnote Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-surface-container text-on-surface-variant text-xs border border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-tertiary">lock</span>
            <span>
              Filtered strictly by Tenant ID:{" "}
              <strong className="font-mono text-on-surface font-semibold">{currentTenant.id}</strong>
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-secondary">
            <span>
              RLS (Row Level Security): <strong className="text-on-surface">ENFORCED</strong>
            </span>
            <span>
              Replication Latency: <strong className="text-on-surface">14ms</strong>
            </span>
            <span>
              Schema Version: <strong className="text-on-surface">v2.14.9</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      <AddEditUserModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        initialEmployee={editingEmployee}
      />

      {/* Soft Delete Modal */}
      <SoftDeleteModal
        isOpen={isSoftDeleteOpen}
        onClose={() => setIsSoftDeleteOpen(false)}
        employee={targetEmployee}
      />
    </DashboardLayout>
  );
}
