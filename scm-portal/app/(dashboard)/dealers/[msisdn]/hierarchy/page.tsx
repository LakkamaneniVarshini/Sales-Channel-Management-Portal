'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { useOtp } from '@/lib/hooks/use-otp';
import {
  changeDealerHierarchy,
  getDealerList,
  getDealerWithMobile,
  sendDealerHierarchyChangeOtp,
} from '@/lib/api/dealer.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormSection } from '@/components/shared/forms/FormSection';
import { ConfirmationDialog } from '@/components/shared/modals/ConfirmationDialog';
import { OTPVerificationModal } from '@/components/shared/modals/OTPVerificationModal';
import { LoadingState } from '@/components/shared/feedback/LoadingState';
import { ApiError } from '@/components/shared/feedback/ApiError';
import { PageHeader } from '@/components/shared/navigation/PageHeader';
import { ArrowLeft } from 'lucide-react';

export default function DealerHierarchyPage() {
  const router = useRouter();
  const params = useParams();
  const msisdn = params.msisdn as string;
  const { user } = useAuth();

  const [tree, setTree] = useState<Array<{ msisdn: string; name: string }>>([]);
  const [srcMsisdn, setSrcMsisdn] = useState(msisdn);
  const [destMsisdn, setDestMsisdn] = useState('');
  const [type, setType] = useState('1');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const loadHierarchy = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const list = await getDealerList(msisdn, user?.username || '');
      setTree(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dealer hierarchy');
    } finally {
      setIsLoading(false);
    }
  };

  const applyHierarchyChange = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await changeDealerHierarchy(srcMsisdn, destMsisdn, user?.username || '', type);
      setShowOtpModal(false);
      setShowConfirm(false);
      await loadHierarchy();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change hierarchy');
    } finally {
      setIsLoading(false);
    }
  };

  const { sendOtp, verifyOtp, reset: resetOtp } = useOtp({
    msisdn: user?.mobileNumber || '',
    operation: '10069',
    onSendOtp: async () => {
      await sendDealerHierarchyChangeOtp(user?.mobileNumber || '');
    },
    onSuccess: () => {
      void applyHierarchyChange();
    },
    onError: (message) => setError(message),
  });

  useEffect(() => {
    void loadHierarchy();
  }, [msisdn, user?.username]);

  const handleConfirm = async () => {
    setShowConfirm(false);
    setShowOtpModal(true);
    await sendOtp();
  };

  const validateDest = async () => {
    if (!destMsisdn) {
      setError('Destination MSISDN is required');
      return;
    }
    try {
      await getDealerWithMobile(destMsisdn, user?.username || '');
      setShowConfirm(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid destination dealer');
    }
  };

  if (isLoading && tree.length === 0) {
    return <LoadingState message="Loading dealer hierarchy..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dealer Hierarchy"
        description={`Manage hierarchy for dealer ${msisdn}`}
        breadcrumbs={[
          { label: 'Dealer Management', href: '/dealers' },
          { label: msisdn, href: `/dealers/${msisdn}` },
          { label: 'Hierarchy' },
        ]}
        actions={
          <Button variant="ghost" onClick={() => router.push(`/dealers/${msisdn}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dealer
          </Button>
        }
      />

      {error ? <ApiError error={error} onRetry={() => setError(null)} /> : null}

      <FormSection title="Current Hierarchy" description="Dealers under this node">
        {tree.length === 0 ? (
          <p className="text-sm text-gray-500">No child dealers found.</p>
        ) : (
          <ul className="space-y-2">
            {tree.map((dealer) => (
              <li key={dealer.msisdn} className="rounded-md border px-3 py-2 text-sm">
                {dealer.name} ({dealer.msisdn})
              </li>
            ))}
          </ul>
        )}
      </FormSection>

      <FormSection title="Change Hierarchy" description="Move a dealer under a new parent">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="srcMsisdn">Source MSISDN</Label>
            <Input id="srcMsisdn" value={srcMsisdn} onChange={(e) => setSrcMsisdn(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="destMsisdn">Parent MSISDN</Label>
            <Input id="destMsisdn" value={destMsisdn} onChange={(e) => setDestMsisdn(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Hierarchy Type</Label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              <option value="1">Standard</option>
              <option value="2">Franchise</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <Button onClick={() => void validateDest()}>Change Hierarchy</Button>
        </div>
      </FormSection>

      <ConfirmationDialog
        isOpen={showConfirm}
        title="Confirm Hierarchy Change"
        description={`Move dealer ${srcMsisdn} under parent ${destMsisdn}? OTP verification is required.`}
        confirmLabel="Send OTP"
        onConfirm={() => void handleConfirm()}
        onCancel={() => setShowConfirm(false)}
      />

      <OTPVerificationModal
        isOpen={showOtpModal}
        onClose={() => {
          setShowOtpModal(false);
          resetOtp();
        }}
        msisdn={user?.mobileNumber || ''}
        operation="10069"
        onVerified={() => setShowOtpModal(false)}
        onError={(message) => setError(message)}
        onVerify={verifyOtp}
        onResend={sendOtp}
      />
    </div>
  );
}
