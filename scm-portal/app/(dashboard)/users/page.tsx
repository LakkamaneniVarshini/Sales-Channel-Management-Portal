'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/tables/DataTable';
import { StatusBadge } from '@/components/shared/feedback/StatusBadge';
import { LoadingState } from '@/components/shared/feedback/LoadingState';
import { ApiError } from '@/components/shared/feedback/ApiError';
import { Plus, RefreshCw } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';
import { listUsers } from '@/lib/api/user.api';
import type { User } from '@/lib/types/api.types';

export default function UsersPage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const usersData = await listUsers();
      setUsers(usersData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentUser]);

  const columns = [
    { key: 'username', header: 'Username' },
    { key: 'firstName', header: 'First Name' },
    { key: 'lastName', header: 'Last Name' },
    { key: 'mobileNumber', header: 'Mobile' },
    { key: 'roleId', header: 'Role ID' },
    { key: 'zoneId', header: 'Zone ID' },
    { key: 'circleId', header: 'Circle ID' },
    {
      key: 'status',
      header: 'Status',
      render: (value: number) => <StatusBadge status={value} />,
    },
  ];

  const handleRowClick = (user: User) => {
    router.push(`/users/${user.username}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500">Manage system users and permissions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchUsers} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => router.push('/users/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Create User
          </Button>
        </div>
      </div>

      {error && <ApiError error={error} onRetry={fetchUsers} />}

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingState message="Loading users..." />
          ) : (
            <DataTable
              data={users}
              columns={columns}
              onRowClick={handleRowClick}
              searchPlaceholder="Search users..."
              emptyMessage="No users found"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
