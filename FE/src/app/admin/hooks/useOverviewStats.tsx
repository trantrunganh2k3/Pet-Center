'use client';

import { useQuery } from '@tanstack/react-query';
import { statisticsService } from '@/data/StatisticsData';
import type { OverviewStats } from '@/types/statistics';

export const useOverviewStats = () => {
  const {
    data,
    isLoading: loading,
    error,
    refetch
  } = useQuery<OverviewStats>({
    queryKey: ['overview-stats'],
    queryFn: statisticsService.getOverviewStats,
    staleTime: 5 * 60 * 1000, // 5 phút
    gcTime: 10 * 60 * 1000, // 10 phút
  });

  const refreshData = () => {
    refetch();
  };

  return {
    data: data || null,
    loading,
    error: error ? 'Không thể tải dữ liệu tổng quan' : null,
    refreshData
  };
};
