'use client';

import React, { useState } from 'react';
import { ZodError } from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { useOtp } from '@/lib/hooks/use-otp';
import { createDealer, sendDealerCreationOtp, getFranchise, getSubFranchise } from '@/lib/api/dealer.api';
import { getDealerType, getCategory, getCategoryByDealer } from '@/lib/api/masterdata.api';
import { dealerCreationSchema, type DealerCreationFormData } from '@/lib/schemas/dealer.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleSelector } from '@/components/shared/selectors/CircleSelector';
import { SSASelector } from '@/components/shared/selectors/SSASelector';
import { OTPVerificationModal } from '@/components/shared/modals/OTPVerificationModal';
import { LoadingState } from '@/components/shared/feedback/LoadingState';
import { ApiError } from '@/components/shared/feedback/ApiError';
import { FieldError } from '@/components/shared/forms/FieldError';
import {
  clearFieldError,
  focusFirstInvalidField,
  invalidInputClass,
  mapZodFieldErrors,
  type FieldErrors,
} from '@/lib/utils/form-validation';
import { ArrowLeft, Send, Upload } from 'lucide-react';

export default function NewDealerPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formData, setFormData] = useState<Partial<DealerCreationFormData>>({});
  const [certificateFile, setCertificateFile] = useState<File | null>(null);

  // Master data
  const [dealerTypes, setDealerTypes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [franchises, setFranchises] = useState<any[]>([]);
  const [subFranchises, setSubFranchises] = useState<any[]>([]);

  // OTP State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  const handleSendOtp = async () => {
    try {
      await sendDealerCreationOtp(formData.mobile || '');
    } catch (error: any) {
      throw error;
    }
  };

  const { sendOtp, verifyOtp, reset: resetOtp } = useOtp({
    msisdn: formData.mobile || '',
    operation: '10069',
    onSendOtp: handleSendOtp,
    onSuccess: () => {
      handleCreateDealer();
    },
    onError: (error) => {
      setOtpError(error);
    },
  });

  // Load master data
  React.useEffect(() => {
    const loadMasterData = async () => {
      try {
        const [types, cats] = await Promise.all([
          getDealerType(),
          getCategory(),
        ]);
        setDealerTypes(types);
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load master data:', err);
      }
    };
    loadMasterData();
  }, []);

  // Load categories based on dealer type
  React.useEffect(() => {
    if (formData.dealerType) {
      const loadCategories = async () => {
        try {
          const cats = await getCategoryByDealer(formData.dealerType || '');
          setCategories(cats);
        } catch (err) {
          console.error('Failed to load categories:', err);
        }
      };
      loadCategories();
    }
  }, [formData.dealerType]);

  // Load franchise based on mobile
  const handleFranchiseLookup = async (mobile: string) => {
    if (mobile.length === 10) {
      try {
        const franchise = await getFranchise(mobile);
        if (franchise) {
          setFranchises([franchise]);
        }
      } catch (err) {
        console.error('Failed to lookup franchise:', err);
      }
    }
  };

  const handleInputChange = (field: keyof DealerCreationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((previous) => clearFieldError(previous, field as string));

    if (field === 'mobile') {
      handleFranchiseLookup(value);
    }
  };

  const inputClassName = (field: string) => invalidInputClass(Boolean(fieldErrors[field]));

  const selectClassName = (field: string) =>
    `flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm ${fieldErrors[field] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCertificateFile(file);
    }
  };

  const handleSubmit = async () => {
    try {
      dealerCreationSchema.parse(formData);
      setFieldErrors({});
    } catch (err) {
      if (err instanceof ZodError) {
        setFieldErrors(mapZodFieldErrors(err));
        setError('Please correct the highlighted fields below');
        focusFirstInvalidField();
      } else {
        setError('Please fill in all required fields correctly');
      }
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

  const handleCreateDealer = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const dealerRequest = {
        firstName: formData.firstName!,
        lastName: formData.lastName!,
        mobile: formData.mobile!,
        scmMsisdn: formData.scmMsisdn || formData.mobile!,
        dob: formData.dob!,
        address: formData.address!,
        pincode: formData.pincode!,
        emailId: formData.emailId,
        dealerType: formData.dealerType!,
        circleId: formData.circleId!,
        ssaId: formData.ssaId!,
        category: formData.category!,
        franchiseMsisdn: formData.franchiseMsisdn,
        subFranchiseMsisdn: formData.subFranchiseMsisdn,
        aadhaarId: formData.aadhaarId,
        panId: formData.panId,
        gstNumber: formData.gstNumber,
        tds: formData.tds,
        tdsCategory: formData.tdsCategory,
        createdBy: user?.username || 'admin',
      };

      await createDealer(dealerRequest, certificateFile || undefined);
      router.push('/dealers');
    } catch (error: any) {
      setError(error.message || 'Failed to create dealer');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingState message="Creating dealer..." />
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
          <h1 className="text-2xl font-bold text-gray-900">Create New Dealer</h1>
          <p className="text-gray-500">Add a new dealer or franchise to the system</p>
        </div>
      </div>

      {error && <ApiError error={error} onRetry={() => setError(null)} />}

      <Card>
        <CardHeader>
          <CardTitle>Dealer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input
                  id="mobile"
                  value={formData.mobile || ''}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                  aria-invalid={Boolean(fieldErrors.mobile)}
                  className={inputClassName('mobile')}
                />
                <FieldError message={fieldErrors.mobile} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scmMsisdn">SCM MSISDN</Label>
                <Input
                  id="scmMsisdn"
                  value={formData.scmMsisdn || ''}
                  onChange={(e) => handleInputChange('scmMsisdn', e.target.value)}
                  placeholder="Enter SCM MSISDN (optional)"
                  maxLength={10}
                  aria-invalid={Boolean(fieldErrors.scmMsisdn)}
                  className={inputClassName('scmMsisdn')}
                />
                <FieldError message={fieldErrors.scmMsisdn} />
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
              <div className="space-y-2">
                <Label htmlFor="emailId">Email</Label>
                <Input
                  id="emailId"
                  type="email"
                  value={formData.emailId || ''}
                  onChange={(e) => handleInputChange('emailId', e.target.value)}
                  placeholder="Enter email (optional)"
                  aria-invalid={Boolean(fieldErrors.emailId)}
                  className={inputClassName('emailId')}
                />
                <FieldError message={fieldErrors.emailId} />
              </div>
            </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  value={formData.pincode || ''}
                  onChange={(e) => handleInputChange('pincode', e.target.value)}
                  placeholder="Enter 6-digit pincode"
                  maxLength={6}
                  aria-invalid={Boolean(fieldErrors.pincode)}
                  className={inputClassName('pincode')}
                />
                <FieldError message={fieldErrors.pincode} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dealerType">Dealer Type *</Label>
                <select
                  id="dealerType"
                  value={formData.dealerType || ''}
                  onChange={(e) => handleInputChange('dealerType', e.target.value)}
                  className={selectClassName('dealerType')}
                  aria-invalid={Boolean(fieldErrors.dealerType)}
                >
                  <option value="">Select Dealer Type</option>
                  {dealerTypes.map((type) => (
                    <option key={type.id} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
                <FieldError message={fieldErrors.dealerType} />
              </div>
            </div>

            <CircleSelector
              value={formData.circleId?.toString()}
              onChange={(value) => handleInputChange('circleId', parseInt(value))}
              error={fieldErrors.circleId}
            />

            <SSASelector
              value={formData.ssaId?.toString()}
              onChange={(value) => handleInputChange('ssaId', parseInt(value))}
              circleId={formData.circleId?.toString()}
              error={fieldErrors.ssaId}
            />

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                value={formData.category || ''}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={selectClassName('category')}
                aria-invalid={Boolean(fieldErrors.category)}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <FieldError message={fieldErrors.category} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="aadhaarId">Aadhaar Number</Label>
                <Input
                  id="aadhaarId"
                  value={formData.aadhaarId || ''}
                  onChange={(e) => handleInputChange('aadhaarId', e.target.value)}
                  placeholder="12-digit Aadhaar number"
                  maxLength={12}
                  aria-invalid={Boolean(fieldErrors.aadhaarId)}
                  className={inputClassName('aadhaarId')}
                />
                <FieldError message={fieldErrors.aadhaarId} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="panId">PAN Number</Label>
                <Input
                  id="panId"
                  value={formData.panId || ''}
                  onChange={(e) => handleInputChange('panId', e.target.value)}
                  placeholder="10-character PAN"
                  maxLength={10}
                  aria-invalid={Boolean(fieldErrors.panId)}
                  className={inputClassName('panId')}
                />
                <FieldError message={fieldErrors.panId} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gstNumber">GST Number</Label>
                <Input
                  id="gstNumber"
                  value={formData.gstNumber || ''}
                  onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                  placeholder="15-character GSTIN"
                  maxLength={15}
                  aria-invalid={Boolean(fieldErrors.gstNumber)}
                  className={inputClassName('gstNumber')}
                />
                <FieldError message={fieldErrors.gstNumber} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="certificate">Certificate Document</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="certificate"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="flex-1"
                />
                {certificateFile && (
                  <span className="text-sm text-gray-600">{certificateFile.name}</span>
                )}
              </div>
              <p className="text-xs text-gray-500">Upload KYC documents (PDF, JPG, PNG)</p>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                <Send className="h-4 w-4 mr-2" />
                Send OTP & Create Dealer
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
        msisdn={formData.mobile || ''}
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
