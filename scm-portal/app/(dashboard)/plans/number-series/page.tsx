'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { useOtp } from '@/lib/hooks/use-otp';
import { addNumberSeries, getNumberSeries } from '@/lib/api/masterdata.api';
import type { NumberSeries } from '@/lib/types/api.types';
import { sendAddNumberSeriesOtp } from '@/lib/api/plan.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/shared/tables/DataTable';
import { LoadingState } from '@/components/shared/feedback/LoadingState';
import { ApiError } from '@/components/shared/feedback/ApiError';
import { OTPVerificationModal } from '@/components/shared/modals/OTPVerificationModal';
import { ArrowLeft, Send } from 'lucide-react';

export default function NumberSeriesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [numberSeriesData, setNumberSeriesData] = useState<NumberSeries[]>([]);
  const [searchSeries, setSearchSeries] = useState('');
  const [formData, setFormData] = useState({ numberSeries: '', numberSeriesId: '', circleId: '' });
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  const handleSendOtp = async () => {
    try {
      await sendAddNumberSeriesOtp(user?.mobileNumber || '');
    } catch (error: any) {
      throw error;
    }
  };

  const { sendOtp, verifyOtp, reset: resetOtp } = useOtp({
    msisdn: user?.mobileNumber || '',
    operation: '10069',
    onSendOtp: handleSendOtp,
    onSuccess: () => {
      handleAddNumberSeries();
    },
    onError: (error) => {
      setOtpError(error);
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = async () => {
    if (!searchSeries.trim()) {
      setError('Enter a number series to search.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await getNumberSeries(user?.username || '', searchSeries.trim());
      setNumberSeriesData(Array.isArray(result) ? result : result ? [result] : []);
    } catch (err: any) {
      setError(err.message || 'Failed to find number series');
      setNumberSeriesData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.numberSeries || !formData.numberSeriesId || !formData.circleId) {
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

  const handleAddNumberSeries = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await addNumberSeries({
        ...formData,
        inId: 1,
        username: user?.username || 'admin',
      });
      setNumberSeriesData([{ ...formData, inId: '1', username: user?.username || 'admin' }, ...numberSeriesData]);
      setFormData({ numberSeries: '', numberSeriesId: '', circleId: '' });
      setShowOtpModal(false);
    } catch (error: any) {
      setError(error.message || 'Failed to add number series');
      setIsLoading(false);
    }
  };

  const columns = [
    { key: 'numberSeries', header: 'Series' },
    { key: 'numberSeriesId', header: 'Series ID' },
    { key: 'circleId', header: 'Circle ID' },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push(`/plans/number-series/${row.numberSeries}`)}>
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => router.push(`/plans/number-series/${row.numberSeries}/delete`)}>
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
          <h1 className="text-2xl font-bold text-gray-900">Number Series Management</h1>
          <p className="text-gray-500">Manage number series allocations</p>
        </div>
      </div>

      {error && <ApiError error={error} onRetry={() => setError(null)} />}

      <Card>
        <CardHeader><CardTitle>Find Number Series</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Input value={searchSeries} onChange={(event) => setSearchSeries(event.target.value)} placeholder="Enter number series" />
          <Button type="button" variant="outline" onClick={handleSearch} disabled={isLoading}>Search</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New Number Series</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numberSeries">Series *</Label>
                <Input
                  id="numberSeries"
                  value={formData.numberSeries}
                  onChange={(e) => handleInputChange('numberSeries', e.target.value)}
                  placeholder="Enter series name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numberSeriesId">Number Series ID *</Label>
                <Input
                  id="numberSeriesId"
                  value={formData.numberSeriesId}
                  onChange={(e) => handleInputChange('numberSeriesId', e.target.value)}
                  placeholder="Enter series ID"
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
                Send OTP & Add Series
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Number Series Search Results</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingState message="Loading number series data..." />
          ) : (
            <DataTable
              data={numberSeriesData}
              columns={columns}
              searchPlaceholder="Search number series..."
              emptyMessage="Search for a number series to view records"
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
