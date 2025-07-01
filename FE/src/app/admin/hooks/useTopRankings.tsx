'use client';

import { useQuery } from '@tanstack/react-query';
import { statisticsService } from '@/data/StatisticsData';
import type { TopService, TopCustomer } from '@/types/statistics';

export const useTopRankings = () => {
  const servicesQuery = useQuery<TopService[]>({
    queryKey: ['top-services'],
    queryFn: () => statisticsService.getTopServices(),
    staleTime: 5 * 60 * 1000, // 5 phút
    gcTime: 10 * 60 * 1000, // 10 phút
  });

  const customersQuery = useQuery<TopCustomer[]>({
    queryKey: ['top-customers'],
    queryFn: () => statisticsService.getTopCustomers(),
    staleTime: 5 * 60 * 1000, // 5 phút
    gcTime: 10 * 60 * 1000, // 10 phút
  });

  const refreshData = () => {
    servicesQuery.refetch();
    customersQuery.refetch();
  };

  return {
    topServices: servicesQuery.data || null,
    topCustomers: customersQuery.data || null,
    servicesLoading: servicesQuery.isLoading,
    customersLoading: customersQuery.isLoading,
    loading: servicesQuery.isLoading || customersQuery.isLoading,
    error: servicesQuery.error || customersQuery.error ? 'Không thể tải dữ liệu xếp hạng' : null,
    refreshData
  };
};
