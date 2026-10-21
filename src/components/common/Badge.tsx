import React from 'react';
import { UserRole } from '@/types';

interface BadgeProps {
  role?: UserRole;
  isDeleted?: boolean;
  className?: string;
}

export function RoleBadge({ role, className = '' }: { role: UserRole; className?: string }) {
  const getStyles = () => {
    switch (role) {
      case 'Admin':
        return 'bg-[#122056] text-[#FFFFFF] border border-[#122056]';
      case 'Manager':
        return 'bg-[#EEEFFD] text-[#5B65DC] border border-[#C5CAFA] font-semibold';
      case 'Employee':
        return 'bg-[#F1F3F9] text-[#243575] border border-[#E2E4F2]';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide ${getStyles()} ${className}`}
    >
      {role}
    </span>
  );
}

export function StatusBadge({ isDeleted }: { isDeleted: boolean }) {
  if (isDeleted) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
        Soft Deleted
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
      Active
    </span>
  );
}
