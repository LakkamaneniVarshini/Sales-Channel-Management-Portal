import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OTPVerificationModal } from '@/components/shared/modals/OTPVerificationModal';

vi.mock('@/lib/api/masterdata.api', () => ({
  validateOtp: vi.fn().mockResolvedValue({ status: 'success', message: 'validated' }),
}));

describe('OTPVerificationModal', () => {
  it('renders when open and verifies OTP', async () => {
    const onVerified = vi.fn();
    const onError = vi.fn();

    render(
      <OTPVerificationModal
        isOpen
        onClose={vi.fn()}
        msisdn="9876543210"
        operation="10069"
        onVerified={onVerified}
        onError={onError}
      />
    );

    expect(screen.getByText(/OTP Verification/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/OTP/i), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /Verify/i }));

    await waitFor(() => {
      expect(onVerified).toHaveBeenCalled();
    });
  });

  it('does not render when closed', () => {
    render(
      <OTPVerificationModal
        isOpen={false}
        onClose={vi.fn()}
        msisdn="9876543210"
        operation="10069"
        onVerified={vi.fn()}
        onError={vi.fn()}
      />
    );

    expect(screen.queryByText(/OTP Verification/i)).not.toBeInTheDocument();
  });
});
