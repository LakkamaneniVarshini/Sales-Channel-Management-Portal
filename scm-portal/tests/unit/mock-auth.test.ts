import { describe, it, expect } from 'vitest';
import { createMockPermissionsForUser } from '@/lib/utils/mock-auth';

describe('Mock auth profiles', () => {
  it('grants full module access for default demo users', () => {
    const permissions = createMockPermissionsForUser('admin');

    expect(permissions.userPermissions).toBe(1);
    expect(permissions.dealerPermissions).toBe(1);
    expect(permissions.commissionPermissions).toBe(1);
    expect(permissions.plansNumberpermissions).toBe(1);
  });

  it('restricts sidebar modules for limited demo user', () => {
    const permissions = createMockPermissionsForUser('limited');

    expect(permissions.dealerPermissions).toBe(1);
    expect(permissions.userPermissions).toBe(0);
    expect(permissions.commissionPermissions).toBe(0);
    expect(permissions.plansNumberpermissions).toBe(0);
  });
});
