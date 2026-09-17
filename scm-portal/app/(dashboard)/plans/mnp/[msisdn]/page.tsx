'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { findMnpData, modifyMnpData, deleteMnp } from '@/lib/api/masterdata.api';
import type { MNP } from '@/lib/types/api.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingState } from '@/components/shared/feedback/LoadingState';
import { ApiError } from '@/components/shared/feedback/ApiError';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

export default function MnpDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user: currentUser } = useAuth();
  const msisdn = params.msisdn as string;

  const [mnpData, setMnpData] = useState<MNP | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<MNP>>({});

  const loadMnpData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await findMnpData(msisdn, currentUser?.username || '');
      const record = Array.isArray(data) ? data[0] : data;
      setMnpData(record || null);
      setEditData(record || {});
    } catch (err: any) {
      setError(err.message || 'Failed to fetch MNP data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadMnpData();
  }, [msisdn, currentUser?.username]);

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await modifyMnpData({
        ...editData,
        username: currentUser?.username || 'admin',
      });
      await loadMnpData();
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update MNP');
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    router.push(`/plans/mnp/${msisdn}/delete`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingState message="Loading MNP details..." />
      </div>
    );
  }

  if (!mnpData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="p-6">
            <p className="text-center text-gray-500">MNP record not found</p>
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
            <h1 className="text-2xl font-bold text-gray-900">MNP Details</h1>
            <p className="text-gray-500">{msisdn}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} disabled={isLoading}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={isLoading}>
              Save
            </Button>
          )}
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {error && <ApiError error={error} onRetry={() => setError(null)} />}

      <Card>
        <CardHeader>
          <CardTitle>MNP Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>MSISDN</Label>
              {isEditing ? (
                <Input value={editData.msisdn || ''} disabled />
              ) : (
                <p className="text-sm text-gray-600">{mnpData.msisdn}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Recipient No.</Label>
              {isEditing ? (
                <Input
                  type="number"
                  value={editData.recipientNo ?? ''}
                  onChange={(e) => setEditData({ ...editData, recipientNo: Number(e.target.value) })}
                />
              ) : (
                <p className="text-sm text-gray-600">{mnpData.recipientNo}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Circle ID</Label>
              {isEditing ? (
                <Input
                  value={editData.circleId || ''}
                  onChange={(e) => setEditData({ ...editData, circleId: e.target.value })}
                />
              ) : (
                <p className="text-sm text-gray-600">{mnpData.circleId}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
