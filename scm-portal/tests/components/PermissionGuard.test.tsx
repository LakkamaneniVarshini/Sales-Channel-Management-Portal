import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PermissionGuard } from '@/components/shared/feedback/PermissionGuard';
import { useAuthStore } from '@/lib/stores/auth.store';
import type { UserPermissions } from '@/lib/types/api.types';

const permissions: UserPermissions = {
  roleId: 3,
  username: 'demo',
  hrmsId: '123456',
  dealerPermissions: 1,
  walletPermissions: 0,
  userPermissions: 1,
  commissionPermissions: 0,
  plansNumberpermissions: 0,
  reportsPermissions: 0,
  stockCheck: 0,
  dealerMpinReset: 0,
  franchiseAddBalance: 0,
  bulkRecharge: 0,
  varepReports: 0,
  userActivityReports: 0,
  dealerStatus: 0,
  transactionStatus: 0,
  topupReversal: 0,
  simSaleUpload: 0,
  simInventory: 0,
  pendingClearence: 0,
  inReconsilation: 0,
  mobileApp: 0,
  deferredCommission: 0,
  cbp: 0,
  simUpgrade: 0,
  mnp: 0,
  frcStv: 0,
  bulk_purge: 0,
  e_auction: 0,
  denominations: 0,
  prepaidCommissions: 0,
  postpaidCommissions: 0,
  landlineCommissions: 0,
  FOSCreation: 0,
};

describe('PermissionGuard', () => {
  beforeEach(() => {
    useAuthStore.setState({ permissions, isAuthenticated: true, user: null });
  });

  it('renders children when permission is granted', () => {
    render(
      <PermissionGuard permission="userPermissions">
        <div>Allowed content</div>
      </PermissionGuard>
    );

    expect(screen.getByText('Allowed content')).toBeInTheDocument();
  });

  it('hides children when permission is denied', () => {
    render(
      <PermissionGuard permission="commissionPermissions">
        <div>Hidden content</div>
      </PermissionGuard>
    );

    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
  });

  it('renders fallback when permission is denied', () => {
    render(
      <PermissionGuard permission="commissionPermissions" fallback={<div>Denied</div>}>
        <div>Hidden content</div>
      </PermissionGuard>
    );

    expect(screen.getByText('Denied')).toBeInTheDocument();
  });
});
