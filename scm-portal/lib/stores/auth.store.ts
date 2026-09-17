import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserPermissions } from '../types/api.types';

interface AuthState {
  user: User | null;
  permissions: UserPermissions | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setPermissions: (permissions: UserPermissions | null) => void;
  login: (user: User, permissions: UserPermissions) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(persist((set) => ({
  user: null,
  permissions: null,
  isAuthenticated: false,
  setUser: (user) => set({ user }),
  setPermissions: (permissions) => set({ permissions }),
  login: (user, permissions) =>
    set({
      user,
      permissions,
      isAuthenticated: true,
    }),
  logout: () =>
    set({
      user: null,
      permissions: null,
      isAuthenticated: false,
    }),
}), {
  name: 'scm-auth',
  partialize: (state) => ({
    user: state.user,
    permissions: state.permissions,
    isAuthenticated: state.isAuthenticated,
  }),
}));
