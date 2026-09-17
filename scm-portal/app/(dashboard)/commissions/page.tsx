'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/shared/tables/DataTable';
import { LoadingState } from '@/components/shared/feedback/LoadingState';
import { ApiError } from '@/components/shared/feedback/ApiError';
import { Plus, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { fetchCommission, fetchPrepaidOTFCommission, fetchPostpaidCommission, fetchLandlineCommission } from '@/lib/api/commission.api';
import { useAuth } from '@/lib/hooks/use-auth';
import type { Commission } from '@/lib/types/api.types';

export default function CommissionsPage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'prepaid-frc' | 'prepaid-otf' | 'postpaid' | 'landline'>('prepaid-frc');
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState({
    denomination: '',
    circleId: '',
    categoryId: '',
    commissionType: '1',
    dtype: 'FRC',
    sellerLevel: '',
    fromAmount: '',
    toAmount: '',
  });

  const fetchCommissions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let data: Commission[] = [];

      if (activeTab === 'prepaid-frc') {
        data = await fetchCommission({
          denomination: searchParams.denomination,
          circleId: searchParams.circleId,
          categoryId: searchParams.categoryId,
          commissionType: searchParams.commissionType,
          username: currentUser?.username || 'admin',
          dtype: searchParams.dtype,
        });
      } else if (activeTab === 'prepaid-otf') {
        data = await fetchPrepaidOTFCommission({
          denomination: searchParams.denomination,
          circleId: searchParams.circleId,
          categoryId: searchParams.categoryId,
          commissionType: searchParams.commissionType,
          username: currentUser?.username || 'admin',
          dtype: searchParams.dtype,
        });
      } else if (activeTab === 'postpaid') {
        data = await fetchPostpaidCommission({
          circleId: searchParams.circleId,
          category: searchParams.categoryId,
          sellerLevel: searchParams.sellerLevel,
          username: currentUser?.username || 'admin',
        });
        if (Array.isArray(data)) {
          data = data;
        } else {
          data = [];
        }
      } else if (activeTab === 'landline') {
        data = await fetchLandlineCommission({
          circleId: searchParams.circleId,
          categoryId: searchParams.categoryId,
          fromAmount: searchParams.fromAmount,
          toAmount: searchParams.toAmount,
          guiUsername: currentUser?.username || 'admin',
        });
        if (Array.isArray(data)) {
          data = data;
        } else {
          data = [];
        }
      }

      setCommissions(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch commissions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (field: string, value: string) => {
    setSearchParams((prev) => ({ ...prev, [field]: value }));
  };

  const tabs = [
    { id: 'prepaid-frc', label: 'Prepaid FRC' },
    { id: 'prepaid-otf', label: 'Prepaid OTF' },
    { id: 'postpaid', label: 'Postpaid' },
    { id: 'landline', label: 'Landline' },
  ];

  const columns = [
    { key: 'commissionId', header: 'ID' },
    { key: 'masterCategoryId', header: 'Category' },
    { key: 'circleId', header: 'Circle' },
    { key: 'denomination', header: 'Denomination' },
    { key: 'sellerCommission', header: 'Seller %' },
    { key: 'fraCommission', header: 'FRA %' },
    { key: 'subCommission', header: 'Sub %' },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, row: Commission) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/commissions/${row.commissionId}?type=${activeTab}`)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => router.push(`/commissions/${row.commissionId}/delete?type=${activeTab}`)}
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
          <h1 className="text-2xl font-bold text-gray-900">Commission Configuration</h1>
          <p className="text-gray-500">Configure commission rates for different services</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/commissions/franchise-balance')}>
            Franchise Balance
          </Button>
          <Button variant="outline" onClick={fetchCommissions} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => router.push(`/commissions/new?type=${activeTab}`)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Commission
          </Button>
        </div>
      </div>

      {error && <ApiError error={error} onRetry={() => setError(null)} />}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setCommissions([]);
            }}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Denomination</label>
              <Input
                value={searchParams.denomination}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange('denomination', e.target.value)}
                placeholder="Enter denomination"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Circle ID</label>
              <Input
                value={searchParams.circleId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange('circleId', e.target.value)}
                placeholder="Enter circle ID"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category ID</label>
              <Input
                value={searchParams.categoryId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange('categoryId', e.target.value)}
                placeholder="Enter category ID"
              />
            </div>
          </div>
          <Button onClick={fetchCommissions} disabled={isLoading}>
            Search
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {tabs.find((t) => t.id === activeTab)?.label} Commissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingState message="Loading commissions..." />
          ) : (
            <DataTable
              data={commissions}
              columns={columns}
              searchPlaceholder="Search commissions..."
              emptyMessage="No commissions found matching your criteria"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
