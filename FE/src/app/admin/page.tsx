'use client';

import React from 'react';
import { Button, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useStatistics } from './hooks/useStatistics';
import OverviewCards from './components/OverviewCards';
import RevenueChart from './components/RevenueChart';
import BookingStatusChart from './components/BookingStatusChart';
import TopServices from './components/TopServices';
import TopCustomers from './components/TopCustomers';
import ReviewsOverview from './components/ReviewsOverview';
import RecentReviews from './components/RecentReviews';

export default function AdminPage() {
  const { data, loading, error, refreshData } = useStatistics();

  const handleRefresh = () => {
    refreshData();
    message.success('Đã làm mới dữ liệu thống kê');
  };

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
          loading={loading}
          className="shadow-md"
        >
          Làm mới
        </Button>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800 font-medium">Lỗi tải dữ liệu</div>
          <div className="text-red-600 text-sm mt-1">{error}</div>
        </div>
      )}

      {/* Overview Cards */}
      <OverviewCards 
        data={data?.overview || null} 
        loading={loading} 
      />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart 
          data={data?.revenueChart || null} 
          loading={loading} 
        />
        <BookingStatusChart 
          data={data?.bookingStatus || null} 
          loading={loading} 
        />
      </div>

      {/* Top Rankings Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopServices 
          data={data?.topServices || null} 
          loading={loading} 
        />
        <TopCustomers 
          data={data?.topCustomers || null} 
          loading={loading} 
        />
      </div>

      {/* Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReviewsOverview 
          data={data?.reviewStats || null} 
          loading={loading} 
        />
        <RecentReviews 
          data={data?.recentReviews || null} 
          loading={loading} 
        />
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm py-4">
        <p>Dữ liệu được cập nhật theo thời gian thực • Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}</p>
      </div>
    </div>
  );
}
