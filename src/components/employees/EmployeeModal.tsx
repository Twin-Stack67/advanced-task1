'use client';

import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Loader2 } from 'lucide-react';
import { IUser, UserRole } from '@/types';
import { userApi } from '@/lib/api';
import { AlertBanner } from '@/components/common/Toast';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (savedUser: IUser) => void;
  userToEdit?: IUser | null;
}

export function EmployeeModal({
  isOpen,
  onClose,
  onSuccess,
  userToEdit,
}: EmployeeModalProps) {
  const isEditing = !!userToEdit;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Employee');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name || '');
      setEmail(userToEdit.email || '');
      setRole(userToEdit.role || 'Employee');
      setPassword('');
    } else {
      setName('');
      setEmail('');
      setPassword('');
      setRole('Employee');
    }
    setError(null);
  }, [userToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validations
    if (!name.trim()) {
      setError('Please provide an employee name');
      return;
    }

    if (!email.trim()) {
      setError('Please provide a valid email');
      return;
    }

    if (!isEditing && (!password || password.length < 6)) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (isEditing && password && password.length < 6) {
      setError('Password must be at least 6 characters long if you wish to change it');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && userToEdit) {
        const payload: { name: string; email: string; role: UserRole; password?: string } = {
          name: name.trim(),
          email: email.trim(),
          role,
        };
        if (password) {
          payload.password = password;
        }
        const res = await userApi.updateUser(userToEdit._id, payload);
        onSuccess(res.data);
      } else {
        const res = await userApi.createUser({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
        });
        onSuccess(res.data);
      }
      onClose();
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || 'An error occurred while saving employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-[#FFFFFF] rounded-2xl border border-[#E2E4F2] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E4F2]">
          <h3 className="text-base font-bold text-[#122056]">
            {isEditing ? 'Update Employee' : 'Add New Employee'}
          </h3>
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded-md text-[#828BAA] hover:text-[#122056] hover:bg-[#EEEFFD] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <AlertBanner type="error" message={error} onClose={() => setError(null)} />}

          <div>
            <label className="block text-xs font-semibold text-[#122056] mb-1.5">
              Full Name <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2E4F2] bg-[#FFFFFF] text-[#122056] text-sm focus:outline-none focus:border-[#5B65DC] focus:ring-2 focus:ring-[#5B65DC]/20 transition-all placeholder:text-[#828BAA]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#122056] mb-1.5">
              Email Address <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. employee@company.com"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2E4F2] bg-[#FFFFFF] text-[#122056] text-sm focus:outline-none focus:border-[#5B65DC] focus:ring-2 focus:ring-[#5B65DC]/20 transition-all placeholder:text-[#828BAA]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#122056] mb-1.5">
              Role <span className="text-[#DC2626]">*</span>
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2E4F2] bg-[#FFFFFF] text-[#122056] text-sm focus:outline-none focus:border-[#5B65DC] focus:ring-2 focus:ring-[#5B65DC]/20 transition-all"
            >
              <option value="Employee">Employee (Standard Access)</option>
              <option value="Manager">Manager (Directory Administration)</option>
              <option value="Admin">Admin (Full Workspace Control)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#122056] mb-1.5">
              {isEditing ? 'New Password (Optional)' : 'Password'}{' '}
              {!isEditing && <span className="text-[#DC2626]">*</span>}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required={!isEditing}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isEditing ? 'Leave blank to retain current password' : 'Min. 6 characters'}
                className="w-full pl-3.5 pr-10 py-2.5 rounded-lg border border-[#E2E4F2] bg-[#FFFFFF] text-[#122056] text-sm focus:outline-none focus:border-[#5B65DC] focus:ring-2 focus:ring-[#5B65DC]/20 transition-all placeholder:text-[#828BAA]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#828BAA] hover:text-[#122056]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {isEditing && (
              <p className="mt-1 text-[11px] text-[#828BAA]">
                Only enter a password if you want to update it.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E4F2]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg border border-[#E2E4F2] text-[#505B85] text-sm font-medium hover:bg-[#FAFAFD] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-[#5B65DC] hover:bg-[#4852c9] text-[#FFFFFF] text-sm font-semibold shadow-xs disabled:opacity-50 transition-colors"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isEditing ? 'Save Changes' : 'Create Employee'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
