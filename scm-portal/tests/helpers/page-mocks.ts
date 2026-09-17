import { vi } from 'vitest';
import { MOCK_CIRCLES, MOCK_SSAS, MOCK_ZONES } from '@/lib/utils/mock-api';

export const mockRouter = {
  push: vi.fn(),
  back: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
};

export function mockNextNavigation(searchParams = '') {
  vi.mock('next/navigation', () => ({
    useRouter: () => mockRouter,
    useParams: () => ({}),
    useSearchParams: () => new URLSearchParams(searchParams),
  }));
}

export function mockAuthUser(overrides: Record<string, unknown> = {}) {
  vi.mock('@/lib/hooks/use-auth', () => ({
    useAuth: () => ({
      user: {
        username: 'admin',
        mobileNumber: '9876543210',
        firstName: 'Demo',
        lastName: 'User',
        ...overrides,
      },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    }),
  }));
}

export const masterDataMocks = {
  getZones: vi.fn().mockResolvedValue(MOCK_ZONES),
  getCircles: vi.fn().mockResolvedValue(MOCK_CIRCLES),
  getZoneBasedCircles: vi.fn().mockResolvedValue(MOCK_CIRCLES),
  getSSAs: vi.fn().mockResolvedValue(MOCK_SSAS),
  getDealerType: vi.fn().mockResolvedValue([{ id: '1', name: 'Retailer' }]),
  getCategory: vi.fn().mockResolvedValue([{ id: '1', name: 'Category A' }]),
  getCategoryByDealer: vi.fn().mockResolvedValue([{ id: '1', name: 'Category A' }]),
  sendOtp: vi.fn().mockResolvedValue({ status: 'success', message: 'OTP sent' }),
  validateOtp: vi.fn().mockResolvedValue({ status: 'success', message: 'OTP validated' }),
};
