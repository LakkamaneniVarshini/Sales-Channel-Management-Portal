'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { getPlans, updatePlan, deletePlan } from '@/lib/api/plan.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingState } from '@/components/shared/feedback/LoadingState';
import { ApiError } from '@/components/shared/feedback/ApiError';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import type { Plan } from '@/lib/types/api.types';

export default function PlanDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user: currentUser } = useAuth();
  const sno = params.sno as string;

  const [plan, setPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Plan>>({});

  const loadPlan = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const plans = await getPlans();
      const foundPlan = plans.find((p) => p.sno === sno);
      if (!foundPlan) {
        setError('Plan not found');
      } else {
        setPlan(foundPlan);
        setEditData(foundPlan);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch plan');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadPlan();
  }, [sno]);

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await updatePlan(sno, editData, currentUser?.username || '');
      await loadPlan();
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update plan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    router.push(`/plans/${sno}/delete`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingState message="Loading plan details..." />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="p-6">
            <p className="text-center text-gray-500">Plan not found</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Plan Details</h1>
            <p className="text-gray-500">{plan.sno}</p>
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
          <CardTitle>Plan Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Operator</Label>
              {isEditing ? (
                <Input
                  value={editData.operator || ''}
                  onChange={(e) => setEditData({ ...editData, operator: e.target.value })}
                />
              ) : (
                <p className="text-sm text-gray-600">{plan.operator}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Denomination</Label>
              {isEditing ? (
                <Input
                  value={editData.denomination || ''}
                  onChange={(e) => setEditData({ ...editData, denomination: e.target.value })}
                />
              ) : (
                <p className="text-sm text-gray-600">{plan.denomination}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Talk Value</Label>
              {isEditing ? (
                <Input
                  value={editData.talkvalue || ''}
                  onChange={(e) => setEditData({ ...editData, talkvalue: e.target.value })}
                />
              ) : (
                <p className="text-sm text-gray-600">{plan.talkvalue}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              {isEditing ? (
                <Input
                  value={editData.type || ''}
                  onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                />
              ) : (
                <p className="text-sm text-gray-600">{plan.type}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Circle</Label>
              {isEditing ? (
                <Input
                  value={editData.circle || ''}
                  onChange={(e) => setEditData({ ...editData, circle: e.target.value })}
                />
              ) : (
                <p className="text-sm text-gray-600">{plan.circle}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Validity</Label>
              {isEditing ? (
                <Input
                  value={editData.validity || ''}
                  onChange={(e) => setEditData({ ...editData, validity: e.target.value })}
                />
              ) : (
                <p className="text-sm text-gray-600">{plan.validity}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            {isEditing ? (
              <Input
                value={editData.description || ''}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              />
            ) : (
              <p className="text-sm text-gray-600">{plan.description}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
