import { describe, it, expect } from 'vitest';
import { hasPermission, getGrantedPermissions } from '@/lib/utils/permissions';
import type { UserPermissions } from '@/lib/types/api.types';

const basePermissions: UserPermissions = {
  roleId: 3,
  username: 'demo',
  hrmsId: '123456',
  dealerPermissions: 1,
  walletPermissions: 0,
  userPermissions: 1,
  commissionPermissions: 1,
  plansNumberpermissions: 0,
  reportsPermissions: 0,
  stockCheck: 0,
  dealerMpinReset: 0,
  franchiseAddBalance: 0,
  bulkRecharge: 0,
  varepReports: 0,
  userActivityReports: 0,
  dealerStatus: 0,
  transactionStatus: 0,
  topupReversal: 0,
  simSaleUpload: 0,
  simInventory: 0,
  pendingClearence: 0,
  inReconsilation: 0,
  mobileApp: 0,
  deferredCommission: 0,
  cbp: 0,
  simUpgrade: 0,
  mnp: 0,
  frcStv: 0,
  bulk_purge: 0,
  e_auction: 0,
  denominations: 0,
  prepaidCommissions: 0,
  postpaidCommissions: 0,
  landlineCommissions: 0,
  FOSCreation: 0,
};

describe('Permission logic', () => {
  it('returns true when permission flag is 1', () => {
    expect(hasPermission(basePermissions, 'dealerPermissions')).toBe(true);
    expect(hasPermission(basePermissions, 'userPermissions')).toBe(true);
  });

  it('returns false when permission flag is 0', () => {
    expect(hasPermission(basePermissions, 'walletPermissions')).toBe(false);
    expect(hasPermission(basePermissions, 'plansNumberpermissions')).toBe(false);
  });

  it('returns false when permissions are null', () => {
    expect(hasPermission(null, 'userPermissions')).toBe(false);
  });

  it('returns granted permission keys only', () => {
    const granted = getGrantedPermissions(basePermissions);
    expect(granted).toContain('dealerPermissions');
    expect(granted).toContain('userPermissions');
    expect(granted).not.toContain('walletPermissions');
  });
});
