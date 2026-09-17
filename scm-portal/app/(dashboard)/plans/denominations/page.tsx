'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/use-auth';
import { useOtp } from '@/lib/hooks/use-otp';
import { fetchRechargePlan, saveDenomination, sendDenominationConfigurationOtp } from '@/lib/api/plan.api';
import type { Denomination, SaveDenominationRequest } from '@/lib/types/api.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DataTable } from '@/components/shared/tables/DataTable';
import { OTPVerificationModal } from '@/components/shared/modals/OTPVerificationModal';
import { ApiError } from '@/components/shared/feedback/ApiError';
import { LoadingState } from '@/components/shared/feedback/LoadingState';

const initialForm: SaveDenominationRequest = {
  rechargePlanName: '', planType: '', price: '', createdBy: '', validity: '', description: '', circleId: '',
};

export default function DenominationsPage() {
  const { user } = useAuth();
  const [form, setForm] = useState<SaveDenominationRequest>(initialForm);
  const [search, setSearch] = useState({ price: '', circleId: '', planType: '' });
  const [records, setRecords] = useState<Denomination[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpOpen, setOtpOpen] = useState(false);

  const setField = (field: keyof SaveDenominationRequest, value: string) => setForm((current) => ({ ...current, [field]: value }));

  const findPlans = async () => {
    if (!search.price || !search.circleId || !search.planType) {
      setError('Price, circle ID, and plan type are required to search.');
      return;
    }
    setIsLoading(true); setError(null);
    try {
      setRecords(await fetchRechargePlan(search));
    } catch (err: any) {
      setRecords([]); setError(err.message || 'Failed to fetch denominations');
    } finally { setIsLoading(false); }
  };

  const { sendOtp, verifyOtp, reset } = useOtp({
    msisdn: user?.mobileNumber || '', operation: '10069',
    onSendOtp: () => sendDenominationConfigurationOtp(user?.mobileNumber || ''),
    onSuccess: async () => {
      setIsLoading(true); setError(null);
      try {
        const created = await saveDenomination({ ...form, createdBy: user?.username || '' });
        setRecords((current) => [created, ...current]);
        setForm(initialForm); setOtpOpen(false);
      } catch (err: any) { setError(err.message || 'Failed to save denomination'); }
      finally { setIsLoading(false); }
    },
    onError: setError,
  });

  const submit = async () => {
    if (!form.rechargePlanName || !form.planType || !form.price || !form.validity || !form.description || !form.circleId) {
      setError('Complete all required denomination fields.'); return;
    }
    setError(null); setOtpOpen(true); await sendOtp();
  };

  return <div className="space-y-6">
    <div><h1 className="text-2xl font-bold text-gray-900">Denomination Configuration</h1><p className="text-gray-500">Search and configure recharge denominations</p></div>
    {error && <ApiError error={error} onRetry={() => setError(null)} />}
    <Card><CardHeader><CardTitle>Find Recharge Plan</CardTitle></CardHeader><CardContent className="grid grid-cols-1 gap-3 md:grid-cols-4">
      <Input value={search.price} onChange={(e) => setSearch({ ...search, price: e.target.value })} placeholder="Price" />
      <Input value={search.circleId} onChange={(e) => setSearch({ ...search, circleId: e.target.value })} placeholder="Circle ID" />
      <Input value={search.planType} onChange={(e) => setSearch({ ...search, planType: e.target.value })} placeholder="Plan type" />
      <Button variant="outline" onClick={findPlans} disabled={isLoading}>Search</Button>
    </CardContent></Card>
    <Card><CardHeader><CardTitle>Add Denomination</CardTitle></CardHeader><CardContent><form onSubmit={(e) => { e.preventDefault(); submit(); }} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {([
          ['rechargePlanName', 'Recharge Plan Name'], ['planType', 'Plan Type'], ['price', 'Price'], ['circleId', 'Circle ID'], ['validity', 'Validity'], ['description', 'Description'],
          ['bundleName', 'Bundle Name'], ['bucketId', 'Bucket ID'], ['faceValue', 'Face Value'], ['netValue', 'Net Value'], ['cardGroup', 'Card Group'], ['varepDenom', 'VAREP Denomination'], ['vasDenom', 'VAS Denomination'], ['varepGroup', 'VAREP Group'],
        ] as [keyof SaveDenominationRequest, string][]).map(([field, label]) => <div className="space-y-2" key={field}><Label htmlFor={field}>{label}{['rechargePlanName', 'planType', 'price', 'circleId', 'validity', 'description'].includes(field) ? ' *' : ''}</Label><Input id={field} value={form[field] || ''} onChange={(e) => setField(field, e.target.value)} /></div>)}
      </div>
      <div className="flex justify-end"><Button type="submit" disabled={isLoading}>Send OTP & Save</Button></div>
    </form></CardContent></Card>
    <Card><CardHeader><CardTitle>Denomination Results</CardTitle></CardHeader><CardContent>{isLoading ? <LoadingState message="Loading denominations..." /> : <DataTable data={records} columns={[{ key: 'rechargePlanName', header: 'Plan' }, { key: 'planType', header: 'Type' }, { key: 'price', header: 'Price' }, { key: 'circleId', header: 'Circle' }, { key: 'validity', header: 'Validity' }]} emptyMessage="Search for a recharge plan to view denominations" />}</CardContent></Card>
    <OTPVerificationModal isOpen={otpOpen} onClose={() => { setOtpOpen(false); reset(); }} msisdn={user?.mobileNumber || ''} operation="10069" onVerify={verifyOtp} onResend={sendOtp} onVerified={() => setOtpOpen(false)} onError={setError} />
  </div>;
}
