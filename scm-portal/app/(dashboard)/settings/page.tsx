'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/hooks/use-auth';
import { changePassword, sendChangePasswordOtp } from '@/lib/api/user.api';
import { useOtp } from '@/lib/hooks/use-otp';
import { OTPVerificationModal } from '@/components/shared/modals/OTPVerificationModal';
import { ApiError } from '@/components/shared/feedback/ApiError';

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { sendOtp, verifyOtp, reset: resetOtp } = useOtp({
    msisdn: user?.mobileNumber || '',
    operation: '10069',
    onSendOtp: () => sendChangePasswordOtp(user?.mobileNumber || ''),
    onSuccess: async () => {
      await changePassword({
        hrmsId: user?.hrmsId || '',
        username: user?.username || '',
        oldPassword: currentPassword,
        newPassword,
        operation: '10069',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess('Password changed successfully.');
    },
    onError: (message) => setError(message),
  });

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || newPassword !== confirmPassword) {
      setError('Enter your current password and matching new passwords.');
      return;
    }
    setError(null);
    setSuccess(null);
    setShowOtpModal(true);
    await sendOtp();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" defaultValue={user?.firstName || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" defaultValue={user?.lastName || ''} disabled />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" defaultValue={user?.username || ''} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Mobile</Label>
            <Input id="email" defaultValue={user?.mobileNumber || ''} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hrmsId">HRMS ID</Label>
            <Input id="hrmsId" defaultValue={user?.hrmsId || ''} disabled />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wallet Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push('/settings/wallet')}>
            Wallet Adjustment
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <ApiError error={error} onRetry={() => setError(null)} />}
          {success && <p className="rounded-md bg-green-50 p-3 text-sm text-green-700">{success}</p>}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input id="currentPassword" type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
          </div>

          <Button onClick={handlePasswordChange}>Send OTP & Change Password</Button>
        </CardContent>
      </Card>

      <OTPVerificationModal
        isOpen={showOtpModal}
        onClose={() => { setShowOtpModal(false); resetOtp(); }}
        msisdn={user?.mobileNumber || ''}
        operation="10069"
        onVerify={verifyOtp}
        onResend={sendOtp}
        onVerified={() => setShowOtpModal(false)}
        onError={setError}
      />
    </div>
  );
}
