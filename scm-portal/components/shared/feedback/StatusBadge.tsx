'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: number | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = (status: number | string) => {
    const statusNum = typeof status === 'string' ? parseInt(status, 10) : status;

    switch (statusNum) {
      case 1:
        return {
          label: 'Active',
          className: 'bg-green-100 text-green-800 border-green-200',
        };
      case 0:
        return {
          label: 'Inactive',
          className: 'bg-gray-100 text-gray-800 border-gray-200',
        };
      case 2:
        return {
          label: 'Pending',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        };
      case 3:
        return {
          label: 'Suspended',
          className: 'bg-red-100 text-red-800 border-red-200',
        };
      default:
        return {
          label: 'Unknown',
          className: 'bg-gray-100 text-gray-800 border-gray-200',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}