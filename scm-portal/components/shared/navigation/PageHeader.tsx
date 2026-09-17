'use client';

import React from 'react';
import { Breadcrumbs, type BreadcrumbItem } from '@/components/shared/navigation/Breadcrumbs';

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, breadcrumbs = [], actions }: PageHeaderProps) {
  return (
    <div className="space-y-2">
      {breadcrumbs.length > 0 ? <Breadcrumbs items={breadcrumbs} /> : null}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description ? <p className="text-gray-500">{description}</p> : null}
        </div>
        {actions}
      </div>
    </div>
  );
}
