'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { fetchDealerData as fetchDealerApi, updateDealer, dealerStatusCheck, changeDealerStatus, resetDealerMpin, sendModifyDealerOtp, sendDealerStatusOtp, sendDealerMpinResetOtp } from '@/lib/api/dealer.api';
import { validateOtp } from '@/lib/api/masterdata.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/feedback/StatusBadge';
import { LoadingState } from '@/components/shared/feedback/LoadingState';
import { ApiError } from '@/components/shared/feedback/ApiError';
import { OTPVerificationModal } from '@/components/shared/modals/OTPVerificationModal';
import { ArrowLeft, Edit, Lock, Unlock, RefreshCw, Key } from 'lucide-react';
import type { Dealer } from '@/lib/types/api.types';

export default function DealerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user: currentUser } = useAuth();
  const msisdn = params.msisdn as string;

  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Dealer>>({});

  // OTP Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpOperation, setOtpOperation] = useState<'edit' | 'status' | 'mpin'>('edit');
  const [otpError, setOtpError] = useState<string | null>(null);

  const loadDealerData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const dealerData = await fetchDealerApi(msisdn, currentUser?.username || '');
      setDealer(dealerData);
      setEditData(dealerData as Partial<Dealer>);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dealer data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadDealerData();
  }, [msisdn, currentUser?.username]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setError(null);

    try {
      // Trigger OTP for dealer edit
      setOtpOperation('edit');
      setShowOtpModal(true);
      await sendModifyDealerOtp(dealer?.mobile || '');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
      setShowOtpModal(false);
    }
  };

  const handleOtpVerified = async () => {
    setIsSubmitting(true);
    try {
      // Execute the actual operation based on OTP operation type
      if (otpOperation === 'edit') {
        await updateDealer(editData);
      } else if (otpOperation === 'status') {
        const newStatus = dealer?.status === 1 ? 0 : 1;
        await changeDealerStatus(dealer?.scmMsisdn || '', currentUser?.username || '', newStatus);
      } else if (otpOperation === 'mpin') {
        await resetDealerMpin(dealer?.scmMsisdn || '', currentUser?.username || '');
      }

      await loadDealerData();
      setIsEditing(false);
      setShowOtpModal(false);
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async () => {
    if (!dealer) return;

    setError(null);

    try {
      setOtpOperation('status');
      setShowOtpModal(true);
      await sendDealerStatusOtp(dealer.mobile);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
      setShowOtpModal(false);
    }
  };

  const handleMpinReset = async () => {
    if (!dealer) return;

    setError(null);

    try {
      setOtpOperation('mpin');
      setShowOtpModal(true);
      await sendDealerMpinResetOtp(dealer.mobile);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
      setShowOtpModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingState message="Loading dealer details..." />
      </div>
    );
  }

  if (!dealer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="p-6">
            <p className="text-center text-gray-500">Dealer not found</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Dealer Details</h1>
            <p className="text-gray-500">{dealer.scmMsisdn}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleStatusChange} disabled={isSubmitting}>
            {dealer.status === 1 ? (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Deactivate
              </>
            ) : (
              <>
                <Unlock className="h-4 w-4 mr-2" />
                Activate
              </>
            )}
          </Button>
          <Button variant="outline" onClick={() => router.push(`/dealers/${msisdn}/hierarchy`)} disabled={isSubmitting}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Hierarchy
          </Button>
          <Button variant="outline" onClick={handleMpinReset} disabled={isSubmitting}>
            <Key className="h-4 w-4 mr-2" />
            Reset MPIN
          </Button>
          {!isEditing ? (
            <Button onClick={handleEdit} disabled={isSubmitting}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={isSubmitting}>
              Save
            </Button>
          )}
        </div>
      </div>

      {error && <ApiError error={error} onRetry={() => setError(null)} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>SCM MSISDN</Label>
                <p className="text-sm text-gray-600">{dealer.scmMsisdn}</p>
              </div>
              <div>
                <Label>Mobile</Label>
                <p className="text-sm text-gray-600">{dealer.mobile}</p>
              </div>
              <div>
                <Label>First Name</Label>
                {isEditing ? (
                  <Input
                    value={editData.firstName || ''}
                    onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-gray-600">{dealer.firstName}</p>
                )}
              </div>
              <div>
                <Label>Last Name</Label>
                {isEditing ? (
                  <Input
                    value={editData.lastName || ''}
                    onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-gray-600">{dealer.lastName}</p>
                )}
              </div>
              <div>
                <Label>Date of Birth</Label>
                <p className="text-sm text-gray-600">{dealer.dob}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p className="text-sm text-gray-600">{dealer.emailId || 'Not provided'}</p>
              </div>
            </div>
            <div>
              <Label>Address</Label>
              {isEditing ? (
                <Input
                  value={editData.address || ''}
                  onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                />
              ) : (
                <p className="text-sm text-gray-600">{dealer.address}</p>
              )}
            </div>
            <div>
              <Label>Pincode</Label>
              <p className="text-sm text-gray-600">{dealer.pincode || 'Not provided'}</p>
            </div>
            <div>
              <Label>Status</Label>
              <StatusBadge status={dealer.status || 0} />
            </div>
          </CardContent>
        </Card>

        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Dealer Type</Label>
                <p className="text-sm text-gray-600">{dealer.dealerType}</p>
              </div>
              <div>
                <Label>Category</Label>
                <p className="text-sm text-gray-600">{dealer.category}</p>
              </div>
              <div>
                <Label>Circle ID</Label>
                <p className="text-sm text-gray-600">{dealer.circleId}</p>
              </div>
              <div>
                <Label>SSA ID</Label>
                <p className="text-sm text-gray-600">{dealer.ssaId}</p>
              </div>
            </div>
            <div>
              <Label>GST Number</Label>
              <p className="text-sm text-gray-600">{dealer.gstNumber || 'Not provided'}</p>
            </div>
            <div>
              <Label>PAN Number</Label>
              <p className="text-sm text-gray-600">{dealer.panId || 'Not provided'}</p>
            </div>
            <div>
              <Label>Aadhaar Number</Label>
              <p className="text-sm text-gray-600">{dealer.aadhaarId || 'Not provided'}</p>
            </div>
            <div>
              <Label>Created Date</Label>
              <p className="text-sm text-gray-600">{dealer.cdt ? new Date(dealer.cdt).toLocaleDateString() : 'Not available'}</p>
            </div>
            <div>
              <Label>Last Modified</Label>
              <p className="text-sm text-gray-600">{dealer.mdt ? new Date(dealer.mdt).toLocaleDateString() : 'Not available'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Hierarchy Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Hierarchy Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Franchise MSISDN</Label>
                <p className="text-sm text-gray-600">{dealer.franchiseMsisdn || 'Not assigned'}</p>
              </div>
              <div>
                <Label>Sub-Franchise MSISDN</Label>
                <p className="text-sm text-gray-600">{dealer.subFranchiseMsisdn || 'Not assigned'}</p>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Hierarchy Actions</h4>
              <p className="text-sm text-blue-700 mb-4">
                Change the parent franchise or sub-franchise for this dealer
              </p>
              <Button variant="outline" size="sm">
                Change Hierarchy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <OTPVerificationModal
        isOpen={showOtpModal}
        onClose={() => {
          setShowOtpModal(false);
        }}
        msisdn={dealer.mobile}
        operation="10069"
        onVerified={handleOtpVerified}
        onError={(error) => {
          setOtpError(error);
        }}
        onVerify={(otp) => validateOtp({ otp, operation: '10069', msisdn: dealer.mobile }).then(() => true)}
      />
    </div>
  );
}
