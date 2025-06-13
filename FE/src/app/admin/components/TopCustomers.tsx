'use client';

import React from 'react';
import { Card, Skeleton, Empty, Progress, Avatar } from 'antd';
import { CrownOutlined, UserOutlined } from '@ant-design/icons';
import type { TopCustomer } from '@/types/statistics';

interface TopCustomersProps {
  data: TopCustomer[] | null;
  loading: boolean;
}

const TopCustomers: React.FC<TopCustomersProps> = ({ data, loading }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      notation: 'compact'
    }).format(value);
  };

  const cardStyle = {
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  };

  if (loading) {
    return (
      <Card 
        title={
          <div className="flex items-center gap-2">
            <CrownOutlined className="text-purple-500" />
            <span className="text-lg font-semibold">Top 5 Khách Hàng Thân Thiết</span>
          </div>
        }
        style={cardStyle}
        className="mb-6"
      >
        <Skeleton active paragraph={{ rows: 5 }} />
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card 
        title={
          <div className="flex items-center gap-2">
            <CrownOutlined className="text-purple-500" />
            <span className="text-lg font-semibold">Top 5 Khách Hàng Thân Thiết</span>
          </div>
        }
        style={cardStyle}
        className="mb-6"
      >
        <Empty description="Chưa có dữ liệu khách hàng" />
      </Card>
    );
  }

  const maxTotalSpent = Math.max(...data.map(item => item.totalSpent));
  const colors = ['#f56a00', '#7cb342', '#1890ff', '#722ed1', '#eb2f96'];

  return (
    <Card 
      title={
        <div className="flex items-center gap-2">
          <CrownOutlined className="text-purple-500" />
          <span className="text-lg font-semibold">Top 5 Khách Hàng Thân Thiết</span>
        </div>
      }
      style={cardStyle}
      className="mb-6"
    >
      <div className="space-y-4">
        {data.map((customer, index) => {
          const progressPercent = (customer.totalSpent / maxTotalSpent) * 100;
          const rankColors = {
            0: 'text-yellow-500',   // 1st place - Gold
            1: 'text-gray-400',     // 2nd place - Silver
            2: 'text-orange-600',   // 3rd place - Bronze
            3: 'text-blue-500',     // 4th place - Blue
            4: 'text-purple-500'    // 5th place - Purple
          };

          const rankBadges = {
            0: '👑',  // Crown for 1st
            1: '🥈',  // Silver medal
            2: '🥉',  // Bronze medal
            3: '🏅',  // Medal
            4: '⭐'   // Star
          };

          return (
            <div 
              key={customer.customerId} 
              className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-white ${rankColors[index as keyof typeof rankColors]} font-bold text-lg border-2`}>
                  {index + 1}
                </div>
                <div className="flex items-center gap-3">
                  <Avatar 
                    size={40}
                    icon={<UserOutlined />}
                    style={{ backgroundColor: colors[index] }}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">
                        {customer.customerName}
                      </span>
                      <span className="text-lg">
                        {rankBadges[index as keyof typeof rankBadges]}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {customer.bookingCount} lần sử dụng
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-32">
                <Progress
                  percent={progressPercent}
                  size="small"
                  strokeColor={colors[index]}
                  showInfo={false}
                />
              </div>
              <div className="text-right min-w-[80px]">
                <div className="font-semibold text-lg" style={{ color: colors[index] }}>
                  {formatCurrency(customer.totalSpent)}
                </div>
                <div className="text-xs text-gray-500">
                  {((customer.totalSpent / maxTotalSpent) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {data.length < 5 && (
        <div className="mt-4 text-center text-gray-500 text-sm">
          Hiển thị {data.length} khách hàng thân thiết nhất
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="text-sm text-blue-800">
          <div className="font-semibold mb-2">💡 Thống kê tổng quan:</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-blue-600">Tổng chi tiêu:</span>{' '}
              <span className="font-semibold">
                {formatCurrency(data.reduce((sum, item) => sum + item.totalSpent, 0))}
              </span>
            </div>
            <div>
              <span className="text-blue-600">Tổng lượt sử dụng:</span>{' '}
              <span className="font-semibold">
                {data.reduce((sum, item) => sum + item.bookingCount, 0)} lần
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TopCustomers;
