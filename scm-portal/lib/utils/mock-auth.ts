import type { User, UserPermissions } from '@/lib/types/api.types';

type PermissionOverrides = Partial<Omit<UserPermissions, 'roleId' | 'username' | 'hrmsId'>>;

export function createMockPermissions(
  username: string,
  hrmsId: string,
  roleId: number,
  overrides: PermissionOverrides = {},
): UserPermissions {
  return {
    roleId,
    username,
    hrmsId,
    dealerPermissions: 1,
    walletPermissions: 1,
    userPermissions: 1,
    commissionPermissions: 1,
    plansNumberpermissions: 1,
    reportsPermissions: 1,
    stockCheck: 1,
    dealerMpinReset: 1,
    franchiseAddBalance: 1,
    bulkRecharge: 1,
    varepReports: 1,
    userActivityReports: 1,
    dealerStatus: 1,
    transactionStatus: 1,
    topupReversal: 1,
    simSaleUpload: 1,
    simInventory: 1,
    pendingClearence: 1,
    inReconsilation: 1,
    mobileApp: 1,
    deferredCommission: 1,
    cbp: 1,
    simUpgrade: 1,
    mnp: 1,
    frcStv: 1,
    bulk_purge: 1,
    e_auction: 1,
    denominations: 1,
    prepaidCommissions: 1,
    postpaidCommissions: 1,
    landlineCommissions: 1,
    FOSCreation: 1,
    ...overrides,
  };
}

const LIMITED_PERMISSIONS: PermissionOverrides = {
  userPermissions: 0,
  commissionPermissions: 0,
  plansNumberpermissions: 0,
};

export function createMockUser(username: string): User {
  const normalized = username.toLowerCase();

  if (normalized === 'limited') {
    return {
      userId: '457',
      hrmsId: '654321',
      username: 'limited',
      mobileNumber: '9876543210',
      firstName: 'Limited',
      lastName: 'User',
      address: 'Demo Address',
      dob: '1988-01-01',
      roleId: 3,
      zoneId: 1,
      circleId: 1,
      ssaId: 1,
      status: 1,
      cdt: new Date().toISOString(),
      mdt: new Date().toISOString(),
    };
  }

  return {
    userId: '456',
    hrmsId: '123456',
    username,
    mobileNumber: '9876543210',
    firstName: normalized === 'admin' ? 'Admin' : 'Demo',
    lastName: 'User',
    address: 'Demo Address',
    dob: '1988-01-01',
    roleId: normalized === 'admin' ? 1 : 3,
    zoneId: 1,
    circleId: 1,
    ssaId: 1,
    status: 1,
    cdt: new Date().toISOString(),
    mdt: new Date().toISOString(),
  };
}

export function createMockPermissionsForUser(username: string): UserPermissions {
  const normalized = username.toLowerCase();
  const user = createMockUser(username);

  if (normalized === 'limited') {
    return createMockPermissions(user.username, user.hrmsId, user.roleId, LIMITED_PERMISSIONS);
  }

  return createMockPermissions(user.username, user.hrmsId, user.roleId);
}
