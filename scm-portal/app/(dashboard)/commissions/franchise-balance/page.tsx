'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/use-auth';
import { useOtp } from '@/lib/hooks/use-otp';
import { approveFranchiseAddBalance, getFranchiseAddBalanceTransactions, rejectFranchiseAddBalance, sendFranchiseAddBalanceApproveOtp, sendFranchiseAddBalanceRejectOtp } from '@/lib/api/commission.api';
import type { FranchiseAddBalanceTransaction } from '@/lib/types/api.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/shared/tables/DataTable';
import { OTPVerificationModal } from '@/components/shared/modals/OTPVerificationModal';
import { LoadingState } from '@/components/shared/feedback/LoadingState';
import { ApiError } from '@/components/shared/feedback/ApiError';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FranchiseBalancePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [circleId, setCircleId] = useState('');
  const [transactions, setTransactions] = useState<FranchiseAddBalanceTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<{ fabSeq: string; action: 'approve' | 'reject' } | null>(null);

  const loadTransactions = async () => {
    if (!circleId.trim()) { setError('Enter a circle ID to find transactions.'); return; }
    setIsLoading(true); setError(null);
    try { setTransactions(await getFranchiseAddBalanceTransactions(circleId.trim())); }
    catch (err: any) { setTransactions([]); setError(err.message || 'Failed to load franchise add-balance transactions'); }
    finally { setIsLoading(false); }
  };

  const { sendOtp, verifyOtp, reset } = useOtp({
    msisdn: user?.mobileNumber || '', operation: '10069',
    onSendOtp: async () => {
      if (!pendingAction) return;
      return pendingAction.action === 'approve'
        ? sendFranchiseAddBalanceApproveOtp(user?.mobileNumber || '')
        : sendFranchiseAddBalanceRejectOtp(user?.mobileNumber || '');
    },
    onSuccess: async () => {
      if (!pendingAction) return;
      setIsLoading(true); setError(null);
      try {
        const request = { fabSeqList: [pendingAction.fabSeq], actionUser: user?.username || '' };
        if (pendingAction.action === 'approve') await approveFranchiseAddBalance(request);
        else await rejectFranchiseAddBalance(request);
        await loadTransactions();
        setPendingAction(null);
      } catch (err: any) { setError(err.message || `Failed to ${pendingAction.action} transaction`); }
      finally { setIsLoading(false); }
    },
    onError: setError,
  });

  const beginAction = async (fabSeq: string, action: 'approve' | 'reject') => {
    setError(null); setPendingAction({ fabSeq, action });
    // The state update is not available to the callback until the next render, so send the exact topic here.
    try {
      if (action === 'approve') await sendFranchiseAddBalanceApproveOtp(user?.mobileNumber || '');
      else await sendFranchiseAddBalanceRejectOtp(user?.mobileNumber || '');
    } catch (err: any) { setPendingAction(null); setError(err.message || 'Failed to send OTP'); }
  };

  const columns = [
    { key: 'fabSeq', header: 'Sequence' }, { key: 'scmMsisdn', header: 'MSISDN' }, { key: 'amount', header: 'Amount' }, { key: 'adjustmentType', header: 'Type' }, { key: 'status', header: 'Status' }, { key: 'requestedBy', header: 'Requested by' },
    { key: 'actions', header: 'Actions', render: (_: unknown, row: FranchiseAddBalanceTransaction) => <div className="flex gap-2"><Button size="sm" onClick={() => beginAction(row.fabSeq, 'approve')}>Approve</Button><Button size="sm" variant="destructive" onClick={() => beginAction(row.fabSeq, 'reject')}>Reject</Button></div> },
  ];

  return <div className="space-y-6">
    <div className="flex items-center gap-4"><Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="h-4 w-4" /></Button><div><h1 className="text-2xl font-bold text-gray-900">Franchise Add Balance</h1><p className="text-gray-500">Review and action pending franchise balance requests</p></div></div>
    {error && <ApiError error={error} onRetry={() => setError(null)} />}
    <Card><CardHeader><CardTitle>Find Transactions</CardTitle></CardHeader><CardContent className="flex flex-col gap-3 sm:flex-row"><Input value={circleId} onChange={(e) => setCircleId(e.target.value)} placeholder="Circle ID" /><Button variant="outline" onClick={loadTransactions} disabled={isLoading}>Search</Button></CardContent></Card>
    <Card><CardHeader><CardTitle>Transactions</CardTitle></CardHeader><CardContent>{isLoading ? <LoadingState message="Loading transactions..." /> : <DataTable data={transactions} columns={columns} emptyMessage="Search by circle ID to view transactions" />}</CardContent></Card>
    <OTPVerificationModal isOpen={Boolean(pendingAction)} onClose={() => { setPendingAction(null); reset(); }} msisdn={user?.mobileNumber || ''} operation="10069" onVerify={verifyOtp} onResend={sendOtp} onVerified={() => undefined} onError={setError} />
  </div>;
}
