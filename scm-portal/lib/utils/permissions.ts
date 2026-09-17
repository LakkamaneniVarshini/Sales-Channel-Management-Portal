import type { UserPermissions } from '@/lib/types/api.types';

export function hasPermission(
  permissions: UserPermissions | null | undefined,
  permission: keyof UserPermissions
): boolean {
  if (!permissions) return false;
  const value = permissions[permission];
  return value === 1;
}

export function getGrantedPermissions(permissions: UserPermissions): string[] {
  return (Object.keys(permissions) as (keyof UserPermissions)[]).filter(
    (key) => typeof permissions[key] === 'number' && permissions[key] === 1
  );
}
