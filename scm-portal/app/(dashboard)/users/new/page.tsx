'use client';

import React, { useState } from 'react';
import { ZodError } from 'zod';
import { mapZodFieldErrors, clearFieldError } from '@/lib/utils/form-validation';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { useOtp } from '@/lib/hooks/use-otp';
import { createUser, sendUserCreationOtp } from '@/lib/api/user.api';
import { userCreationSchema, type UserCreationFormData } from '@/lib/schemas/user.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ZoneSelector } from '@/components/shared/selectors/ZoneSelector';
import { CircleSelector } from '@/components/shared/selectors/CircleSelector';
import { SSASelector } from '@/components/shared/selectors/SSASelector';
import { OTPVerificationModal } from '@/components/shared/modals/OTPVerificationModal';
import { LoadingState } from '@/components/shared/feedback/LoadingState';
import { ApiError } from '@/components/shared/feedback/ApiError';
import { ArrowLeft, Send } from 'lucide-react';

type FieldErrors = Record<string, string>;

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-sm text-red-600">{message}</p> : null;
}

export default function NewUserPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserCreationFormData>>({
    status: 1,
    roleId: 3,
    permissions: {
      dealerPermissions: 0,
      walletPermissions: 0,
      userPermissions: 0,
      commissionPermissions: 0,
      plansNumberpermissions: 0,
      reportsPermissions: 0,
      stockCheck: 0,
      dealerMpinReset: 0,
      franchiseAddBalance: 0,
      bulkRecharge: 0,
      varepReports: 0,
      userActivityReports: 0,
      dealerStatus: 0,
      transactionStatus: 0,
      topupReversal: 0,
      simSaleUpload: 0,
      simInventory: 0,
      pendingClearence: 0,
      inReconsilation: 0,
      mobileApp: 0,
      deferredCommission: 0,
      cbp: 0,
      simUpgrade: 0,
      mnp: 0,
      frcStv: 0,
      bulk_purge: 0,
      e_auction: 0,
      denominations: 0,
      prepaidCommissions: 0,
      postpaidCommissions: 0,
      landlineCommissions: 0,
      FOSCreation: 0,
    },
  });

  // OTP State
  const [showOtpModal, setShowOtpModal] = useState(false);

  const { sendOtp, verifyOtp, reset: resetOtp } = useOtp({
    msisdn: formData.mobileNumber || '',
    operation: '10069',
    onSendOtp: async () => {
      await sendUserCreationOtp(formData.mobileNumber || '');
    },
    onSuccess: () => {
      handleCreateUser();
    },
    onError: (error) => {
      setError(error);
    },
  });

  const handleInputChange = (field: keyof UserCreationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((previous) => clearFieldError(previous, field as string));
  };

  const inputClassName = (field: string) =>
    fieldErrors[field] ? 'border-red-500 focus:ring-red-500' : '';

  const handlePermissionChange = (permission: keyof UserCreationFormData['permissions'], value: number) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: value,
      } as any,
    }));
  };

  const validateStep = (step: number): boolean => {
    try {
      if (step === 1) {
        userCreationSchema.pick({
          hrmsId: true,
          username: true,
          mobileNumber: true,
          firstName: true,
          lastName: true,
          dob: true,
        }).parse(formData);
      } else if (step === 2) {
        userCreationSchema.pick({
          address: true,
          zoneId: true,
          circleId: true,
          ssaId: true,
        }).parse(formData);
      } else if (step === 3) {
        userCreationSchema.pick({
          roleId: true,
          password: true,
          status: true,
        }).parse(formData);
      }
      setFieldErrors({});
      return true;
    } catch (validationError) {
      if (validationError instanceof ZodError) {
        setFieldErrors(mapZodFieldErrors(validationError));
        setError('Please correct the highlighted fields below');
      } else {
        setError('Please fill in all required fields correctly');
      }
      return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setError(null);
      setFieldErrors({});
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setError(null);
    setFieldErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setError(null);

    try {
      // Trigger OTP workflow - don't set full-page loading
      setShowOtpModal(true);
      await sendOtp();
    } catch (error: any) {
      setError(error.message || 'Failed to send OTP');
    }
  };

  const handleCreateUser = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const userRequest = {
        userId: Date.now().toString(),
        hrmsId: formData.hrmsId!,
        username: formData.username!,
        mobileNumber: formData.mobileNumber!,
        createdBy: user?.username || 'admin',
        updatedBy: null,
        firstName: formData.firstName!,
        lastName: formData.lastName!,
        address: formData.address!,
        status: formData.status!,
        cdt: new Date().toISOString(),
        mdt: new Date().toISOString(),
        roleId: formData.roleId!,
        passwordChangeDate: new Date().toISOString(),
        ssaId: formData.ssaId!,
        circleId: formData.circleId!,
        dob: formData.dob!,
        password: formData.password!,
        ipAddress: '192.168.1.1',
        expiredate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        userIpAddress: '192.168.1.1',
        loginStatus: '1',
        zoneId: formData.zoneId!,
        roleName: null,
        permissions: {
          ...formData.permissions!,
          roleId: formData.roleId!,
          username: formData.username!,
          hrmsId: formData.hrmsId!,
        },
      };

      await createUser(userRequest);
      router.push('/users');
    } catch (error: any) {
      setError(error.message || 'Failed to create user');
      setIsLoading(false);
    }
  };

  const permissionGroups = [
    {
      name: 'User Management',
      permissions: ['userPermissions', 'dealerPermissions', 'dealerStatus', 'dealerMpinReset', 'FOSCreation'] as const,
    },
    {
      name: 'Commission Management',
      permissions: ['commissionPermissions', 'prepaidCommissions', 'postpaidCommissions', 'landlineCommissions', 'denominations'] as const,
    },
    {
      name: 'Plan & Number Management',
      permissions: ['plansNumberpermissions', 'mnp', 'frcStv', 'bulk_purge', 'e_auction'] as const,
    },
    {
      name: 'Wallet & Financial',
      permissions: ['walletPermissions', 'franchiseAddBalance', 'bulkRecharge', 'topupReversal', 'cbp'] as const,
    },
    {
      name: 'Reports & Analytics',
      permissions: ['reportsPermissions', 'varepReports', 'userActivityReports', 'transactionStatus', 'stockCheck'] as const,
    },
    {
      name: 'Inventory & Operations',
      permissions: ['simSaleUpload', 'simInventory', 'pendingClearence', 'inReconsilation', 'simUpgrade'] as const,
    },
    {
      name: 'Mobile & Advanced',
      permissions: ['mobileApp', 'deferredCommission'] as const,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingState message="Creating user..." />
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
          <h1 className="text-2xl font-bold text-gray-900">Create New User</h1>
          <p className="text-gray-500">Step {currentStep} of 4</p>
        </div>
      </div>

      {error && <ApiError error={error} onRetry={() => setError(null)} />}

      <Card>
        <CardHeader>
          <CardTitle>
            {currentStep === 1 && 'Personal Information'}
            {currentStep === 2 && 'Location Information'}
            {currentStep === 3 && 'Role & Security'}
            {currentStep === 4 && 'Permissions'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hrmsId">HRMS ID *</Label>
                  <Input
                    id="hrmsId"
                    value={formData.hrmsId || ''}
                    onChange={(e) => handleInputChange('hrmsId', e.target.value)}
                    placeholder="Enter HRMS ID"
                    aria-invalid={Boolean(fieldErrors.hrmsId)}
                    className={inputClassName('hrmsId')}
                  />
                  <FieldError message={fieldErrors.hrmsId} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    value={formData.username || ''}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder="Enter username"
                    aria-invalid={Boolean(fieldErrors.username)}
                    className={inputClassName('username')}
                  />
                  <FieldError message={fieldErrors.username} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobileNumber">Mobile Number *</Label>
                  <Input
                    id="mobileNumber"
                    value={formData.mobileNumber || ''}
                    onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                    maxLength={10}
                    aria-invalid={Boolean(fieldErrors.mobileNumber)}
                    className={inputClassName('mobileNumber')}
                  />
                  <FieldError message={fieldErrors.mobileNumber} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName || ''}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter first name"
                    aria-invalid={Boolean(fieldErrors.firstName)}
                    className={inputClassName('firstName')}
                  />
                  <FieldError message={fieldErrors.firstName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName || ''}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter last name"
                    aria-invalid={Boolean(fieldErrors.lastName)}
                    className={inputClassName('lastName')}
                  />
                  <FieldError message={fieldErrors.lastName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth *</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dob || ''}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                    aria-invalid={Boolean(fieldErrors.dob)}
                    className={inputClassName('dob')}
                  />
                  <FieldError message={fieldErrors.dob} />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter full address"
                  aria-invalid={Boolean(fieldErrors.address)}
                  className={inputClassName('address')}
                />
                <FieldError message={fieldErrors.address} />
              </div>

              <ZoneSelector
                value={formData.zoneId?.toString()}
                onChange={(value) => handleInputChange('zoneId', parseInt(value))}
                error={fieldErrors.zoneId}
              />

              <CircleSelector
                value={formData.circleId?.toString()}
                onChange={(value) => handleInputChange('circleId', parseInt(value))}
                zoneId={formData.zoneId?.toString()}
                useZoneBased={true}
                error={fieldErrors.circleId}
              />

              <SSASelector
                value={formData.ssaId?.toString()}
                onChange={(value) => handleInputChange('ssaId', parseInt(value))}
                circleId={formData.circleId?.toString()}
                error={fieldErrors.ssaId}
              />
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roleId">Role *</Label>
                  <select
                    id="roleId"
                    value={formData.roleId || ''}
                    onChange={(e) => handleInputChange('roleId', parseInt(e.target.value))}
                    aria-invalid={Boolean(fieldErrors.roleId)}
                    className={`flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm ${inputClassName('roleId') || 'border-gray-300'}`}
                  >
                    <option value="">Select Role</option>
                    <option value="1">Admin</option>
                    <option value="2">Manager</option>
                    <option value="3">User</option>
                  </select>
                  <FieldError message={fieldErrors.roleId} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <select
                    id="status"
                    value={formData.status ?? ''}
                    onChange={(e) => handleInputChange('status', parseInt(e.target.value))}
                    aria-invalid={Boolean(fieldErrors.status)}
                    className={`flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm ${inputClassName('status') || 'border-gray-300'}`}
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                  <FieldError message={fieldErrors.status} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password || ''}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter password (min 8 characters)"
                    aria-invalid={Boolean(fieldErrors.password)}
                    className={inputClassName('password')}
                  />
                  <FieldError message={fieldErrors.password} />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-4">Permission Configuration</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Select the permissions this user should have. Each permission grants access to specific features.
                </p>

                {permissionGroups.map((group) => (
                  <div key={group.name} className="mb-6">
                    <h4 className="font-medium text-sm text-gray-700 mb-3">{group.name}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {group.permissions.map((permission) => (
                        <div key={permission} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={permission}
                            checked={formData.permissions?.[permission] === 1}
                            onChange={(e) => handlePermissionChange(permission, e.target.checked ? 1 : 0)}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300"
                          />
                          <label htmlFor={permission} className="text-sm">
                            {permission.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Back
            </Button>
            {currentStep < 4 ? (
              <Button onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isLoading}>
                <Send className="h-4 w-4 mr-2" />
                Send OTP & Create User
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <OTPVerificationModal
        isOpen={showOtpModal}
        onClose={() => {
          setShowOtpModal(false);
          resetOtp();
          setIsLoading(false);
        }}
        msisdn={formData.mobileNumber || ''}
        operation="10069"
        onVerified={() => {
          setShowOtpModal(false);
        }}
        onError={(error) => {
          setError(error);
        }}
        onVerify={verifyOtp}
        onResend={sendOtp}
      />
    </div>
  );
}
