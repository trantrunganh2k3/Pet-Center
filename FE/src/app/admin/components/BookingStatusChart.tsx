'use client';

import React from 'react';
import { Card, Skeleton, Empty } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChartOutlined } from '@ant-design/icons';
import type { BookingStatusData } from '@/types/statistics';
import { getStatusText } from '@/app/types/booking';

interface BookingStatusChartProps {
  data: BookingStatusData[] | null;
  loading: boolean;
}

const BookingStatusChart: React.FC<BookingStatusChartProps> = ({ data, loading }) => {
  const cardStyle = {
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  };

  // Màu sắc cho từng trạng thái
  const COLORS = {
    Pending: '#faad14',      // Orange
    Confirmed: '#1890ff',    // Blue  
    InProgress: '#52c41a',   // Green
    Completed: '#722ed1',    // Purple
    Canceled: '#ff4d4f',     // Red
    Paid: '#13c2c2'         // Cyan
  };

  if (loading) {
    return (
      <Card 
        title={
          <div className="flex items-center gap-2">
            <PieChartOutlined className="text-green-500" />
            <span className="text-lg font-semibold">Trạng Thái Booking</span>
          </div>
        }
        style={cardStyle}
        className="mb-6"
      >
        <Skeleton active paragraph={{ rows: 6 }} />
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card 
        title={
          <div className="flex items-center gap-2">
            <PieChartOutlined className="text-green-500" />
            <span className="text-lg font-semibold">Trạng Thái Booking</span>
          </div>
        }
        style={cardStyle}
        className="mb-6"
      >
        <Empty description="Chưa có dữ liệu trạng thái booking" />
      </Card>
    );
  }

  const chartData = data.map(item => ({
    ...item,
    name: getStatusText(item.status as any),
    color: COLORS[item.status as keyof typeof COLORS] || '#999999'
  }));

  const totalBookings = data.reduce((sum, item) => sum + item.count, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-blue-600">Số lượng: {data.count}</p>
          <p className="text-gray-600">Tỷ lệ: {data.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-700">
              {entry.value} ({entry.payload.count})
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card 
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChartOutlined className="text-green-500" />
            <span className="text-lg font-semibold">Trạng Thái Booking</span>
          </div>
          <div className="text-sm text-gray-500">
            Tổng: {totalBookings} booking
          </div>
        </div>
      }
      style={cardStyle}
      className="mb-6"
    >
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="count"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default BookingStatusChart;
