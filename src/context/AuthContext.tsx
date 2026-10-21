'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { IUser } from '@/types';
import {
  clearStoredAuth,
  getStoredToken,
  getStoredUser,
  setStoredAuth,
  userApi,
} from '@/lib/api';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: IUser) => void;
  logout: () => void;
  updateUser: (user: IUser) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load session from localStorage on mount
  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((newToken: string, newUser: IUser) => {
    setStoredAuth(newToken, newUser);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    clearStoredAuth();
    setToken(null);
    setUser(null);
    router.push('/login');
  }, [router]);

  const updateUser = useCallback((updatedUser: IUser) => {
    setUser(updatedUser);
    const currentToken = getStoredToken();
    if (currentToken) {
      setStoredAuth(currentToken, updatedUser);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!user?._id) return;
    try {
      const res = await userApi.getUserById(user._id);
      if (res.data) {
        updateUser(res.data);
      }
    } catch (err) {
      console.warn('Failed to refresh user profile:', err);
    }
  }, [user?._id, updateUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
