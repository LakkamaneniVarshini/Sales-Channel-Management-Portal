import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOtp } from '@/lib/hooks/use-otp';

// Mock the API functions
vi.mock('@/lib/api/masterdata.api', () => ({
  validateOtp: vi.fn(),
  sendOtp: vi.fn(),
}));

describe('OTP Workflow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useOtp hook', () => {
    it('should send OTP successfully', async () => {
      const { result } = renderHook(() =>
        useOtp({
          msisdn: '9876543210',
          operation: '10069',
          onSendOtp: async () => Promise.resolve(),
        })
      );

      await act(async () => {
        await result.current.sendOtp();
      });

      expect(result.current.state).toBe('sent');
      expect(result.current.canResend).toBe(false);
    });

    it('should validate OTP successfully', async () => {
      const { result } = renderHook(() =>
        useOtp({
          msisdn: '9876543210',
          operation: '10069',
          onSendOtp: async () => Promise.resolve(),
        })
      );

      // First send OTP
      await act(async () => {
        await result.current.sendOtp();
      });

      // Then validate
      const { validateOtp } = await import('@/lib/api/masterdata.api');
      vi.mocked(validateOtp).mockResolvedValue({ status: 'success', message: 'OTP validated' });

      await act(async () => {
        const success = await result.current.verifyOtp('123456');
        expect(success).toBe(true);
      });

      expect(result.current.state).toBe('validated');
    });

    it('should handle OTP validation failure', async () => {
      const onError = vi.fn();
      const { result } = renderHook(() =>
        useOtp({
          msisdn: '9876543210',
          operation: '10069',
          onSendOtp: async () => Promise.resolve(),
          onError,
        })
      );

      await act(async () => {
        await result.current.sendOtp();
      });

      const { validateOtp } = await import('@/lib/api/masterdata.api');
      vi.mocked(validateOtp).mockRejectedValue(new Error('Invalid OTP'));

      await act(async () => {
        const success = await result.current.verifyOtp('000000');
        expect(success).toBe(false);
      });

      expect(result.current.state).toBe('failed');
      expect(onError).toHaveBeenCalledWith('Invalid OTP');
    });

    it('should handle countdown timer', async () => {
      const { result } = renderHook(() =>
        useOtp({
          msisdn: '9876543210',
          operation: '10069',
          onSendOtp: async () => Promise.resolve(),
        })
      );

      await act(async () => {
        await result.current.sendOtp();
      });

      expect(result.current.countdown).toBe(30);
      expect(result.current.canResend).toBe(false);
    });

    it('should reset state correctly', async () => {
      const { result } = renderHook(() =>
        useOtp({
          msisdn: '9876543210',
          operation: '10069',
          onSendOtp: async () => Promise.resolve(),
        })
      );

      await act(async () => {
        await result.current.sendOtp();
      });

      expect(result.current.state).toBe('sent');

      act(() => {
        result.current.reset();
      });

      expect(result.current.state).toBe('idle');
      expect(result.current.countdown).toBe(30);
    });
  });
});