'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, DollarSign, FileText, Clock, Activity } from 'lucide-react';
import { DataTable } from '@/components/shared/tables/DataTable';
import { StatusBadge } from '@/components/shared/feedback/StatusBadge';
import { PageHeader } from '@/components/shared/navigation/PageHeader';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

export default function DashboardPage() {
  const metrics = [
    { title: 'Total Users', value: '1,234', icon: Users, change: '+12%', positive: true },
    { title: 'Active Users', value: '987', icon: Activity, change: '+8%', positive: true },
    { title: 'Total Dealers', value: '456', icon: Building2, change: '+5%', positive: true },
    { title: 'Active Dealers', value: '423', icon: Building2, change: '+3%', positive: true },
    { title: 'Pending Actions', value: '23', icon: Clock, change: '-2%', positive: false },
    { title: 'Commission Configs', value: '89', icon: DollarSign, change: '+15%', positive: true },
    { title: 'Plans', value: '156', icon: FileText, change: '+7%', positive: true },
  ];

  const chartData = [
    { name: 'Jan', users: 980, dealers: 380 },
    { name: 'Feb', users: 1050, dealers: 395 },
    { name: 'Mar', users: 1120, dealers: 410 },
    { name: 'Apr', users: 1180, dealers: 430 },
    { name: 'May', users: 1234, dealers: 456 },
  ];

  const activityTrend = [
    { name: 'Mon', actions: 12 },
    { name: 'Tue', actions: 18 },
    { name: 'Wed', actions: 15 },
    { name: 'Thu', actions: 22 },
    { name: 'Fri', actions: 19 },
    { name: 'Sat', actions: 8 },
    { name: 'Sun', actions: 6 },
  ];

  const recentActivities = [
    { id: 1, action: 'User Created', user: 'John Doe', timestamp: '2 hours ago', status: 1 },
    { id: 2, action: 'Commission Updated', user: 'Jane Smith', timestamp: '3 hours ago', status: 1 },
    { id: 3, action: 'Dealer Added', user: 'Bob Johnson', timestamp: '5 hours ago', status: 1 },
    { id: 4, action: 'Plan Created', user: 'Alice Williams', timestamp: '6 hours ago', status: 1 },
    { id: 5, action: 'Status Changed', user: 'Charlie Brown', timestamp: '8 hours ago', status: 2 },
  ];

  const activityColumns = [
    { key: 'action', header: 'Action' },
    { key: 'user', header: 'User' },
    { key: 'timestamp', header: 'Time' },
    {
      key: 'status',
      header: 'Status',
      render: (value: number) => <StatusBadge status={value} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome to the Sales Channel Management Portal"
        breadcrumbs={[{ label: 'Dashboard' }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              <p className={`text-xs mt-1 ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Users & Dealers Growth</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#2563eb" name="Users" />
                <Bar dataKey="dealers" fill="#16a34a" name="Dealers" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="actions" stroke="#9333ea" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={recentActivities}
            columns={activityColumns}
            pagination={false}
            searchable={false}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/users/new"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center block"
            >
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-medium">Create User</p>
            </Link>
            <Link
              href="/dealers/new"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center block"
            >
              <Building2 className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="text-sm font-medium">Add Dealer</p>
            </Link>
            <Link
              href="/commissions"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center block"
            >
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-medium">Configure Commission</p>
            </Link>
            <Link
              href="/plans"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center block"
            >
              <FileText className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <p className="text-sm font-medium">Manage Plans</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
