"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Employee, TenantInfo, AuditEvent } from "@/types";

interface TenantContextType {
  currentTenant: TenantInfo;
  availableTenants: TenantInfo[];
  switchTenant: (id: string) => void;
  employees: Employee[];
  addUser: (newEmp: Omit<Employee, "id">) => void;
  updateUser: (id: string, updates: Partial<Employee>) => void;
  softDeleteUser: (id: string, reason: string) => void;
  reactivateUser: (id: string) => void;
  auditEvents: AuditEvent[];
  toastMessage: string | null;
  showToast: (msg: string) => void;
  hideToast: () => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
}

const defaultTenants: TenantInfo[] = [
  {
    id: "acme_prod_9821",
    name: "Acme Corp",
    slug: "acme",
    region: "US-East-1",
    databaseCluster: "us-east-acme-prod",
    status: "Active",
    tier: "Tier 1 Enterprise",
    employeeCount: 148,
    activeSeats: 142,
  },
  {
    id: "novasystems_dev_314",
    name: "Nova Systems",
    slug: "novasystems",
    region: "US-West-2",
    databaseCluster: "us-west-nova-prod",
    status: "Active",
    tier: "Tier 2 Business",
    employeeCount: 64,
    activeSeats: 60,
  },
  {
    id: "vertex_ops_552",
    name: "Vertex Logistics",
    slug: "vertexlogistics",
    region: "EU-Central-1",
    databaseCluster: "eu-central-vertex-prod",
    status: "Active",
    tier: "Tier 1 Enterprise",
    employeeCount: 220,
    activeSeats: 212,
  },
];

const initialEmployees: Employee[] = [
  {
    id: "EMP-1001",
    name: "Sarah Jenkins",
    email: "sarah.j@acmecorp.com",
    role: "Admin",
    status: "Active",
    department: "Engineering",
    title: "VP of Technology",
    lastActive: "10 mins ago",
    avatarUrl: "/images/sarah-jenkins.png",
    initials: "SJ",
  },
  {
    id: "EMP-1014",
    name: "Marcus Rodriguez",
    email: "m.rodriguez@acmecorp.com",
    role: "Manager",
    status: "Active",
    department: "Engineering",
    title: "Engineering Lead",
    lastActive: "2 hours ago",
    avatarUrl: "/images/marcus-rodriguez.png",
    initials: "MR",
  },
  {
    id: "EMP-1022",
    name: "Priya Sharma",
    email: "priya.s@acmecorp.com",
    role: "Manager",
    status: "Active",
    department: "Product & Design",
    title: "Product Operations Lead",
    lastActive: "Yesterday",
    avatarUrl: "/images/priya-sharma.png",
    initials: "PS",
  },
  {
    id: "EMP-1035",
    name: "David Chen",
    email: "d.chen@acmecorp.com",
    role: "Employee",
    status: "Active",
    department: "Engineering",
    title: "Full-stack Engineer",
    lastActive: "3 days ago",
    initials: "DC",
    avatarBg: "bg-surface-container-high",
    avatarText: "text-on-surface",
  },
  {
    id: "EMP-1049",
    name: "Elena Rostova",
    email: "elena.r@acmecorp.com",
    role: "Employee",
    status: "Deactivated",
    department: "Product & Design",
    title: "Former QA Analyst",
    lastActive: "2 weeks ago",
    avatarUrl: "/images/elena-rostova.png",
    initials: "ER",
    deactivationReason: "Employee left company",
    deactivatedAt: "Nov 02, 2024 at 14:38:12 UTC",
    deactivatedBy: "Sarah Jenkins (Admin)",
  },
  {
    id: "EMP-1056",
    name: "James Wilson",
    email: "j.wilson@acmecorp.com",
    role: "Employee",
    status: "Active",
    department: "Operations",
    title: "Security Compliance",
    lastActive: "5 hours ago",
    initials: "JW",
    avatarBg: "bg-secondary-fixed",
    avatarText: "text-on-secondary-fixed",
  },
  {
    id: "EMP-1062",
    name: "Liam Gallagher",
    email: "liam.g@acmecorp.com",
    role: "Manager",
    status: "Active",
    department: "Engineering",
    title: "Staff Infrastructure",
    lastActive: "1 day ago",
    initials: "LG",
    avatarBg: "bg-primary-fixed",
    avatarText: "text-on-primary-fixed-variant",
  },
  {
    id: "EMP-1070",
    name: "Amina Zaid",
    email: "amina.z@acmecorp.com",
    role: "Employee",
    status: "Inactive",
    department: "Operations",
    title: "Operations Specialist",
    lastActive: "4 days ago",
    initials: "AZ",
    avatarBg: "bg-tertiary-fixed",
    avatarText: "text-on-tertiary-fixed",
  },
];

