'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/tables/DataTable';
import { LoadingState } from '@/components/shared/feedback/LoadingState';
import { ApiError } from '@/components/shared/feedback/ApiError';
import { Plus, RefreshCw } from 'lucide-react';
import { getPlans } from '@/lib/api/plan.api';
import { useAuth } from '@/lib/hooks/use-auth';
import type { Plan } from '@/lib/types/api.types';

export default function PlansPage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const plansData = await getPlans();
      setPlans(plansData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch plans');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const columns = [
    { key: 'sno', header: 'ID' },
    { key: 'operator', header: 'Operator' },
    { key: 'denomination', header: 'Denomination' },
    { key: 'talkvalue', header: 'Talk Value' },
    { key: 'country', header: 'Country' },
    { key: 'type', header: 'Type' },
    { key: 'circle', header: 'Circle' },
    { key: 'validity', header: 'Validity' },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, row: Plan) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/plans/${row.sno}`)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => router.push(`/plans/${row.sno}/delete`)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plan & Number Configuration</h1>
          <p className="text-gray-500">Manage plans, denominations, and number series</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchPlans} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => router.push('/plans/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Plan
          </Button>
        </div>
      </div>

      {error && <ApiError error={error} onRetry={fetchPlans} />}

      <Card>
        <CardHeader>
          <CardTitle>Plans</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingState message="Loading plans..." />
          ) : (
            <DataTable
              data={plans}
              columns={columns}
              searchPlaceholder="Search plans..."
              emptyMessage="No plans found"
            />
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Denominations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Search and configure recharge denominations</p>
            <Button onClick={() => router.push('/plans/denominations')} className="w-full">
              Manage Denominations
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>MNP Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Manage Mobile Number Portability records</p>
            <Button onClick={() => router.push('/plans/mnp')} className="w-full">
              Manage MNP
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Number Series</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Manage number series allocations</p>
            <Button onClick={() => router.push('/plans/number-series')} className="w-full">
              Manage Number Series
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
