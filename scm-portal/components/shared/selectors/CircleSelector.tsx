'use client';

import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { getZoneBasedCircles, getCircles } from '@/lib/api/masterdata.api';
import type { Circle } from '@/lib/types/api.types';

interface CircleSelectorProps {
  value?: string;
  onChange: (circleId: string) => void;
  zoneId?: string;
  disabled?: boolean;
  error?: string;
  useZoneBased?: boolean;
}

export function CircleSelector({
  value,
  onChange,
  zoneId,
  disabled,
  error,
  useZoneBased = false,
}: CircleSelectorProps) {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCircles = async () => {
      setIsLoading(true);
      try {
        let data;
        if (useZoneBased && zoneId) {
          data = await getZoneBasedCircles(zoneId);
        } else {
          data = await getCircles();
        }
        setCircles(data);
      } catch (error) {
        console.error('Failed to fetch circles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCircles();
  }, [zoneId, useZoneBased]);

  return (
    <div className="space-y-2">
      <Label htmlFor="circle">Circle *</Label>
      <select
        id="circle"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || isLoading}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'circle-error' : undefined}
        className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${
          error ? 'border-red-500' : ''
        }`}
      >
        <option value="">Select Circle</option>
        {circles.map((circle) => (
          <option key={circle.id} value={circle.id.toString()}>
            {circle.name}
          </option>
        ))}
      </select>
      {error && <p id="circle-error" className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
