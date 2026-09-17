'use client';

import React, { useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { useOtp } from '@/lib/hooks/use-otp';
import {
  deleteCommissionConfig,
  deleteLandlineCommission,
  deletePostpaidCommission,
  sendDeletePrepaidOtfOtp,
} from '@/lib/api/commission.api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingState } from '@/components/shared/feedback/LoadingState';
import { ApiError } from '@/components/shared/feedback/ApiError';
import { OTPVerificationModal } from '@/components/shared/modals/OTPVerificationModal';
import { ArrowLeft, Trash2, AlertTriangle } from 'lucide-react';

const errorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export default function DeleteCommissionPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { user: currentUser } = useAuth();
  const commissionId = params.id as string;
  const type = (searchParams.get('type') as 'prepaid-frc' | 'prepaid-otf' | 'postpaid' | 'landline') || 'prepaid-frc';

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (type === 'postpaid') {
        await deletePostpaidCommission(commissionId);
      } else if (type === 'landline') {
        await deleteLandlineCommission(commissionId);
      } else {
        await deleteCommissionConfig(commissionId);
      }
      router.push('/commissions');
    } catch (err: unknown) {
      setError(errorMessage(err, 'Failed to delete commission'));
      setIsLoading(false);
    }
  };

  const { sendOtp, verifyOtp, reset: resetOtp } = useOtp({
    msisdn: currentUser?.mobileNumber || '',
    operation: '10069',
    // The available deletion OTP topic in the source collection is DeleteprepaidOtf.
    onSendOtp: () => sendDeletePrepaidOtfOtp(currentUser?.mobileNumber || ''),
    onSuccess: handleDelete,
    onError: setError,
  });

  const requestDelete = async () => {
    setError(null);
    setShowOtpModal(true);
    await sendOtp();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingState message="Deleting commission..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Delete Commission</h1>
          <p className="text-gray-500">{commissionId}</p>
        </div>
      </div>

      {error && <ApiError error={error} onRetry={() => setError(null)} />}

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Confirm Deletion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-medium text-red-900">This action cannot be undone</p>
              <p className="text-sm text-red-700 mt-1">
                Are you sure you want to delete this commission configuration? This will permanently remove the commission from the system.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => router.back()} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={requestDelete} disabled={isLoading}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Commission
            </Button>
          </div>
        </CardContent>
      </Card>

      <OTPVerificationModal
        isOpen={showOtpModal}
        onClose={() => {
          setShowOtpModal(false);
          resetOtp();
        }}
        msisdn={currentUser?.mobileNumber || ''}
        operation="10069"
        onVerified={() => setShowOtpModal(false)}
        onError={setError}
        onVerify={verifyOtp}
        onResend={sendOtp}
      />
    </div>
  );
}
