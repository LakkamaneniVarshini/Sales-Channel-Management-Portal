'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/shared/tables/DataTable';
import { StatusBadge } from '@/components/shared/feedback/StatusBadge';
import { LoadingState } from '@/components/shared/feedback/LoadingState';
import { ApiError } from '@/components/shared/feedback/ApiError';
import { Plus, RefreshCw } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';
import { fetchDealer, dealerStatusCheck, checkDealerByPan, checkDealerByAadhar } from '@/lib/api/dealer.api';
import type { Dealer } from '@/lib/types/api.types';

export default function DealersPage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchMobile, setSearchMobile] = useState('');

  const fetchDealers = async () => {
    if (!searchMobile) {
      setDealers([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const dealerData = await fetchDealer(searchMobile, currentUser?.username || '');
      setDealers([dealerData]);
    } catch (err: any) {
      // Don't show error for empty search results
      if (searchMobile) {
        setDealers([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchDealers();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchMobile]);

  const handleRowClick = (dealer: Dealer) => {
    router.push(`/dealers/${dealer.scmMsisdn}`);
  };

  const columns = [
    { key: 'scmMsisdn', header: 'SCM MSISDN' },
    { key: 'firstName', header: 'First Name' },
    { key: 'lastName', header: 'Last Name' },
    { key: 'mobile', header: 'Mobile' },
    { key: 'dealerType', header: 'Type' },
    { key: 'circleId', header: 'Circle ID' },
    {
      key: 'status',
      header: 'Status',
      render: (value: number) => <StatusBadge status={value} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dealer Management</h1>
          <p className="text-gray-500">Manage dealers and franchises</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchDealers} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => router.push('/dealers/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Dealer
          </Button>
        </div>
      </div>

      {error && <ApiError error={error} onRetry={() => setError(null)} />}

      <Card>
        <CardHeader>
          <CardTitle>Dealers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            <Input
              value={searchMobile}
              onChange={(event) => setSearchMobile(event.target.value)}
              placeholder="Search by dealer mobile number"
              aria-label="Search by dealer mobile number"
            />
            <Button variant="outline" onClick={fetchDealers} disabled={!searchMobile || isLoading}>Search</Button>
          </div>
          {isLoading ? (
            <LoadingState message="Loading dealers..." />
          ) : (
            <DataTable
              data={dealers}
              columns={columns}
              onRowClick={handleRowClick}
              searchable={false}
              emptyMessage="Enter a mobile number to search for dealers"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
