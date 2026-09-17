'use client';

import { useState, useCallback } from 'react';
import { useAuthStore } from '@/lib/stores/auth.store';
import { getUserPermissions } from '@/lib/api/user.api';
import { createMockPermissionsForUser, createMockUser } from '@/lib/utils/mock-auth';

export function useAuth() {
  const { user, permissions, isAuthenticated, setPermissions, login: loginUser, logout: logoutUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (username: string, _password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const mockUser = createMockUser(username);
      const mockPermissions = createMockPermissionsForUser(username);

      loginUser(mockUser, mockPermissions);

      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', 'mock_token');
      }

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, [loginUser]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      logoutUser();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [logoutUser]);

  const refreshPermissions = useCallback(async () => {
    if (!user) return;

    try {
      const perms = await getUserPermissions(user.hrmsId, user.username, user.username);
      setPermissions(perms);
    } catch (err) {
      console.error('Failed to refresh permissions:', err);
    }
  }, [user, setPermissions]);

  return {
    user,
    permissions,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    refreshPermissions,
  };
}
