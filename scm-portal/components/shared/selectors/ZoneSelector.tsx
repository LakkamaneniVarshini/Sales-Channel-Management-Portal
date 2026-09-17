'use client';

import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { getZones } from '@/lib/api/masterdata.api';
import type { Zone } from '@/lib/types/api.types';

interface ZoneSelectorProps {
  value?: string;
  onChange: (zoneId: string) => void;
  disabled?: boolean;
  error?: string;
}

export function ZoneSelector({ value, onChange, disabled, error }: ZoneSelectorProps) {
  const [zones, setZones] = useState<Zone[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchZones = async () => {
      setIsLoading(true);
      try {
        const data = await getZones();
        setZones(data);
      } catch (error) {
        console.error('Failed to fetch zones:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchZones();
  }, []);

  return (
    <div className="space-y-2">
      <Label htmlFor="zone">Zone *</Label>
      <select
        id="zone"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || isLoading}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'zone-error' : undefined}
        className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${
          error ? 'border-red-500' : ''
        }`}
      >
        <option value="">Select Zone</option>
        {zones.map((zone) => (
          <option key={zone.id} value={zone.id.toString()}>
            {zone.name}
          </option>
        ))}
      </select>
      {error && <p id="zone-error" className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
