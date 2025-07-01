'use client';

import React from 'react';
import { Card, Statistic, Row, Col, Skeleton } from 'antd';
import { CalendarOutlined, ShoppingOutlined, UserOutlined, DollarOutlined } from '@ant-design/icons';
import type { OverviewStats } from '@/types/statistics';

interface OverviewCardsProps {
  data: OverviewStats | null;
  loading: boolean;
}

const OverviewCards: React.FC<OverviewCardsProps> = ({ data, loading }) => {
  const formatCurrency = (value: any) => {
    const numValue = typeof value === 'number' ? value : Number(value) || 0;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(numValue);
  };

  const cardStyle = {
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  };

  if (loading) {
    return (
      <Row gutter={[16, 16]} className="mb-6">
        {[1, 2, 3, 4].map((index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card style={cardStyle}>
              <Skeleton active paragraph={false} />
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  const stats = [
    {
      title: 'Booking Hôm Nay',
      value: data?.todayBookings || 0,
      icon: <CalendarOutlined className="text-blue-500" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Tổng Booking',
      value: data?.totalBookings || 0,
      icon: <ShoppingOutlined className="text-green-500" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Doanh Thu Hôm Nay',
      value: data?.todayRevenue || 0,
      icon: <DollarOutlined className="text-purple-500" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      formatter: formatCurrency
    },
    {
      title: 'Tổng Doanh Thu',
      value: data?.totalRevenue || 0,
      icon: <DollarOutlined className="text-orange-500" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      formatter: formatCurrency
    }
  ];

  return (
    <Row gutter={[16, 16]} className="mb-6">
      {stats.map((stat, index) => (
        <Col xs={24} sm={12} lg={6} key={index}>
          <Card 
            style={cardStyle}
            className={`${stat.bgColor} border-0 hover:shadow-lg transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Statistic
                  title={
                    <span className={`font-medium ${stat.color}`}>
                      {stat.title}
                    </span>
                  }
                  value={stat.value}
                  valueStyle={{ 
                    color: stat.color.replace('text-', '#'),
                    fontSize: '24px',
                    fontWeight: 'bold'
                  }}
                  formatter={stat.formatter}
                />
              </div>
              <div className="text-3xl ml-4">
                {stat.icon}
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default OverviewCards;
