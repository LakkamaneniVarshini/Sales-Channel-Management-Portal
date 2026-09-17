'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/hooks/use-auth';
import { walletAdjustment } from '@/lib/api/wallet.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingState } from '@/components/shared/feedback/LoadingState';
import { ApiError } from '@/components/shared/feedback/ApiError';
import { ArrowLeft, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function WalletAdjustmentPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    dlr_msisdn: '',
    adjustment_type: 1,
    adjustment_amount: '',
    wallet_type: 1,
    remarks: '',
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.dlr_msisdn || !formData.adjustment_amount) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await walletAdjustment({
        dlr_msisdn: formData.dlr_msisdn,
        adjustment_type: formData.adjustment_type,
        adjustment_amount: parseFloat(formData.adjustment_amount),
        wallet_type: formData.wallet_type,
        gui_user: user?.username || 'admin',
        remarks: formData.remarks,
      });

      router.push('/settings');
    } catch (err: any) {
      setError(err.message || 'Failed to adjust wallet');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingState message="Processing wallet adjustment..." />
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
          <h1 className="text-2xl font-bold text-gray-900">Wallet Adjustment</h1>
          <p className="text-gray-500">Adjust dealer wallet balance</p>
        </div>
      </div>

      {error && <ApiError error={error} onRetry={() => setError(null)} />}

      <Card>
        <CardHeader>
          <CardTitle>Wallet Adjustment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dlr_msisdn">Dealer MSISDN *</Label>
                <Input
                  id="dlr_msisdn"
                  value={formData.dlr_msisdn}
                  onChange={(e) => handleInputChange('dlr_msisdn', e.target.value)}
                  placeholder="Enter dealer MSISDN"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adjustment_amount">Adjustment Amount *</Label>
                <Input
                  id="adjustment_amount"
                  type="number"
                  value={formData.adjustment_amount}
                  onChange={(e) => handleInputChange('adjustment_amount', e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adjustment_type">Adjustment Type</Label>
                <select
                  id="adjustment_type"
                  value={formData.adjustment_type}
                  onChange={(e) => handleInputChange('adjustment_type', parseInt(e.target.value))}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="1">Credit</option>
                  <option value="2">Debit</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="wallet_type">Wallet Type</Label>
                <select
                  id="wallet_type"
                  value={formData.wallet_type}
                  onChange={(e) => handleInputChange('wallet_type', parseInt(e.target.value))}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="1">Primary Wallet</option>
                  <option value="2">Secondary Wallet</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Input
                id="remarks"
                value={formData.remarks}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
                placeholder="Enter remarks (optional)"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                <Wallet className="h-4 w-4 mr-2" />
                Process Adjustment
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
