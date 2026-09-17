import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addCommission, sendPrepaidFrcOtp } from '@/lib/api/commission.api';
import { validateOtp } from '@/lib/api/masterdata.api';

vi.mock('@/lib/api/masterdata.api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api/masterdata.api')>();
  return {
    ...actual,
    validateOtp: vi.fn().mockResolvedValue({ status: 'success', message: 'OTP validated' }),
  };
});

describe('Commission integration flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_ENABLE_MOCK_API = 'true';
  });

  it('completes OTP validation before saving commission', async () => {
    const msisdn = '9876543210';

    await sendPrepaidFrcOtp(msisdn);
    await validateOtp({ otp: '123456', operation: '10069', msisdn });

    const result = await addCommission(
      {
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
        createdGuiUser: 'admin',
      },
      'prepaid-frc'
    );

    expect(result).toMatchObject({ kind: 'prepaid-frc', denomination: '199' });
    expect(validateOtp).toHaveBeenCalled();
  });
});
