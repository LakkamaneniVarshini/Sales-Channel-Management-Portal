import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createUser, sendUserCreationOtp } from '@/lib/api/user.api';
import { validateOtp } from '@/lib/api/masterdata.api';
import type { CreateUserRequest } from '@/lib/types/api.types';

vi.mock('@/lib/api/masterdata.api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api/masterdata.api')>();
  return {
    ...actual,
    sendOtp: vi.fn().mockResolvedValue({ status: 'success', message: 'OTP sent' }),
    validateOtp: vi.fn().mockResolvedValue({ status: 'success', message: 'OTP validated' }),
  };
});

describe('User creation integration flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_ENABLE_MOCK_API = 'true';
  });

  it('completes send OTP -> validate OTP -> create user', async () => {
    const msisdn = '9876543210';

    await sendUserCreationOtp(msisdn);
    await validateOtp({ otp: '123456', operation: '10069', msisdn });

    const request: CreateUserRequest = {
      userId: '999',
      hrmsId: '123456',
      username: 'new.user',
      mobileNumber: msisdn,
      createdBy: 'admin',
      firstName: 'New',
      lastName: 'User',
      address: 'Address',
      status: 1,
      cdt: new Date().toISOString(),
      mdt: new Date().toISOString(),
      roleId: 3,
      ssaId: 1,
      circleId: 1,
      dob: '1990-01-01',
      password: 'password123',
      zoneId: 1,
      permissions: {
        roleId: 3,
        username: 'new.user',
        hrmsId: '123456',
        dealerPermissions: 1,
        walletPermissions: 1,
        userPermissions: 1,
        commissionPermissions: 1,
        plansNumberpermissions: 1,
        reportsPermissions: 1,
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
      },
    };

    const created = await createUser(request);
    expect(created.username).toBe('new.user');
    expect(validateOtp).toHaveBeenCalled();
  });
});
