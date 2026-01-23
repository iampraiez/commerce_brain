'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface DashboardContextType {
  company: any;
  projects: any[];
  usage: {
    eventsCount: number;
    projectsCount: number;
    isFreeTier: boolean;
    isFreeTierExceeded: boolean;
  };
  loading: boolean;
  refreshData: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType>({
  company: null,
  projects: [],
  usage: {
    eventsCount: 0,
    projectsCount: 0,
    isFreeTier: true,
    isFreeTierExceeded: false,
  },
  loading: true,
  refreshData: async () => {},
});

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [company, setCompany] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [usage, setUsage] = useState({
    eventsCount: 0,
    projectsCount: 0,
    isFreeTier: true,
    isFreeTierExceeded: false,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      // Parallel fetch for core data
      const [sessionRes, projectsRes, analyticsRes] = await Promise.all([
        fetch('/api/auth/session'),
        fetch('/api/projects'),
        fetch('/api/analytics/overview') // Reusing existing endpoint for event count
      ]);

      const sessionData = await sessionRes.json();
      const projectsData = await projectsRes.json();
      const analyticsData = await analyticsRes.json();

      if (sessionRes.status === 401 || !sessionData.success) {
        router.push('/auth/login');
        return;
      }

      if (sessionData.success) {
        setCompany(sessionData.data);
      }

      let currentProjects = [];
      if (projectsData.success) {
        setProjects(projectsData.data);
        currentProjects = projectsData.data;
      }

      // Calculate Usage & Limits
      let eventsCount = 0;
      if (analyticsData.success) {
        // Find Total Events stat
        const eventStat = analyticsData.data.stats.find((s: any) => s.label === 'Total Events');
        eventsCount = eventStat ? parseInt(eventStat.value.replace(/,/g, '')) || 0 : 0;
      }

      const isFreeTier = sessionData.data?.plan === 'free' || !sessionData.data?.plan;
      const FREE_EVENT_LIMIT = 10000;
      const isFreeTierExceeded = isFreeTier && eventsCount > FREE_EVENT_LIMIT;

      setUsage({
        eventsCount,
        projectsCount: currentProjects.length,
        isFreeTier,
        isFreeTierExceeded,
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DashboardContext.Provider value={{ company, projects, usage, loading, refreshData: fetchData }}>
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboard = () => useContext(DashboardContext);
