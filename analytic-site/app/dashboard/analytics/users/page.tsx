'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Calendar, Filter, TrendingUp } from 'lucide-react';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function UsersPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/analytics/users');
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || 'Failed to fetch data');
        }
      } catch (err) {
        setError('An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 border border-destructive/50 bg-destructive/10 rounded-lg text-destructive">
        <p className="font-medium">Error</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  const { metrics, userGrowth, deviceData, userSegments } = data;
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">User Analytics</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Understand user behavior and demographics
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm" className="flex-1 md:flex-none gap-2 bg-transparent">
            <Calendar className="w-4 h-4" />
            Last 7 Days
          </Button>
          <Button variant="outline" size="sm" className="flex-1 md:flex-none gap-2 bg-transparent">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="p-3 md:p-4 border border-border bg-card">
          <p className="text-muted-foreground text-xs md:text-sm mb-1">Total Users</p>
          <p className="text-xl md:text-3xl font-bold text-foreground">{metrics.totalUsers.toLocaleString()}</p>
          <p className="hidden md:block text-xs text-muted-foreground mt-2">Across all projects</p>
        </Card>
        <Card className="p-3 md:p-4 border border-border bg-card">
          <p className="text-muted-foreground text-xs md:text-sm mb-1">New Users</p>
          <p className="text-xl md:text-3xl font-bold text-foreground">{metrics.newUsers.toLocaleString()}</p>
          <p className="hidden md:block text-xs text-muted-foreground mt-2">Last 7 days</p>
        </Card>
        <Card className="p-3 md:p-4 border border-border bg-card">
          <p className="text-muted-foreground text-xs md:text-sm mb-1">Active Users (7d)</p>
          <p className="text-xl md:text-3xl font-bold text-foreground">{metrics.activeUsers.toLocaleString()}</p>
          <p className="hidden md:block text-xs text-muted-foreground mt-2">Last 7 days</p>
        </Card>
        <Card className="p-3 md:p-4 border border-border bg-card">
          <p className="text-muted-foreground text-xs md:text-sm mb-1">Returning Users</p>
          <p className="text-xl md:text-3xl font-bold text-foreground">{metrics.returningUsers.toLocaleString()}</p>
          <p className="text-[10px] md:text-xs text-blue-600 mt-1 md:mt-2">{metrics.returningPercentage.toFixed(1)}% of active users</p>
        </Card>
      </div>

      {/* User Growth */}
      <Card className="p-4 md:p-6 border border-border bg-card">
        <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4 md:mb-6">User Growth</h2>
        <div className="h-[300px] md:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="activeUsers"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="newUsers"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="returning"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: '#f59e0b', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Device Breakdown */}
        <Card className="p-4 md:p-6 border border-border bg-card">
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4 md:mb-6">Device Breakdown</h2>
          <div className="h-[250px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deviceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="device" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                  }}
                />
                <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Cohort Analysis Preview */}
        <Card className="p-4 md:p-6 border border-border bg-card">
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4 md:mb-6">Cohort Analysis</h2>
          <div className="space-y-2 md:space-y-3">
            <div className="flex items-center justify-between p-2 md:p-3 bg-secondary/30 rounded">
              <span className="text-xs md:text-sm font-medium">Week of Jan 1</span>
              <span className="text-xs md:text-sm font-bold">245 users</span>
            </div>
            <div className="flex items-center justify-between p-2 md:p-3 bg-secondary/30 rounded">
              <span className="text-xs md:text-sm font-medium">Week of Jan 8</span>
              <span className="text-xs md:text-sm font-bold">187 users</span>
            </div>
            <div className="flex items-center justify-between p-2 md:p-3 bg-secondary/30 rounded">
              <span className="text-xs md:text-sm font-medium">Week of Jan 15</span>
              <span className="text-xs md:text-sm font-bold">156 users</span>
            </div>
          </div>
        </Card>
      </div>

      {/* User Segments */}
      <Card className="border border-border bg-card overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">User Segments</h2>
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Segment
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Users
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  % of Total
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody>
              {userSegments.map((segment: any) => (
                <tr
                  key={segment.segment}
                  className="border-b border-border hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    {segment.segment}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{segment.count.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {segment.percentage.toFixed(1)}%
                  </td>
                  <td className={`px-6 py-4 text-sm font-medium ${segment.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {segment.trend}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
