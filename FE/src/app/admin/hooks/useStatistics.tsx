'use client';

import { useState, useEffect } from 'react';
import { message } from 'antd';
import { statisticsService } from '@/data/StatisticsData';
import type { StatisticsData } from '@/types/statistics';

export const useStatistics = () => {
  const [data, setData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await statisticsService.getAllStatistics();
      setData(result);
    } catch (err) {
      const errorMessage = 'Không thể tải dữ liệu thống kê';
      setError(errorMessage);
      message.error(errorMessage);
      console.error('Error fetching statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchStatistics();
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  return {
    data,
    loading,
    error,
    refreshData
  };
};
