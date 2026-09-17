'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { useOtp } from '@/lib/hooks/use-otp';
import { findMnpData, saveMnp } from '@/lib/api/masterdata.api';
import type { MNP } from '@/lib/types/api.types';
import { sendAddMnpOtp } from '@/lib/api/plan.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/shared/tables/DataTable';
import { LoadingState } from '@/components/shared/feedback/LoadingState';
import { ApiError } from '@/components/shared/feedback/ApiError';
import { OTPVerificationModal } from '@/components/shared/modals/OTPVerificationModal';
import { ArrowLeft, Send, Plus } from 'lucide-react';

export default function MnpPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mnpData, setMnpData] = useState<MNP[]>([]);
  const [searchMsisdn, setSearchMsisdn] = useState('');
  const [formData, setFormData] = useState({ msisdn: '', recipientNo: '', circleId: '' });
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  const handleSendOtp = async () => {
    try {
      await sendAddMnpOtp(user?.mobileNumber || '');
    } catch (error: any) {
      throw error;
    }
  };

  const { sendOtp, verifyOtp, reset: resetOtp } = useOtp({
    msisdn: user?.mobileNumber || '',
    operation: '10069',
    onSendOtp: handleSendOtp,
    onSuccess: () => {
      handleSaveMnp();
    },
    onError: (error) => {
      setOtpError(error);
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = async () => {
    if (!searchMsisdn.trim()) {
      setError('Enter an MSISDN to search.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await findMnpData(searchMsisdn.trim(), user?.username || '');
      const records = Array.isArray(result) ? result : result ? [result] : [];
      setMnpData(records);
    } catch (err: any) {
      setError(err.message || 'Failed to find MNP data');
      setMnpData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.msisdn || !formData.recipientNo || !formData.circleId) {
      setError('Please fill in all required fields');
      return;
    }

    setError(null);

    try {
      setShowOtpModal(true);
      await sendOtp();
    } catch (error: any) {
      setError(error.message || 'Failed to send OTP');
    }
  };

  const handleSaveMnp = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await saveMnp({
        msisdn: formData.msisdn,
        recipientNo: Number(formData.recipientNo),
        circleId: formData.circleId,
        username: user?.username || 'admin',
      });
      setMnpData([{ ...formData, recipientNo: Number(formData.recipientNo), username: user?.username || 'admin' }, ...mnpData]);
      setFormData({ msisdn: '', recipientNo: '', circleId: '' });
      setShowOtpModal(false);
    } catch (error: any) {
      setError(error.message || 'Failed to save MNP');
      setIsLoading(false);
    }
  };

  const columns = [
    { key: 'msisdn', header: 'MSISDN' },
    { key: 'recipientNo', header: 'Recipient No.' },
    { key: 'circleId', header: 'Circle ID' },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push(`/plans/mnp/${row.msisdn}`)}>
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => router.push(`/plans/mnp/${row.msisdn}/delete`)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">MNP Management</h1>
          <p className="text-gray-500">Manage Mobile Number Portability</p>
        </div>
      </div>

      {error && <ApiError error={error} onRetry={() => setError(null)} />}

      <Card>
        <CardHeader><CardTitle>Find MNP Record</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Input value={searchMsisdn} onChange={(event) => setSearchMsisdn(event.target.value)} placeholder="Enter MSISDN" />
          <Button type="button" variant="outline" onClick={handleSearch} disabled={isLoading}>Search</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New MNP</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="msisdn">MSISDN *</Label>
                <Input
                  id="msisdn"
                  value={formData.msisdn}
                  onChange={(e) => handleInputChange('msisdn', e.target.value)}
                  placeholder="Enter MSISDN"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientNo">Recipient No. *</Label>
                <Input
                  id="recipientNo"
                  type="number"
                  min="0"
                  value={formData.recipientNo}
                  onChange={(e) => handleInputChange('recipientNo', e.target.value)}
                  placeholder="e.g. 142"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="circleId">Circle ID *</Label>
                <Input
                  id="circleId"
                  value={formData.circleId}
                  onChange={(e) => handleInputChange('circleId', e.target.value)}
                  placeholder="Enter circle ID"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="submit" disabled={isLoading}>
                <Send className="h-4 w-4 mr-2" />
                Send OTP & Add MNP
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>MNP Search Results</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingState message="Loading MNP data..." />
          ) : (
            <DataTable
              data={mnpData}
              columns={columns}
              searchPlaceholder="Search MNP records..."
              emptyMessage="Search by MSISDN to view MNP records"
            />
          )}
        </CardContent>
      </Card>

      <OTPVerificationModal
        isOpen={showOtpModal}
        onClose={() => {
          setShowOtpModal(false);
          resetOtp();
          setIsLoading(false);
        }}
        msisdn={user?.mobileNumber || ''}
        operation="10069"
        onVerified={() => {
          setShowOtpModal(false);
        }}
        onError={(error) => {
          setOtpError(error);
        }}
        onVerify={verifyOtp}
        onResend={sendOtp}
      />
    </div>
  );
}