const initialAuditEvents: AuditEvent[] = [
  {
    id: "audit-1",
    title: "Alex Rivera assigned Manager role",
    description: "Role elevated to Manager by Sarah Jenkins",
    timestamp: "14 minutes ago",
    actor: "Sarah Jenkins",
    tag: "sec_audit_8812",
    category: "role",
  },
  {
    id: "audit-2",
    title: "David Chen invited to Engineering",
    description: "Pending tenant invite link acceptance",
    timestamp: "42 minutes ago",
    actor: "Marcus Rodriguez",
    tag: "tenant_inv_441",
    category: "invite",
  },
  {
    id: "audit-3",
    title: "Elena Rostova status changed to Deactivated (Soft Deleted)",
    description: "Schema integrity preserved under SOC-2 policy",
    timestamp: "2 hours ago",
    actor: "Sarah Jenkins",
    tag: "sec_audit_8790",
    category: "security",
  },
  {
    id: "audit-4",
    title: "Marcus Vance logged in via SSO SAML2",
    description: "IP: 198.51.100.44 (San Francisco, CA)",
    timestamp: "3 hours ago",
    actor: "Marcus Vance",
    tag: "auth_sso_109",
    category: "login",
  },
  {
    id: "audit-5",
    title: "Sophia Patel updated emergency contacts and team bio",
    description: "Direct employee self-service portal update",
    timestamp: "5 hours ago",
    actor: "Sophia Patel",
    tag: "self_serv_202",
    category: "profile",
  },
];

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [currentTenant, setCurrentTenant] = useState<TenantInfo>(defaultTenants[0]);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(initialAuditEvents);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const hideToast = () => {
    setToastMessage(null);
  };

  const switchTenant = (id: string) => {
    const found = defaultTenants.find((t) => t.id === id);
    if (found) {
      setCurrentTenant(found);
      showToast(`Switched workspace to ${found.name}`);
    }
  };

  const addUser = (newEmp: Omit<Employee, "id">) => {
    const id = `EMP-${1080 + employees.length}`;
    const initials = newEmp.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

    const created: Employee = {
      ...newEmp,
      id,
      initials: initials || "EU",
      lastActive: "Just now",
      avatarBg: "bg-surface-container-high",
      avatarText: "text-primary",
    };

    setEmployees((prev) => [created, ...prev]);

    const newAudit: AuditEvent = {
      id: `audit-${Date.now()}`,
      title: `${created.name} provisioned as ${created.role}`,
      description: `New employee seat assigned to ${currentTenant.name} database sandbox`,
      timestamp: "Just now",
      actor: "Sarah Jenkins",
      tag: `emp_prov_${id.toLowerCase()}`,
      category: "invite",
    };

    setAuditEvents((prev) => [newAudit, ...prev]);
    showToast(`Successfully provisioned ${created.name} (${id})`);
  };

  const updateUser = (id: string, updates: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, ...updates } : emp))
    );
    showToast(`Updated employee details`);
  };

  const softDeleteUser = (id: string, reason: string) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === id) {
          return {
            ...emp,
            status: "Deactivated",
            deactivationReason: reason,
            deactivatedAt: "Just now",
            deactivatedBy: "Sarah Jenkins (Admin)",
          };
        }
        return emp;
      })
    );

    const emp = employees.find((e) => e.id === id);
    const targetName = emp ? emp.name : id;

    const newAudit: AuditEvent = {
      id: `audit-${Date.now()}`,
      title: `${targetName} deactivated (Soft Deleted)`,
      description: `Reason: ${reason}. Tokens revoked.`,
      timestamp: "Just now",
      actor: "Sarah Jenkins",
      tag: `soft_del_${id.toLowerCase()}`,
      category: "security",
    };

    setAuditEvents((prev) => [newAudit, ...prev]);
    showToast(`Employee ${targetName} has been soft-deleted and access revoked.`);
  };

  const reactivateUser = (id: string) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === id) {
          return {
            ...emp,
            status: "Active",
            lastActive: "Reactivated just now",
          };
        }
        return emp;
      })
    );

    const emp = employees.find((e) => e.id === id);
    const targetName = emp ? emp.name : id;

    const newAudit: AuditEvent = {
      id: `audit-${Date.now()}`,
      title: `${targetName} reactivated`,
      description: `Reactivated tenant seat and restored privileges`,
      timestamp: "Just now",
      actor: "Sarah Jenkins",
      tag: `restore_${id.toLowerCase()}`,
      category: "role",
    };

    setAuditEvents((prev) => [newAudit, ...prev]);
    showToast(`Reactivated ${targetName} successfully.`);
  };

  return (
    <TenantContext.Provider
      value={{
        currentTenant,
        availableTenants: defaultTenants,
        switchTenant,
        employees,
        addUser,
        updateUser,
        softDeleteUser,
        reactivateUser,
        auditEvents,
        toastMessage,
        showToast,
        hideToast,
        sidebarCollapsed,
        setSidebarCollapsed,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}
