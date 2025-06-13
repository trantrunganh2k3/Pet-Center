'use client';

import React from 'react';
import { Card, Skeleton, Empty, Progress } from 'antd';
import { TrophyOutlined, ToolOutlined } from '@ant-design/icons';
import type { TopService } from '@/types/statistics';

interface TopServicesProps {
  data: TopService[] | null;
  loading: boolean;
}

const TopServices: React.FC<TopServicesProps> = ({ data, loading }) => {
  const cardStyle = {
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  };

  if (loading) {
    return (
      <Card 
        title={
          <div className="flex items-center gap-2">
            <TrophyOutlined className="text-yellow-500" />
            <span className="text-lg font-semibold">Top 5 Dịch Vụ Phổ Biến</span>
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
            <TrophyOutlined className="text-yellow-500" />
            <span className="text-lg font-semibold">Top 5 Dịch Vụ Phổ Biến</span>
          </div>
        }
        style={cardStyle}
        className="mb-6"
      >
        <Empty description="Chưa có dữ liệu dịch vụ" />
      </Card>
    );
  }

  const maxBookingCount = Math.max(...data.map(item => item.bookingCount));
  const colors = ['#f56a00', '#7cb342', '#1890ff', '#722ed1', '#eb2f96'];

  return (
    <Card 
      title={
        <div className="flex items-center gap-2">
          <TrophyOutlined className="text-yellow-500" />
          <span className="text-lg font-semibold">Top 5 Dịch Vụ Phổ Biến</span>
        </div>
      }
      style={cardStyle}
      className="mb-6"
    >
      <div className="space-y-4">
        {data.map((service, index) => {
          const progressPercent = (service.bookingCount / maxBookingCount) * 100;
          const rankColors = {
            0: 'text-yellow-500',   // 1st place - Gold
            1: 'text-gray-400',     // 2nd place - Silver
            2: 'text-orange-600',   // 3rd place - Bronze
            3: 'text-blue-500',     // 4th place - Blue
            4: 'text-purple-500'    // 5th place - Purple
          };

          return (
            <div 
              key={service.serviceId} 
              className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-white ${rankColors[index as keyof typeof rankColors]} font-bold text-lg border-2`}>
                  {index + 1}
                </div>
                <div className="flex items-center gap-2">
                  <ToolOutlined className="text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-800">
                      {service.serviceName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {service.bookingCount} lượt đặt
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
              <div className="text-right min-w-[60px]">
                <div className="font-semibold text-lg" style={{ color: colors[index] }}>
                  {service.bookingCount}
                </div>
                <div className="text-xs text-gray-500">
                  {((service.bookingCount / maxBookingCount) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {data.length < 5 && (
        <div className="mt-4 text-center text-gray-500 text-sm">
          Hiển thị {data.length} dịch vụ phổ biến nhất
        </div>
      )}
    </Card>
  );
};

export default TopServices;
