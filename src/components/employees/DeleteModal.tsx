'use client';

import React, { useState } from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';
import { IUser } from '@/types';
import { userApi } from '@/lib/api';
import { AlertBanner } from '@/components/common/Toast';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (deletedUser: IUser) => void;
  user: IUser | null;
}

export function DeleteModal({ isOpen, onClose, onSuccess, user }: DeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);
    try {
      const res = await userApi.deleteUser(user._id);
      onSuccess(res.data);
      onClose();
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || 'Failed to soft-delete employee');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-[#FFFFFF] rounded-2xl border border-[#E2E4F2] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E4F2]">
          <div className="flex items-center gap-2.5 text-[#DC2626]">
            <div className="p-2 rounded-lg bg-[#FEF2F2]">
              <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
            </div>
            <h3 className="text-base font-bold text-[#122056]">Soft Delete Employee</h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded-md text-[#828BAA] hover:text-[#122056] hover:bg-[#EEEFFD] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && <AlertBanner type="error" message={error} onClose={() => setError(null)} />}

          <p className="text-sm text-[#505B85] leading-relaxed">
            Are you sure you want to deactivate and soft-delete{' '}
            <strong className="text-[#122056] font-semibold">{user.name}</strong> ({user.email})?
          </p>

          <div className="p-3.5 rounded-lg bg-[#FAFAFD] border border-[#E2E4F2] text-xs text-[#828BAA] space-y-1">
            <p className="font-semibold text-[#122056]">Soft-Delete Policy:</p>
            <p>
              • The employee will be marked as inactive (<code className="text-[#5B65DC]">isDeleted: true</code>).
            </p>
            <p>• They will no longer be able to log in to this workspace.</p>
            <p>• Historical database records are preserved and can be restored anytime by an Admin.</p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E4F2]">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 rounded-lg border border-[#E2E4F2] text-[#505B85] text-sm font-medium hover:bg-[#FAFAFD] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-[#FFFFFF] text-sm font-semibold shadow-xs disabled:opacity-50 transition-colors"
            >
              {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Confirm Soft Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
