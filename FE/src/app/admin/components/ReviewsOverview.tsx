'use client';

import React from 'react';
import { Card, Skeleton, Empty, Rate, Progress } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import type { ReviewStats } from '@/types/statistics';

interface ReviewsOverviewProps {
  data: ReviewStats | null;
  loading: boolean;
}

const ReviewsOverview: React.FC<ReviewsOverviewProps> = ({ data, loading }) => {
  const cardStyle = {
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  };

  if (loading) {
    return (
      <Card 
        title={
          <div className="flex items-center gap-2">
            <StarOutlined className="text-yellow-500" />
            <span className="text-lg font-semibold">Tổng Quan Đánh Giá</span>
          </div>
        }
        style={cardStyle}
        className="mb-6"
      >
        <Skeleton active paragraph={{ rows: 6 }} />
      </Card>
    );
  }

  if (!data) {
    return (
      <Card 
        title={
          <div className="flex items-center gap-2">
            <StarOutlined className="text-yellow-500" />
            <span className="text-lg font-semibold">Tổng Quan Đánh Giá</span>
          </div>
        }
        style={cardStyle}
        className="mb-6"
      >
        <Empty description="Chưa có dữ liệu đánh giá" />
      </Card>
    );
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return '#52c41a'; // Green
    if (rating >= 4.0) return '#1890ff'; // Blue
    if (rating >= 3.5) return '#faad14'; // Orange
    if (rating >= 3.0) return '#fa8c16'; // Dark Orange
    return '#ff4d4f'; // Red
  };

  const getProgressColor = (rating: number) => {
    const colors = {
      5: '#52c41a', // Green
      4: '#1890ff', // Blue
      3: '#faad14', // Orange
      2: '#fa8c16', // Dark Orange
      1: '#ff4d4f'  // Red
    };
    return colors[rating as keyof typeof colors] || '#d9d9d9';
  };

  return (
    <Card 
      title={
        <div className="flex items-center gap-2">
          <StarOutlined className="text-yellow-500" />
          <span className="text-lg font-semibold">Tổng Quan Đánh Giá</span>
        </div>
      }
      style={cardStyle}
      className="mb-6"
    >
      {/* Overall Rating */}
      <div className="text-center mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-4xl font-bold mb-2" style={{ color: getRatingColor(data.averageRating) }}>
          {data.averageRating.toFixed(1)}
        </div>
        <Rate 
          disabled 
          allowHalf 
          value={data.averageRating} 
          className="text-2xl mb-2"
        />
        <div className="text-gray-600">
          Trung bình từ <span className="font-semibold">{data.totalReviews}</span> đánh giá
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-3">
        <div className="font-semibold text-gray-800 mb-3">Phân bố đánh giá:</div>
        {data.ratingDistribution
          .sort((a, b) => b.rating - a.rating)
          .map((item) => (
            <div key={item.rating} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-12">
                <span className="text-sm font-medium">{item.rating}</span>
                <StarOutlined className="text-yellow-400 text-xs" />
              </div>
              <div className="flex-1">
                <Progress
                  percent={item.percentage}
                  size="small"
                  strokeColor={getProgressColor(item.rating)}
                  trailColor="#f0f0f0"
                  showInfo={false}
                />
              </div>
              <div className="text-right w-20">
                <div className="text-sm font-medium text-gray-800">
                  {item.count}
                </div>
                <div className="text-xs text-gray-500">
                  ({item.percentage}%)
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {data.ratingDistribution
              .filter(item => item.rating >= 4)
              .reduce((sum, item) => sum + item.percentage, 0)
              .toFixed(1)}%
          </div>
          <div className="text-sm text-green-700">Đánh giá tích cực</div>
          <div className="text-xs text-green-600">(4-5 sao)</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {data.ratingDistribution
              .filter(item => item.rating <= 2)
              .reduce((sum, item) => sum + item.percentage, 0)
              .toFixed(1)}%
          </div>
          <div className="text-sm text-red-700">Cần cải thiện</div>
          <div className="text-xs text-red-600">(1-2 sao)</div>
        </div>
      </div>

      {/* Quality Assessment */}
      <div className="mt-4 p-3 rounded-lg" style={{ 
        backgroundColor: data.averageRating >= 4.5 ? '#f6ffed' : 
                        data.averageRating >= 4.0 ? '#e6f7ff' : 
                        data.averageRating >= 3.5 ? '#fff7e6' : '#fff2f0'
      }}>
        <div className="text-sm font-semibold mb-1" style={{ 
          color: data.averageRating >= 4.5 ? '#52c41a' : 
                 data.averageRating >= 4.0 ? '#1890ff' : 
                 data.averageRating >= 3.5 ? '#fa8c16' : '#ff4d4f'
        }}>
          {data.averageRating >= 4.5 ? '🌟 Xuất sắc' : 
           data.averageRating >= 4.0 ? '👍 Tốt' : 
           data.averageRating >= 3.5 ? '⚠️ Khá' : '⚠️ Cần cải thiện'}
        </div>
        <div className="text-xs text-gray-600">
          {data.averageRating >= 4.5 ? 'Chất lượng dịch vụ được đánh giá rất cao' : 
           data.averageRating >= 4.0 ? 'Chất lượng dịch vụ tốt, khách hàng hài lòng' : 
           data.averageRating >= 3.5 ? 'Chất lượng dịch vụ ở mức khá, cần nâng cao' : 
           'Cần cải thiện chất lượng dịch vụ'}
        </div>
      </div>
    </Card>
  );
};

export default ReviewsOverview;
