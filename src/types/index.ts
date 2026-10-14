export type UserRole = 'Admin' | 'Manager' | 'Employee';

export type UserStatus = 'Active' | 'Inactive' | 'Deactivated';

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  department: string;
  title: string;
  lastActive: string;
  avatarUrl?: string;
  initials: string;
  avatarBg?: string;
  avatarText?: string;
  deactivationReason?: string;
  deactivatedAt?: string;
  deactivatedBy?: string;
}

export interface TenantInfo {
  id: string;
  name: string;
  slug: string;
  region: string;
  databaseCluster: string;
  status: 'Active' | 'Provisioning' | 'Suspended';
  tier: string;
  employeeCount: number;
  activeSeats: number;
}

export interface AuditEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  tag: string;
  category: 'role' | 'invite' | 'security' | 'login' | 'profile';
  badgeColor?: string;
}
