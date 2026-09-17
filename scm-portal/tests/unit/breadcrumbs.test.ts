import { describe, it, expect } from 'vitest';
import { buildBreadcrumbs } from '@/lib/utils/breadcrumbs';

describe('Breadcrumb builder', () => {
  it('builds nested breadcrumbs from pathname', () => {
    const items = buildBreadcrumbs('/users/new');
    expect(items).toEqual([
      { label: 'User Management', href: '/users' },
      { label: 'Create' },
    ]);
  });

  it('returns empty array for dashboard root', () => {
    expect(buildBreadcrumbs('/dashboard')).toEqual([]);
  });
});
