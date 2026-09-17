import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const mockRouter = { push: vi.fn(), back: vi.fn() };

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

vi.mock('@/lib/hooks/use-auth', () => ({
  useAuth: () => ({
    user: { username: 'admin', mobileNumber: '9876543210' },
  }),
}));

vi.mock('@/lib/api/masterdata.api', () => ({
  getDealerType: vi.fn().mockResolvedValue([{ id: '1', name: 'Retailer' }]),
  getCategory: vi.fn().mockResolvedValue([{ id: '1', name: 'Category A' }]),
  getCategoryByDealer: vi.fn().mockResolvedValue([{ id: '1', name: 'Category A' }]),
}));

vi.mock('@/lib/api/dealer.api', () => ({
  createDealer: vi.fn().mockResolvedValue({ dealerId: '1' }),
  sendDealerCreationOtp: vi.fn().mockResolvedValue({ status: 'success' }),
  getFranchise: vi.fn().mockResolvedValue(null),
  getSubFranchise: vi.fn().mockResolvedValue(null),
}));

import NewDealerPage from '@/app/(dashboard)/dealers/new/page';

describe('Dealer creation form', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dealer information fields', async () => {
    render(<NewDealerPage />);

    expect(screen.getByText('Create New Dealer')).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mobile Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
  });

  it('shows validation error for incomplete dealer form', async () => {
    render(<NewDealerPage />);

    fireEvent.click(screen.getByRole('button', { name: /Send OTP & Create Dealer/i }));

    await waitFor(() => {
      expect(document.getElementById('firstName')).toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('accepts valid dealer field input', () => {
    render(<NewDealerPage />);

    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Dealer' } });
    fireEvent.change(screen.getByLabelText(/Mobile Number/i), { target: { value: '9876543210' } });

    expect(screen.getByLabelText(/First Name/i)).toHaveValue('John');
    expect(screen.getByLabelText(/Mobile Number/i)).toHaveValue('9876543210');
  });
});
