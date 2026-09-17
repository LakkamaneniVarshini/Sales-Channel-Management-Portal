'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { getUser, modifyUser, getUserPermissions, modifyPermissions, changeUserStatus, sendModifyUserOtp, sendModifyPermissionOtp, sendModifyStatusOtp } from '@/lib/api/user.api';
import { validateOtp } from '@/lib/api/masterdata.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/feedback/StatusBadge';
import { LoadingState } from '@/components/shared/feedback/LoadingState';
import { ApiError } from '@/components/shared/feedback/ApiError';
import { OTPVerificationModal } from '@/components/shared/modals/OTPVerificationModal';
import { ArrowLeft, Edit, Lock, Unlock, Settings } from 'lucide-react';
import type { User, UserPermissions } from '@/lib/types/api.types';

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user: currentUser } = useAuth();
  const username = params.username as string;

  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<User>>({});

  // OTP Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpOperation, setOtpOperation] = useState<'edit' | 'permission' | 'status'>('edit');
  const [otpError, setOtpError] = useState<string | null>(null);

  const fetchUserData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const userData = await getUser(username);
      setUser(userData);
      setEditData(userData);

      const userPermissions = await getUserPermissions(userData.hrmsId, username, currentUser?.username || '');
      setPermissions(userPermissions);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchUserData();
  }, [username, currentUser?.username]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setError(null);

    try {
      // Trigger OTP for user edit
      setOtpOperation('edit');
      setShowOtpModal(true);
      await sendModifyUserOtp(user?.mobileNumber || '');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
      setIsLoading(false);
    }
  };

  const handleOtpVerified = async () => {
    setIsSubmitting(true);
    try {
      // Execute the actual operation based on OTP operation type
      if (otpOperation === 'edit') {
        await modifyUser(username, user?.hrmsId || '');
      } else if (otpOperation === 'permission') {
        await modifyPermissions(currentUser?.username || '', username);
      } else if (otpOperation === 'status') {
        const newStatus = user?.status === 1 ? 0 : 1;
        await changeUserStatus(user?.hrmsId || '', username, currentUser?.username || '', newStatus);
      }

      await fetchUserData();
      setIsEditing(false);
      setShowOtpModal(false);
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async () => {
    if (!user) return;

    setError(null);

    try {
      setOtpOperation('status');
      setShowOtpModal(true);
      await sendModifyStatusOtp(user.mobileNumber);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
      setShowOtpModal(false);
    }
  };

  const handlePermissionEdit = async () => {
    if (!user) return;

    setError(null);

    try {
      setOtpOperation('permission');
      setShowOtpModal(true);
      await sendModifyPermissionOtp(user.mobileNumber);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
      setShowOtpModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingState message="Loading user details..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="p-6">
            <p className="text-center text-gray-500">User not found</p>
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
            <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
            <p className="text-gray-500">{user.username}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleStatusChange} disabled={isSubmitting}>
            {user.status === 1 ? (
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
          <Button variant="outline" onClick={handlePermissionEdit} disabled={isSubmitting}>
            <Settings className="h-4 w-4 mr-2" />
            Permissions
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
                <Label>HRMS ID</Label>
                <p className="text-sm text-gray-600">{user.hrmsId}</p>
              </div>
              <div>
                <Label>Username</Label>
                <p className="text-sm text-gray-600">{user.username}</p>
              </div>
              <div>
                <Label>First Name</Label>
                {isEditing ? (
                  <Input
                    value={editData.firstName || ''}
                    onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-gray-600">{user.firstName}</p>
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
                  <p className="text-sm text-gray-600">{user.lastName}</p>
                )}
              </div>
              <div>
                <Label>Mobile</Label>
                <p className="text-sm text-gray-600">{user.mobileNumber}</p>
              </div>
              <div>
                <Label>Date of Birth</Label>
                <p className="text-sm text-gray-600">{user.dob}</p>
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
                <p className="text-sm text-gray-600">{user.address}</p>
              )}
            </div>
            <div>
              <Label>Status</Label>
              <StatusBadge status={user.status} />
            </div>
          </CardContent>
        </Card>

        {/* Location & Role */}
        <Card>
          <CardHeader>
            <CardTitle>Location & Role</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Zone ID</Label>
                <p className="text-sm text-gray-600">{user.zoneId}</p>
              </div>
              <div>
                <Label>Circle ID</Label>
                <p className="text-sm text-gray-600">{user.circleId}</p>
              </div>
              <div>
                <Label>SSA ID</Label>
                <p className="text-sm text-gray-600">{user.ssaId}</p>
              </div>
              <div>
                <Label>Role ID</Label>
                <p className="text-sm text-gray-600">{user.roleId}</p>
              </div>
            </div>
            <div>
              <Label>Role Name</Label>
              <p className="text-sm text-gray-600">{user.roleName || 'Not specified'}</p>
            </div>
            <div>
              <Label>Created Date</Label>
              <p className="text-sm text-gray-600">{new Date(user.cdt).toLocaleDateString()}</p>
            </div>
            <div>
              <Label>Last Modified</Label>
              <p className="text-sm text-gray-600">{new Date(user.mdt).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            {permissions ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(permissions).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className={`text-xs px-2 py-1 rounded ${value === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                      {value === 1 ? 'Granted' : 'Denied'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No permissions data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      <OTPVerificationModal
        isOpen={showOtpModal}
        onClose={() => {
          setShowOtpModal(false);
        }}
        msisdn={user.mobileNumber}
        operation="10069"
        onVerified={handleOtpVerified}
        onError={(error) => {
          setOtpError(error);
        }}
        onVerify={(otp) => validateOtp({ otp, operation: '10069', msisdn: user.mobileNumber }).then(() => true)}
      />
    </div>
  );
}
