'use client';

import React from 'react';
import { Card, Skeleton, Empty, Rate, Avatar, Tag } from 'antd';
import { MessageOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import type { RecentReview } from '@/types/statistics';

interface RecentReviewsProps {
  data: RecentReview[] | null;
  loading: boolean;
}

const RecentReviews: React.FC<RecentReviewsProps> = ({ data, loading }) => {
  const cardStyle = {
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 5) return '#52c41a';  // Green
    if (rating >= 4) return '#1890ff';  // Blue
    if (rating >= 3) return '#faad14';  // Orange
    if (rating >= 2) return '#fa8c16';  // Dark Orange
    return '#ff4d4f';                   // Red
  };

  const getRatingText = (rating: number) => {
    if (rating >= 5) return 'Xuất sắc';
    if (rating >= 4) return 'Tốt';
    if (rating >= 3) return 'Khá';
    if (rating >= 2) return 'Trung bình';
    return 'Kém';
  };

  if (loading) {
    return (
      <Card 
        title={
          <div className="flex items-center gap-2">
            <MessageOutlined className="text-green-500" />
            <span className="text-lg font-semibold">Đánh Giá Gần Nhất</span>
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
            <MessageOutlined className="text-green-500" />
            <span className="text-lg font-semibold">Đánh Giá Gần Nhất</span>
          </div>
        }
        style={cardStyle}
        className="mb-6"
      >
        <Empty description="Chưa có đánh giá nào" />
      </Card>
    );
  }

  return (
    <Card 
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageOutlined className="text-green-500" />
            <span className="text-lg font-semibold">Đánh Giá Gần Nhất</span>
          </div>
          <Tag color="blue">{data.length} đánh giá</Tag>
        </div>
      }
      style={cardStyle}
      className="mb-6"
    >
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {data.map((review, index) => (
          <div 
            key={`${review.customerId}-${index}`}
            className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Avatar 
                  size={40}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: getRatingColor(review.rating) }}
                />
                <div>
                  <div className="font-medium text-gray-800">
                    {review.customerName}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CalendarOutlined className="text-xs" />
                    <span>{formatDate(review.createdDate)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Rate 
                  disabled 
                  value={review.rating} 
                  className="text-sm"
                />
                <div className="text-xs mt-1" style={{ color: getRatingColor(review.rating) }}>
                  {getRatingText(review.rating)}
                </div>
              </div>
            </div>

            {/* Service */}
            <div className="mb-3">
              <Tag color="blue" className="mb-2">
                {review.serviceName}
              </Tag>
            </div>

            {/* Comment */}
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm text-gray-700 leading-relaxed">
                "{review.comment}"
              </div>
            </div>

            {/* Rating indicator */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getRatingColor(review.rating) }}
                />
                <span className="text-xs text-gray-500">
                  Đánh giá {review.rating}/5 sao
                </span>
              </div>
              {review.rating >= 4 && (
                <span className="text-xs text-green-600 font-medium">
                  😊 Tích cực
                </span>
              )}
              {review.rating === 3 && (
                <span className="text-xs text-yellow-600 font-medium">
                  😐 Trung bình
                </span>
              )}
              {review.rating < 3 && (
                <span className="text-xs text-red-600 font-medium">
                  😞 Cần cải thiện
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary footer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-green-600">
              {data.filter(r => r.rating >= 4).length}
            </div>
            <div className="text-xs text-gray-500">Tích cực</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-yellow-600">
              {data.filter(r => r.rating === 3).length}
            </div>
            <div className="text-xs text-gray-500">Trung bình</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-red-600">
              {data.filter(r => r.rating < 3).length}
            </div>
            <div className="text-xs text-gray-500">Cần cải thiện</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RecentReviews;
