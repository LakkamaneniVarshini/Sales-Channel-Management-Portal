'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { useOtp } from '@/lib/hooks/use-otp';
import { addPlan, sendAddPlanOtp } from '@/lib/api/plan.api';
import { planCreationSchema, type PlanCreationFormData } from '@/lib/schemas/plan.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleSelector } from '@/components/shared/selectors/CircleSelector';
import { OTPVerificationModal } from '@/components/shared/modals/OTPVerificationModal';
import { LoadingState } from '@/components/shared/feedback/LoadingState';
import { ApiError } from '@/components/shared/feedback/ApiError';
import { ArrowLeft, Send } from 'lucide-react';

export default function NewPlanPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<PlanCreationFormData>>({});

  // OTP State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  const handleSendOtp = async () => {
    try {
      await sendAddPlanOtp(user?.mobileNumber || '');
    } catch (error: any) {
      throw error;
    }
  };

  const { sendOtp, verifyOtp, reset: resetOtp } = useOtp({
    msisdn: user?.mobileNumber || '',
    operation: '10069',
    onSendOtp: handleSendOtp,
    onSuccess: () => {
      handleCreatePlan();
    },
    onError: (error) => {
      setOtpError(error);
    },
  });

  const handleInputChange = (field: keyof PlanCreationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      planCreationSchema.parse(formData);
    } catch (err) {
      setError('Please fill in all required fields correctly');
      return;
    }

    setError(null);

    try {
      // Trigger OTP workflow - don't set full-page loading
      setShowOtpModal(true);
      await sendOtp();
    } catch (error: any) {
      setError(error.message || 'Failed to send OTP');
    }
  };

  const handleCreatePlan = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const planRequest = {
        operator: formData.operator!,
        denomination: formData.denomination!,
        talkvalue: formData.talkvalue!,
        country: formData.country!,
        start_date: formData.start_date!,
        end_date: formData.end_date!,
        type: formData.type!,
        description: formData.description!,
        tab_name: formData.tab_name!,
        circle: formData.circle!,
        validity: formData.validity!,
        from_date: formData.from_date!,
        to_date: formData.to_date!,
      };

      await addPlan(planRequest, user?.username || '');
      router.push('/plans');
    } catch (error: any) {
      setError(error.message || 'Failed to create plan');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingState message="Creating plan..." />
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
          <h1 className="text-2xl font-bold text-gray-900">Create New Plan</h1>
          <p className="text-gray-500">Add a new plan to the system</p>
        </div>
      </div>

      {error && <ApiError error={error} onRetry={() => setError(null)} />}

      <Card>
        <CardHeader>
          <CardTitle>Plan Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="operator">Operator *</Label>
                <Input
                  id="operator"
                  value={formData.operator || ''}
                  onChange={(e) => handleInputChange('operator', e.target.value)}
                  placeholder="Enter operator name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="denomination">Denomination *</Label>
                <Input
                  id="denomination"
                  value={formData.denomination || ''}
                  onChange={(e) => handleInputChange('denomination', e.target.value)}
                  placeholder="Enter denomination"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="talkvalue">Talk Value *</Label>
                <Input
                  id="talkvalue"
                  value={formData.talkvalue || ''}
                  onChange={(e) => handleInputChange('talkvalue', e.target.value)}
                  placeholder="Enter talk value"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={formData.country || ''}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="Enter country"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <select
                  id="type"
                  value={formData.type || ''}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="">Select Type</option>
                  <option value="Prepaid">Prepaid</option>
                  <option value="Postpaid">Postpaid</option>
                  <option value="Landline">Landline</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="validity">Validity *</Label>
                <Input
                  id="validity"
                  value={formData.validity || ''}
                  onChange={(e) => handleInputChange('validity', e.target.value)}
                  placeholder="Enter validity (e.g., 28 days)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter plan description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tab_name">Tab Name *</Label>
              <Input
                id="tab_name"
                value={formData.tab_name || ''}
                onChange={(e) => handleInputChange('tab_name', e.target.value)}
                placeholder="Enter tab name"
              />
            </div>

            <CircleSelector
              value={formData.circle || ''}
              onChange={(value) => handleInputChange('circle', value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date || ''}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date *</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date || ''}
                  onChange={(e) => handleInputChange('end_date', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="from_date">From Date *</Label>
                <Input
                  id="from_date"
                  type="date"
                  value={formData.from_date || ''}
                  onChange={(e) => handleInputChange('from_date', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to_date">To Date *</Label>
                <Input
                  id="to_date"
                  type="date"
                  value={formData.to_date || ''}
                  onChange={(e) => handleInputChange('to_date', e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                <Send className="h-4 w-4 mr-2" />
                Send OTP & Create Plan
              </Button>
            </div>
          </form>
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
