import { describe, it, expect } from 'vitest';
import { userCreationSchema } from '@/lib/schemas/user.schema';
import { prepaidCommissionSchema, postpaidCommissionSchema } from '@/lib/schemas/commission.schema';
import { dealerCreationSchema } from '@/lib/schemas/dealer.schema';
import { planCreationSchema } from '@/lib/schemas/plan.schema';

const validPermissions = {
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
};

describe('Form validation schemas', () => {
  it('validates user creation payload', () => {
    const result = userCreationSchema.safeParse({
      hrmsId: '123456',
      username: 'demo.user',
      mobileNumber: '9876543210',
      firstName: 'Demo',
      lastName: 'User',
      address: 'Sample address',
      dob: '1990-01-01',
      roleId: 3,
      zoneId: 1,
      circleId: 1,
      ssaId: 1,
      password: 'password123',
      status: 1,
      permissions: validPermissions,
    });

    expect(result.success).toBe(true);
  });

  it('returns friendly messages for missing user fields', () => {
    const result = userCreationSchema.pick({
      hrmsId: true,
      username: true,
      mobileNumber: true,
      firstName: true,
      lastName: true,
      dob: true,
    }).safeParse({});

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('HRMS ID is required');
      expect(result.error.issues.some((issue) => issue.message.includes('undefined'))).toBe(false);
    }
  });

  it('rejects invalid mobile number in user creation', () => {
    const result = userCreationSchema.safeParse({
      hrmsId: '123456',
      username: 'demo.user',
      mobileNumber: '12345',
      firstName: 'Demo',
      lastName: 'User',
      address: 'Sample address',
      dob: '1990-01-01',
      roleId: 3,
      zoneId: 1,
      circleId: 1,
      ssaId: 1,
      password: 'password123',
      status: 1,
      permissions: validPermissions,
    });

    expect(result.success).toBe(false);
  });

  it('validates prepaid commission payload', () => {
    const result = prepaidCommissionSchema.safeParse({
      masterCategoryId: '1',
      circleId: '1',
      sellerCommission: '10',
      fraCommission: '5',
      subCommission: '2',
      tds: '1',
      denomination: '199',
      categoryId: '1',
      commissionType: '1',
      dtype: 'FRC',
    });

    expect(result.success).toBe(true);
  });

  it('validates postpaid commission payload', () => {
    const result = postpaidCommissionSchema.safeParse({
      categoryId: '1',
      circleId: '1',
      tdsAmount: '10',
      fraCommission: '5',
      actualCommission: '100',
      sellerLevel: '1',
      cap_limit: '500',
      zoneId: '1',
    });

    expect(result.success).toBe(true);
  });

  it('validates dealer creation payload', () => {
    const result = dealerCreationSchema.safeParse({
      firstName: 'John',
      lastName: 'Dealer',
      mobile: '9876543210',
      dob: '1990-01-01',
      address: 'Sample address',
      pincode: '110001',
      dealerType: '1',
      circleId: 1,
      ssaId: 1,
      category: '1',
    });

    expect(result.success).toBe(true);
  });

  it('validates plan creation payload', () => {
    const result = planCreationSchema.safeParse({
      operator: 'Demo',
      denomination: '199',
      talkvalue: '199',
      country: 'India',
      start_date: '2025-01-01',
      end_date: '2026-01-01',
      type: 'Prepaid',
      description: 'Demo plan',
      tab_name: 'Popular',
      circle: '1',
      validity: '28 days',
      from_date: '2025-01-01',
      to_date: '2026-01-01',
    });

    expect(result.success).toBe(true);
  });
});
