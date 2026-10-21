import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  subtitle?: string;
  highlight?: boolean;
}

export function StatCard({
  title,
  value,
  icon,
  subtitle,
  highlight = false,
}: StatCardProps) {
  return (
    <div
      className={`rounded-xl border p-5 transition-all bg-[#FFFFFF] ${
        highlight
          ? 'border-[#5B65DC] shadow-sm ring-1 ring-[#5B65DC]/10'
          : 'border-[#E2E4F2] shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[#505B85]">{title}</p>
        <div className="p-2.5 rounded-lg bg-[#EEEFFD] text-[#5B65DC]">
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <h3 className="text-2xl font-bold text-[#122056] tracking-tight">{value}</h3>
        {subtitle && (
          <p className="mt-1 text-xs text-[#828BAA]">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
