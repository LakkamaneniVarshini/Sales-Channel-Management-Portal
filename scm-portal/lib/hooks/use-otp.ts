'use client';

import { useState, useCallback } from 'react';
import { validateOtp } from '@/lib/api/masterdata.api';

export type OtpState = 'idle' | 'sending' | 'sent' | 'validating' | 'validated' | 'failed';

interface UseOtpOptions {
  msisdn: string;
  operation: string;
  onSendOtp?: () => Promise<unknown>;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useOtp({ msisdn, operation, onSendOtp, onSuccess, onError }: UseOtpOptions) {
  const [state, setState] = useState<OtpState>('idle');
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendOtp = useCallback(async () => {
    setState('sending');
    setError(null);

    try {
      if (onSendOtp) {
        await onSendOtp();
      }

      setState('sent');
      setCountdown(30);
      setCanResend(false);

      // Start countdown
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setState('failed');
      const errorMessage = err.message || 'Failed to send OTP';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [onSendOtp, onError]);

  const verifyOtp = useCallback(async (otp: string) => {
    setState('validating');
    setError(null);

    try {
      await validateOtp({
        otp,
        operation,
        msisdn,
      });

      setState('validated');
      onSuccess?.();
      return true;
    } catch (err: any) {
      setState('failed');
      const errorMessage = err.message || 'Invalid OTP';
      setError(errorMessage);
      onError?.(errorMessage);
      return false;
    }
  }, [operation, msisdn, onSuccess, onError]);

  const resendOtp = useCallback(() => {
    setCountdown(30);
    setCanResend(false);
    sendOtp();
  }, [sendOtp]);

  const reset = useCallback(() => {
    setState('idle');
    setCountdown(30);
    setCanResend(false);
    setError(null);
  }, []);

  return {
    state,
    countdown,
    canResend,
    error,
    sendOtp,
    verifyOtp,
    resendOtp,
    reset,
  };
}