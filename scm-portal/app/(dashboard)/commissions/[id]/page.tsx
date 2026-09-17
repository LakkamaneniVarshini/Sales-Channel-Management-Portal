'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { useOtp } from '@/lib/hooks/use-otp';
import {
  fetchCommission,
  fetchLandlineCommission,
  fetchPostpaidCommission,
  fetchPrepaidOTFCommission,
  sendModifyLandlineOtp,
  sendModifyPostpaidOtp,
  sendModifyPrepaidFrcOtp,
  sendModifyPrepaidOtfOtp,
  updateCommissionConfig,
  updateLandlineCommission,
  updatePostpaidCommission,
} from '@/lib/api/commission.api';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingState } from '@/components/shared/feedback/LoadingState';
import { ApiError } from '@/components/shared/feedback/ApiError';
import { OTPVerificationModal } from '@/components/shared/modals/OTPVerificationModal';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import type { Commission } from '@/lib/types/api.types';

const errorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export default function CommissionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { user: currentUser } = useAuth();
  const commissionId = params.id as string;
  const type = (searchParams.get('type') as 'prepaid-frc' | 'prepaid-otf' | 'postpaid' | 'landline') || 'prepaid-frc';

  const [commission, setCommission] = useState<Commission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const loadCommission = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const username = currentUser?.username || 'admin';
      const commissions: Commission[] = type === 'prepaid-otf'
        ? await fetchPrepaidOTFCommission({ denomination: '', circleId: '', categoryId: '', commissionType: '1', username, dtype: 'OTF' })
        : type === 'postpaid'
          ? await fetchPostpaidCommission({ circleId: '', category: '', sellerLevel: '', username })
          : type === 'landline'
            ? await fetchLandlineCommission({ circleId: '', categoryId: '', fromAmount: '', toAmount: '', guiUsername: username })
            : await fetchCommission({ denomination: '', circleId: '', categoryId: '', commissionType: '1', username, dtype: 'FRC' });
      const foundCommission = commissions.find((c: Commission) => c.commissionId === commissionId);
      if (!foundCommission) {
        setError('Commission not found');
      } else {
        setCommission(foundCommission);
      }
    } catch (err: unknown) {
      setError(errorMessage(err, 'Failed to fetch commission'));
    } finally {
      setIsLoading(false);
    }
  }, [commissionId, currentUser?.username, type]);

  useEffect(() => {
    void loadCommission();
  }, [loadCommission]);

  const sendModificationOtp = async () => {
    const msisdn = currentUser?.mobileNumber || '';
    if (type === 'prepaid-otf') return sendModifyPrepaidOtfOtp(msisdn);
    if (type === 'postpaid') return sendModifyPostpaidOtp(msisdn);
    if (type === 'landline') return sendModifyLandlineOtp(msisdn);
    return sendModifyPrepaidFrcOtp(msisdn);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (type === 'postpaid') {
        await updatePostpaidCommission(commissionId);
      } else if (type === 'landline') {
        await updateLandlineCommission(commissionId);
      } else {
        await updateCommissionConfig(commissionId);
      }
      await loadCommission();
      setIsEditing(false);
    } catch (err: unknown) {
      setError(errorMessage(err, 'Failed to update commission'));
    } finally {
      setIsLoading(false);
    }
  };

  const { sendOtp, verifyOtp, reset: resetOtp } = useOtp({
    msisdn: currentUser?.mobileNumber || '',
    operation: '10069',
    onSendOtp: sendModificationOtp,
    onSuccess: handleSave,
    onError: setError,
  });

  const requestSave = async () => {
    setError(null);
    setShowOtpModal(true);
    await sendOtp();
  };

  const handleDelete = () => {
    router.push(`/commissions/${commissionId}/delete?type=${type}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingState message="Loading commission details..." />
      </div>
    );
  }

  if (!commission) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="p-6">
            <p className="text-center text-gray-500">Commission not found</p>
            <Button onClick={() => router.back()} className="mt-4 w-full">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Commission Details</h1>
            <p className="text-gray-500">{commissionId}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} disabled={isLoading}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <Button onClick={requestSave} disabled={isLoading}>
              Save
            </Button>
          )}
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {error && <ApiError error={error} onRetry={() => setError(null)} />}

      <Card>
        <CardHeader>
          <CardTitle>Commission Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Commission ID</Label>
              <p className="text-sm text-gray-600">{commission.commissionId}</p>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <p className="text-sm text-gray-600">{commission.masterCategoryId}</p>
            </div>
            <div className="space-y-2">
              <Label>Circle</Label>
              <p className="text-sm text-gray-600">{commission.circleId}</p>
            </div>
            <div className="space-y-2">
              <Label>Denomination</Label>
              <p className="text-sm text-gray-600">{commission.denomination}</p>
            </div>
            <div className="space-y-2">
              <Label>Seller Commission</Label>
              <p className="text-sm text-gray-600">{commission.sellerCommission}</p>
            </div>
            <div className="space-y-2">
              <Label>FRA Commission</Label>
              <p className="text-sm text-gray-600">{commission.fraCommission}</p>
            </div>
            <div className="space-y-2">
              <Label>Sub Commission</Label>
              <p className="text-sm text-gray-600">{commission.subCommission}</p>
            </div>
            <div className="space-y-2">
              <Label>TDS</Label>
              <p className="text-sm text-gray-600">{commission.tds}</p>
            </div>
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
