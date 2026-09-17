'use client';

import React from 'react';
import { useAuthStore } from '@/lib/stores/auth.store';
import type { UserPermissions } from '@/lib/types/api.types';

interface PermissionGuardProps {
  permission: keyof UserPermissions;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGuard({ permission, children, fallback = null }: PermissionGuardProps) {
  const permissions = useAuthStore((state) => state.permissions);

  const hasPermission = permissions && permissions[permission] === 1;

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}