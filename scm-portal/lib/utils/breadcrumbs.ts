import type { BreadcrumbItem } from '@/components/shared/navigation/Breadcrumbs';

const LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  users: 'User Management',
  dealers: 'Dealer Management',
  commissions: 'Commission Config',
  plans: 'Plan & Numbers',
  settings: 'Settings',
  new: 'Create',
  hierarchy: 'Hierarchy',
  mnp: 'MNP',
  denominations: 'Denominations',
  'number-series': 'Number Series',
  'franchise-balance': 'Franchise Balance',
  wallet: 'Wallet Adjustment',
};

export function buildBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length <= 1) return [];

  const items: BreadcrumbItem[] = [];
  let currentPath = '';

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    items.push({
      label: LABELS[segment] || segment,
      href: isLast ? undefined : currentPath,
    });
  });

  return items;
}
