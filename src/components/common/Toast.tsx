import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose?: () => void;
  className?: string;
}

export function AlertBanner({ type, message, onClose, className = '' }: AlertProps) {
  if (!message) return null;

  const styles = {
    success: 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]',
    error: 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]',
    info: 'bg-[#EEEFFD] border-[#C5CAFA] text-[#122056]',
  }[type];

  const Icon = {
    success: CheckCircle2,
    error: AlertCircle,
    info: AlertCircle,
  }[type];

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-3.5 rounded-lg border text-sm transition-all ${styles} ${className}`}
    >
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <span className="flex-1 font-medium leading-relaxed">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          aria-label="Dismiss alert"
          className="p-1 hover:opacity-75 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
