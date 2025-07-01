'use client';

import { useQuery } from '@tanstack/react-query';
import { statisticsService } from '@/data/StatisticsData';
import type { RevenueData } from '@/types/statistics';

export const useChartData = () => {
  const {
    data,
    isLoading: loading,
    error,
    refetch
  } = useQuery<RevenueData[]>({
    queryKey: ['chart-data'],
    queryFn: () => statisticsService.getRevenueData(),
    staleTime: 5 * 60 * 1000, // 5 phút
    gcTime: 10 * 60 * 1000, // 10 phút
    // Delay để load sau overview stats
    enabled: true,
  });

  const refreshData = () => {
    refetch();
  };

  return {
    data: data || null,
    loading,
    error: error ? 'Không thể tải dữ liệu biểu đồ' : null,
    refreshData
  };
};
