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
  getZones: vi.fn().mockResolvedValue([{ id: 1, name: 'North Zone', code: 'NZ' }]),
  getZoneBasedCircles: vi.fn().mockResolvedValue([{ id: 1, name: 'Delhi', zoneId: 1, code: 'DL' }]),
  getSSAs: vi.fn().mockResolvedValue([{ id: 1, name: 'SSA North 1', circleId: 1, code: 'SSA1' }]),
}));

vi.mock('@/lib/api/user.api', () => ({
  createUser: vi.fn().mockResolvedValue({ username: 'john.doe' }),
  sendUserCreationOtp: vi.fn().mockResolvedValue({ status: 'success' }),
}));

import NewUserPage from '@/app/(dashboard)/users/new/page';

describe('User creation form', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders step 1 personal information fields', () => {
    render(<NewUserPage />);

    expect(screen.getByText('Create New User')).toBeInTheDocument();
    expect(screen.getByLabelText(/HRMS ID/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mobile Number/i)).toBeInTheDocument();
  });

  it('shows validation error when required fields are missing', async () => {
    render(<NewUserPage />);

    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    await waitFor(() => {
      expect(screen.getByText('HRMS ID is required')).toBeInTheDocument();
      expect(document.getElementById('hrmsId')).toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('shows inline error for invalid mobile number', async () => {
    render(<NewUserPage />);

    fireEvent.change(screen.getByLabelText(/HRMS ID/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'john.doe' } });
    fireEvent.change(screen.getByLabelText(/Mobile Number/i), { target: { value: '987465860' } });
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: '1990-01-01' } });
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    await waitFor(() => {
      const mobileField = document.getElementById('mobileNumber')!.closest('.space-y-2')!;
      expect(mobileField).toHaveTextContent('Invalid mobile number');
      expect(document.getElementById('mobileNumber')).toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('advances to location step when step 1 is valid', async () => {
    render(<NewUserPage />);

    fireEvent.change(screen.getByLabelText(/HRMS ID/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'john.doe' } });
    fireEvent.change(screen.getByLabelText(/Mobile Number/i), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: '1990-01-01' } });
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    await waitFor(() => {
      expect(screen.getByText('Location Information')).toBeInTheDocument();
      expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    });
  });
});
