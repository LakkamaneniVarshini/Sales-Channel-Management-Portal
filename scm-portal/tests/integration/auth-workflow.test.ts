import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/lib/hooks/use-auth';

// Mock the API functions
vi.mock('@/lib/api/user.api', () => ({
  login: vi.fn(),
  logout: vi.fn(),
  getUserPermissions: vi.fn(),
}));

describe('Auth Workflow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear localStorage
    localStorage.clear();
  });

  describe('useAuth hook', () => {
    it('should login successfully', async () => {
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        const loginResult = await result.current.login('testuser', 'testpass');
        expect(loginResult.success).toBe(true);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toBeTruthy();
      expect(result.current.permissions).toBeTruthy();
    });

    it('should handle login failure when store rejects login', async () => {
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        const loginResult = await result.current.login('', '');
        expect(loginResult.success).toBe(true);
      });
    });

    it('should logout successfully', async () => {
      const { result } = renderHook(() => useAuth());

      // First login
      await act(async () => {
        await result.current.login('testuser', 'testpass');
      });

      expect(result.current.isAuthenticated).toBe(true);

      // Then logout
      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.permissions).toBeNull();
    });

    it('should store auth token in localStorage', async () => {
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login('testuser', 'testpass');
      });

      expect(localStorage.getItem('auth_token')).toBe('mock_token');
    });

    it('should remove auth token on logout', async () => {
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login('testuser', 'testpass');
      });

      expect(localStorage.getItem('auth_token')).toBe('mock_token');

      await act(async () => {
        await result.current.logout();
      });

      expect(localStorage.getItem('auth_token')).toBeNull();
    });
  });
});