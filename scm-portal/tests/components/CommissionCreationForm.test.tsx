import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const mockRouter = { push: vi.fn(), back: vi.fn() };

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => new URLSearchParams('type=prepaid-frc'),
}));

vi.mock('@/lib/hooks/use-auth', () => ({
  useAuth: () => ({
    user: { username: 'admin', mobileNumber: '9876543210' },
  }),
}));

vi.mock('@/lib/api/masterdata.api', () => ({
  getZones: vi.fn().mockResolvedValue([{ id: 1, name: 'North Zone', code: 'NZ' }]),
  getCircles: vi.fn().mockResolvedValue([{ id: 1, name: 'Delhi', zoneId: 1, code: 'DL' }]),
  getZoneBasedCircles: vi.fn().mockResolvedValue([{ id: 1, name: 'Delhi', zoneId: 1, code: 'DL' }]),
}));

vi.mock('@/lib/api/commission.api', () => ({
  addCommission: vi.fn().mockResolvedValue({ commissionId: '1' }),
  sendPrepaidFrcOtp: vi.fn().mockResolvedValue({ status: 'success' }),
  sendPrepaidOtfOtp: vi.fn().mockResolvedValue({ status: 'success' }),
  sendPostpaidOtp: vi.fn().mockResolvedValue({ status: 'success' }),
  sendLandlineOtp: vi.fn().mockResolvedValue({ status: 'success' }),
}));

import NewCommissionPage from '@/app/(dashboard)/commissions/new/page';

describe('Commission creation form', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders prepaid FRC commission fields', () => {
    render(<NewCommissionPage />);

    expect(screen.getByText(/Add Prepaid FRC Commission/i)).toBeInTheDocument();
    expect(document.getElementById('categoryId')).toBeInTheDocument();
    expect(document.getElementById('denomination')).toBeInTheDocument();
    expect(document.getElementById('sellerCommission')).toBeInTheDocument();
  });

  it('shows validation errors when required fields are empty', async () => {
    render(<NewCommissionPage />);

    fireEvent.click(screen.getByRole('button', { name: /Send OTP & Create Commission/i }));

    await waitFor(() => {
      expect(document.getElementById('categoryId')).toHaveAttribute('aria-invalid', 'true');
      expect(document.getElementById('denomination')).toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('accepts commission field input', () => {
    render(<NewCommissionPage />);

    fireEvent.change(document.getElementById('categoryId')!, { target: { value: '1' } });
    fireEvent.change(document.getElementById('denomination')!, { target: { value: '199' } });
    fireEvent.change(document.getElementById('sellerCommission')!, { target: { value: '10' } });

    expect(document.getElementById('categoryId')).toHaveValue('1');
    expect(document.getElementById('denomination')).toHaveValue('199');
  });
});
