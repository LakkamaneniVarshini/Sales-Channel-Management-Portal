'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { validateOtp } from '@/lib/api/masterdata.api';

interface OTPVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  msisdn: string;
  operation: string;
  onVerified: () => void;
  onError: (error: string) => void;
  onVerify?: (otp: string) => Promise<boolean | void>;
  onResend?: () => Promise<void>;
}

export function OTPVerificationModal({
  isOpen,
  onClose,
  msisdn,
  operation,
  onVerified,
  onError,
  onVerify,
  onResend,
}: OTPVerificationModalProps) {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && countdown > 0 && !canResend) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [isOpen, countdown, canResend]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      if (onVerify) {
        result = await onVerify(otp);
      } else {
        await validateOtp({
          otp,
          operation,
          msisdn,
        });
        result = true;
      }

      // Only call onVerified if verification succeeded (result is not false)
      if (result !== false) {
        onVerified();
        onClose();
        setOtp('');
      }
    } catch (error: any) {
      onError(error.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      if (onResend) {
        await onResend();
      }
      setCountdown(30);
      setCanResend(false);
      setOtp('');
    } catch (error: any) {
      onError(error.message || 'Failed to resend OTP');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>OTP Verification</CardTitle>
          <CardDescription>
            Enter the OTP sent to {msisdn}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="text-center text-2xl tracking-widest"
                disabled={isLoading}
                autoFocus
              />
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                {!canResend ? (
                  `Resend in ${countdown} seconds`
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-blue-600 hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || otp.length !== 6}>
                {isLoading ? 'Verifying...' : 'Verify'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}