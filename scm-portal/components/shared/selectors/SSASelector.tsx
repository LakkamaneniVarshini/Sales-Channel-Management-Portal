'use client';

import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { getSSAs } from '@/lib/api/masterdata.api';
import type { SSA } from '@/lib/types/api.types';

interface SSASelectorProps {
  value?: string;
  onChange: (ssaId: string) => void;
  circleId?: string;
  disabled?: boolean;
  error?: string;
}

export function SSASelector({ value, onChange, circleId, disabled, error }: SSASelectorProps) {
  const [ssas, setSsas] = useState<SSA[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSSAs = async () => {
      if (!circleId) {
        setSsas([]);
        return;
      }

      setIsLoading(true);
      try {
        const data = await getSSAs(circleId);
        setSsas(data);
      } catch (error) {
        console.error('Failed to fetch SSAs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSSAs();
  }, [circleId]);

  return (
    <div className="space-y-2">
      <Label htmlFor="ssa">SSA</Label>
      <select
        id="ssa"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || isLoading || !circleId}
        className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${
          error ? 'border-red-500' : ''
        }`}
      >
        <option value="">Select SSA</option>
        {ssas.map((ssa) => (
          <option key={ssa.id} value={ssa.id.toString()}>
            {ssa.name}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!circleId && (
        <p className="text-sm text-gray-500">Please select a circle first</p>
      )}
    </div>
  );
}