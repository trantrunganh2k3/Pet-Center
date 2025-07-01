'use client';

import React from 'react';
import { Button, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useOverviewStats } from './hooks/useOverviewStats';
import { useChartData } from './hooks/useChartData';
import { useTopRankings } from './hooks/useTopRankings';
import { useReviewData } from './hooks/useReviewData';
import OverviewCards from './components/OverviewCards';
import RevenueChart from './components/RevenueChart';
import TopServices from './components/TopServices';
import TopCustomers from './components/TopCustomers';
import ReviewsOverview from './components/ReviewsOverview';
import RecentReviews from './components/RecentReviews';

export default function AdminPage() {
  // Progressive loading với các hooks riêng biệt
  const overviewStats = useOverviewStats();
  const chartData = useChartData();
  const topRankings = useTopRankings();
  const reviewData = useReviewData();

  const handleRefresh = () => {
    overviewStats.refreshData();
    chartData.refreshData();
    topRankings.refreshData();
    reviewData.refreshData();
    message.success('Đã làm mới dữ liệu thống kê');
  };

  // Show any error from any hook
  const hasError = overviewStats.error || chartData.error || topRankings.error || reviewData.error;
  const errorMessage = overviewStats.error || chartData.error || topRankings.error || reviewData.error;

  // Overall loading state
  const isLoading = overviewStats.loading || chartData.loading || topRankings.loading || reviewData.loading;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            📊 Dashboard Thống Kê
          </h1>
          <p className="text-gray-600 mt-1">
            Tổng quan về hoạt động và hiệu suất của Pet Center
          </p>
        </div>
        <Button 
          type="primary" 
          icon={<ReloadOutlined />}
          onClick={handleRefresh}
          loading={isLoading}
          className="shadow-md"
        >
          Làm mới
        </Button>
      </div>

      {/* Error state */}
      {hasError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800 font-medium">Lỗi tải dữ liệu</div>
          <div className="text-red-600 text-sm mt-1">{errorMessage}</div>
        </div>
      )}

      {/* Overview Cards - Load đầu tiên */}
      <OverviewCards 
        data={overviewStats.data} 
        loading={overviewStats.loading} 
      />

      {/* Charts Section - Load thứ 2 */}
      <div className="grid grid-cols-1 gap-6">
        <RevenueChart 
          data={chartData.data} 
          loading={chartData.loading} 
        />
      </div>

      {/* Top Rankings Section - Load thứ 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopServices 
          data={topRankings.topServices} 
          loading={topRankings.servicesLoading} 
        />
        <TopCustomers 
          data={topRankings.topCustomers} 
          loading={topRankings.customersLoading} 
        />
      </div>

      {/* Reviews Section - Load cuối cùng */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReviewsOverview 
          data={reviewData.reviewStats} 
          loading={reviewData.statsLoading} 
        />
        <RecentReviews 
          data={reviewData.recentReviews} 
          loading={reviewData.reviewsLoading} 
        />
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm py-4">
        <p>Dữ liệu được cập nhật theo thời gian thực • Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}</p>
      </div>
    </div>
  );
}
