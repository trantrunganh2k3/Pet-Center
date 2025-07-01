'use client';

import { useQuery } from '@tanstack/react-query';
import { statisticsService } from '@/data/StatisticsData';
import type { ReviewStats, RecentReview } from '@/types/statistics';

export const useReviewData = () => {
  const statsQuery = useQuery<ReviewStats>({
    queryKey: ['review-stats'],
    queryFn: () => statisticsService.getReviewStats(),
    staleTime: 5 * 60 * 1000, // 5 phút
    gcTime: 10 * 60 * 1000, // 10 phút
  });

  const reviewsQuery = useQuery<RecentReview[]>({
    queryKey: ['recent-reviews'],
    queryFn: () => statisticsService.getRecentReviews(),
    staleTime: 5 * 60 * 1000, // 5 phút
    gcTime: 10 * 60 * 1000, // 10 phút
  });

  const refreshData = () => {
    statsQuery.refetch();
    reviewsQuery.refetch();
  };

  return {
    reviewStats: statsQuery.data || null,
    recentReviews: reviewsQuery.data || null,
    statsLoading: statsQuery.isLoading,
    reviewsLoading: reviewsQuery.isLoading,
    loading: statsQuery.isLoading || reviewsQuery.isLoading,
    error: statsQuery.error || reviewsQuery.error ? 'Không thể tải dữ liệu đánh giá' : null,
    refreshData
  };
};
