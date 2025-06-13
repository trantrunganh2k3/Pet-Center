'use client';

import React from 'react';
import { Card, Skeleton, Empty } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LineChartOutlined } from '@ant-design/icons';
import type { RevenueData } from '@/types/statistics';

interface RevenueChartProps {
  data: RevenueData[] | null;
  loading: boolean;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data, loading }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      notation: 'compact'
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { 
      month: 'short', 
      day: 'numeric' 
    });
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
            <LineChartOutlined className="text-blue-500" />
            <span className="text-lg font-semibold">Doanh Thu 7 Ngày Gần Nhất</span>
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
            <LineChartOutlined className="text-blue-500" />
            <span className="text-lg font-semibold">Doanh Thu 7 Ngày Gần Nhất</span>
          </div>
        }
        style={cardStyle}
        className="mb-6"
      >
        <Empty description="Chưa có dữ liệu doanh thu" />
      </Card>
    );
  }

  const chartData = data.map(item => ({
    ...item,
    formattedDate: formatDate(item.date)
  }));

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const averageRevenue = totalRevenue / data.length;

  return (
    <Card 
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LineChartOutlined className="text-blue-500" />
            <span className="text-lg font-semibold">Doanh Thu 7 Ngày Gần Nhất</span>
          </div>
          <div className="text-sm text-gray-500">
            Trung bình: {formatCurrency(averageRevenue)}
          </div>
        </div>
      }
      style={cardStyle}
      className="mb-6"
    >
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="formattedDate"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={formatCurrency}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), 'Doanh thu']}
              labelFormatter={(label: any) => `Ngày: ${label}`}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#1890ff" 
              strokeWidth={3}
              dot={{ fill: '#1890ff', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#1890ff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default RevenueChart;
