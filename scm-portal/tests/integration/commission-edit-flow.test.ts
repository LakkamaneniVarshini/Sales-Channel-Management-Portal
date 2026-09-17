import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchCommission,
  sendModifyPrepaidFrcOtp,
  updateCommissionConfig,
} from '@/lib/api/commission.api';
import { validateOtp } from '@/lib/api/masterdata.api';

vi.mock('@/lib/api/masterdata.api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api/masterdata.api')>();
  return {
    ...actual,
    validateOtp: vi.fn().mockResolvedValue({ status: 'success', message: 'OTP validated' }),
  };
});

describe('Commission edit integration flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_ENABLE_MOCK_API = 'true';
  });

  it('completes search -> select -> OTP -> update commission', async () => {
    const msisdn = '9876543210';
    const username = 'admin';

    const commissions = await fetchCommission({
      denomination: '',
      circleId: '',
      categoryId: '',
      commissionType: '1',
      username,
      dtype: 'FRC',
    });

    expect(commissions.length).toBeGreaterThan(0);
    const selected = commissions[0];

    await sendModifyPrepaidFrcOtp(msisdn);
    await validateOtp({ otp: '123456', operation: '10069', msisdn });

    const updated = await updateCommissionConfig(selected.commissionId);
    expect(updated).toMatchObject({
      commissionId: selected.commissionId,
      status: 'updated',
    });
    expect(validateOtp).toHaveBeenCalled();
  });
});
