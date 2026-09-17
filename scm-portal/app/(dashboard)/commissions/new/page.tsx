'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ZodError } from 'zod';
import { useAuth } from '@/lib/hooks/use-auth';
import { useOtp } from '@/lib/hooks/use-otp';
import { addCommission, sendLandlineOtp, sendPostpaidOtp, sendPrepaidFrcOtp, sendPrepaidOtfOtp } from '@/lib/api/commission.api';
import { prepaidCommissionSchema, postpaidCommissionSchema, landlineCommissionSchema } from '@/lib/schemas/commission.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleSelector } from '@/components/shared/selectors/CircleSelector';
import { ZoneSelector } from '@/components/shared/selectors/ZoneSelector';
import { OTPVerificationModal } from '@/components/shared/modals/OTPVerificationModal';
import { LoadingState } from '@/components/shared/feedback/LoadingState';
import { ApiError } from '@/components/shared/feedback/ApiError';
import { ArrowLeft, Send } from 'lucide-react';

type FieldErrors = Record<string, string>;

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-sm text-red-600">{message}</p> : null;
}

export default function NewCommissionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const type = (searchParams.get('type') as 'prepaid-frc' | 'prepaid-otf' | 'postpaid' | 'landline') || 'prepaid-frc';

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // OTP State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  useEffect(() => {
    if (type === 'prepaid-frc' || type === 'prepaid-otf') {
      setFormData((previous: any) => ({
        ...previous,
        dtype: type === 'prepaid-frc' ? 'FRC' : 'OTF',
      }));
    }
  }, [type]);

  const handleSendOtp = async () => {
    const msisdn = user?.mobileNumber || '';
    if (type === 'prepaid-frc') return sendPrepaidFrcOtp(msisdn);
    if (type === 'prepaid-otf') return sendPrepaidOtfOtp(msisdn);
    if (type === 'postpaid') return sendPostpaidOtp(msisdn);
    return sendLandlineOtp(msisdn);
  };

  const { sendOtp, verifyOtp, reset: resetOtp } = useOtp({
    msisdn: user?.mobileNumber || '',
    operation: '10069',
    onSendOtp: async () => {
      await handleSendOtp();
    },
    onSuccess: () => {
      handleCreateCommission();
    },
    onError: (error) => {
      setOtpError(error);
    },
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    setFieldErrors((previous) => {
      if (!previous[field]) return previous;
      const { [field]: _, ...remaining } = previous;
      return remaining;
    });
  };

  const inputClassName = (field: string) => fieldErrors[field] ? 'border-red-500 focus:ring-red-500' : '';

  const handleSubmit = async () => {
    try {
      if (type === 'prepaid-frc' || type === 'prepaid-otf') {
        prepaidCommissionSchema.parse(formData);
      } else if (type === 'postpaid') {
        postpaidCommissionSchema.parse(formData);
      } else if (type === 'landline') {
        landlineCommissionSchema.parse(formData);
      }
    } catch (err) {
      if (err instanceof ZodError) {
        const nextErrors = err.issues.reduce<FieldErrors>((errors, issue) => {
          const field = String(issue.path[0] || 'form');
          errors[field] = issue.message;
          return errors;
        }, {});
        setFieldErrors(nextErrors);
        setError('Review the highlighted fields before sending the OTP.');
        requestAnimationFrame(() => {
          const firstInvalid = document.querySelector<HTMLElement>('[aria-invalid="true"]');
          firstInvalid?.focus();
          firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        return;
      }
      setError('Unable to validate the commission details.');
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

  const handleCreateCommission = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const username = user?.username || '';
      const commissionRequest = type === 'postpaid'
        ? {
            categoryId: formData.categoryId,
            circleId: formData.circleId,
            tdsAmount: formData.tdsAmount,
            fraCommission: formData.fraCommission,
            subFraCommission: 0,
            actualCommission: formData.actualCommission,
            retailerCommission: 0,
            sellerLevel: formData.sellerLevel,
            cap_limit: formData.cap_limit,
            createdGuiUser: username,
            zoneId: formData.zoneId,
          }
        : type === 'landline'
          ? {
              categoryId: formData.categoryId,
              circleId: formData.circleId,
              tdsAmount: formData.tdsAmount,
              fraCommission: 0,
              subFraCommission: 0,
              retailerCommission: 0,
              sellerLevel: formData.sellerLevel,
              commissionId: formData.commissionId || '',
              commissionAmount: formData.commissionAmount,
              fromAmount: formData.fromAmount,
              toAmount: formData.toAmount,
              dtype: formData.dtype,
              zoneId: formData.zoneId,
              createdGuiUser: username,
            }
          : {
              masterCategoryId: formData.masterCategoryId,
              circleId: formData.circleId,
              sellerCommission: formData.sellerCommission,
              fraCommission: formData.fraCommission,
              subCommission: formData.subCommission,
              tds: formData.tds,
              denomination: formData.denomination,
              categoryId: formData.categoryId,
              commissionType: formData.commissionType,
              dtype: type === 'prepaid-frc' ? 'FRC' : 'OTF',
              createdGuiUser: username,
            };

      await addCommission(commissionRequest, type);
      router.push('/commissions');
    } catch (error: any) {
      setError(error.message || 'Failed to create commission');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingState message="Creating commission..." />
      </div>
    );
  }

  const isPrepaid = type === 'prepaid-frc' || type === 'prepaid-otf';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Add {type === 'prepaid-frc' ? 'Prepaid FRC' : type === 'prepaid-otf' ? 'Prepaid OTF' : type === 'postpaid' ? 'Postpaid' : 'Landline'} Commission
          </h1>
          <p className="text-gray-500">Add a new commission configuration</p>
        </div>
      </div>

      {error && <ApiError error={error} onRetry={() => setError(null)} />}

      <Card>
        <CardHeader>
          <CardTitle>Commission Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoryId">Category ID *</Label>
                <Input
                  id="categoryId"
                  value={formData.categoryId || ''}
                  onChange={(e) => handleInputChange('categoryId', e.target.value)}
                  placeholder="Enter category ID"
                  className={inputClassName('categoryId')}
                  aria-invalid={Boolean(fieldErrors.categoryId)}
                />
                <FieldError message={fieldErrors.categoryId} />
              </div>
              {isPrepaid && <div className="space-y-2">
                <Label htmlFor="masterCategoryId">Master Category ID *</Label>
                <Input
                  id="masterCategoryId"
                  value={formData.masterCategoryId || ''}
                  onChange={(e) => handleInputChange('masterCategoryId', e.target.value)}
                  placeholder="Enter master category ID"
                  className={inputClassName('masterCategoryId')}
                  aria-invalid={Boolean(fieldErrors.masterCategoryId)}
                />
                <FieldError message={fieldErrors.masterCategoryId} />
              </div>}
              {isPrepaid && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="denomination">Denomination *</Label>
                    <Input
                      id="denomination"
                      value={formData.denomination || ''}
                      onChange={(e) => handleInputChange('denomination', e.target.value)}
                      placeholder="Enter denomination"
                      className={inputClassName('denomination')}
                      aria-invalid={Boolean(fieldErrors.denomination)}
                    />
                    <FieldError message={fieldErrors.denomination} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="commissionType">Commission Type *</Label>
                    <Input
                      id="commissionType"
                      value={formData.commissionType || ''}
                      onChange={(e) => handleInputChange('commissionType', e.target.value)}
                      placeholder="Enter commission type"
                      className={inputClassName('commissionType')}
                      aria-invalid={Boolean(fieldErrors.commissionType)}
                    />
                    <FieldError message={fieldErrors.commissionType} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dtype">Dtype *</Label>
                    <select
                      id="dtype"
                      value={formData.dtype || ''}
                      onChange={(e) => handleInputChange('dtype', e.target.value)}
                      disabled
                      aria-invalid={Boolean(fieldErrors.dtype)}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                    >
                      <option value="FRC">FRC</option>
                      <option value="OTF">OTF</option>
                    </select>
                    <FieldError message={fieldErrors.dtype} />
                  </div>
                </>
              )}
              {!isPrepaid && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="sellerLevel">Seller Level *</Label>
                    <Input
                      id="sellerLevel"
                      value={formData.sellerLevel || ''}
                      onChange={(e) => handleInputChange('sellerLevel', e.target.value)}
                      placeholder="Enter seller level"
                      className={inputClassName('sellerLevel')}
                      aria-invalid={Boolean(fieldErrors.sellerLevel)}
                    />
                    <FieldError message={fieldErrors.sellerLevel} />
                  </div>
                  {type === 'landline' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="dtype">Dtype *</Label>
                        <Input
                          id="dtype"
                          value={formData.dtype || ''}
                          onChange={(e) => handleInputChange('dtype', e.target.value)}
                          placeholder="Enter dtype"
                          className={inputClassName('dtype')}
                          aria-invalid={Boolean(fieldErrors.dtype)}
                        />
                        <FieldError message={fieldErrors.dtype} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="commissionId">Commission ID</Label>
                        <Input
                          id="commissionId"
                          value={formData.commissionId || ''}
                          onChange={(e) => handleInputChange('commissionId', e.target.value)}
                          placeholder="Enter commission ID if required"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fromAmount">From Amount *</Label>
                        <Input
                          id="fromAmount"
                          value={formData.fromAmount || ''}
                          onChange={(e) => handleInputChange('fromAmount', e.target.value)}
                          placeholder="Enter from amount"
                          className={inputClassName('fromAmount')}
                          aria-invalid={Boolean(fieldErrors.fromAmount)}
                        />
                        <FieldError message={fieldErrors.fromAmount} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="toAmount">To Amount *</Label>
                        <Input
                          id="toAmount"
                          value={formData.toAmount || ''}
                          onChange={(e) => handleInputChange('toAmount', e.target.value)}
                          placeholder="Enter to amount"
                          className={inputClassName('toAmount')}
                          aria-invalid={Boolean(fieldErrors.toAmount)}
                        />
                        <FieldError message={fieldErrors.toAmount} />
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            <CircleSelector
              value={formData.circleId || ''}
              onChange={(value) => handleInputChange('circleId', value)}
              error={fieldErrors.circleId}
            />

            {!isPrepaid && (
              <ZoneSelector
                value={formData.zoneId || ''}
                onChange={(value) => handleInputChange('zoneId', value)}
                error={fieldErrors.zoneId}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sellerCommission">Seller Commission *</Label>
                <Input
                  id="sellerCommission"
                  value={formData.sellerCommission || formData.actualCommission || formData.commissionAmount || ''}
                  onChange={(e) => handleInputChange(type === 'postpaid' ? 'actualCommission' : type === 'landline' ? 'commissionAmount' : 'sellerCommission', e.target.value)}
                  placeholder="Enter seller commission"
                  className={inputClassName(type === 'postpaid' ? 'actualCommission' : type === 'landline' ? 'commissionAmount' : 'sellerCommission')}
                  aria-invalid={Boolean(fieldErrors[type === 'postpaid' ? 'actualCommission' : type === 'landline' ? 'commissionAmount' : 'sellerCommission'])}
                />
                <FieldError message={fieldErrors[type === 'postpaid' ? 'actualCommission' : type === 'landline' ? 'commissionAmount' : 'sellerCommission']} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fraCommission">FRA Commission *</Label>
                <Input
                  id="fraCommission"
                  value={formData.fraCommission || ''}
                  onChange={(e) => handleInputChange('fraCommission', e.target.value)}
                  placeholder="Enter FRA commission"
                  className={inputClassName('fraCommission')}
                  aria-invalid={Boolean(fieldErrors.fraCommission)}
                />
                <FieldError message={fieldErrors.fraCommission} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subCommission">Sub Commission *</Label>
                <Input
                  id="subCommission"
                  value={formData.subCommission || ''}
                  onChange={(e) => handleInputChange('subCommission', e.target.value)}
                  placeholder="Enter sub commission"
                  className={inputClassName('subCommission')}
                  aria-invalid={Boolean(fieldErrors.subCommission)}
                />
                <FieldError message={fieldErrors.subCommission} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tds">TDS *</Label>
                <Input
                  id="tds"
                  value={formData.tds || formData.tdsAmount || ''}
                  onChange={(e) => handleInputChange(type === 'postpaid' || type === 'landline' ? 'tdsAmount' : 'tds', e.target.value)}
                  placeholder="Enter TDS"
                  className={inputClassName(type === 'postpaid' || type === 'landline' ? 'tdsAmount' : 'tds')}
                  aria-invalid={Boolean(fieldErrors[type === 'postpaid' || type === 'landline' ? 'tdsAmount' : 'tds'])}
                />
                <FieldError message={fieldErrors[type === 'postpaid' || type === 'landline' ? 'tdsAmount' : 'tds']} />
              </div>
              {type === 'postpaid' && (
                <div className="space-y-2">
                  <Label htmlFor="cap_limit">Cap Limit *</Label>
                  <Input
                    id="cap_limit"
                    value={formData.cap_limit || ''}
                    onChange={(e) => handleInputChange('cap_limit', e.target.value)}
                    placeholder="Enter cap limit"
                    className={inputClassName('cap_limit')}
                    aria-invalid={Boolean(fieldErrors.cap_limit)}
                  />
                  <FieldError message={fieldErrors.cap_limit} />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                <Send className="h-4 w-4 mr-2" />
                Send OTP & Create Commission
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
