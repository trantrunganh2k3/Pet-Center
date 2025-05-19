import React from 'react';
import { Booking, BookingDetail } from '../types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Modal, Card, Tag } from 'antd';
import Rate from 'antd/es/rate';
import '@/app/admin/schedule-manage/details/styles.css';
import { ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { getStatusText, getStatusColor, BookingStatus } from '@/app/types/booking';

interface BookingDetailsProps {
    booking: Booking;
    details: BookingDetail[];
    onClose: () => void;
    visible: boolean;
}

export default function BookingDetails({ 
    booking, 
    details, 
    onClose,
    visible
}: BookingDetailsProps) {
    const getStatusClass = (status: BookingStatus) => {
        switch (status) {
            case 'Completed':
            case 'Paid':
                return 'completed';
            case 'Canceled':
                return 'canceled';
            default:
                return 'pending';
        }
    };

    interface TimelineItem {
        status: BookingStatus;
        title: string;
        date?: string;
        icon: React.ReactNode;
    }

    const getTimelineItems = (): TimelineItem[] => {
        const items: TimelineItem[] = [
            {
                status: 'Pending',
                title: 'Đặt lịch',
                date: booking.createdDate,
                icon: <ClockCircleOutlined style={{ fontSize: '12px' }} />
            }
        ];

        if (booking.status !== 'Pending') {
            items.push({
                status: booking.status,
                title: getStatusText(booking.status),
                icon: booking.status === 'Paid' ? <CheckCircleOutlined style={{ fontSize: '12px' }} /> : <ClockCircleOutlined style={{ fontSize: '12px' }} />
            });
        }

        return items;
    };

    return (
        <Modal
            title={`Chi tiết đặt lịch #${booking.bookingId}`}
            open={visible}
            footer={null}
            onCancel={onClose}
            width={700}
        >
            <div className="mb-6">
                <Tag color={getStatusColor(booking.status)} className="text-base px-3 py-1">
                    {getStatusText(booking.status)}
                </Tag>
            </div>

            <div className="timeline-wrapper mb-6">
                {getTimelineItems().map((item, index) => (
                    <div key={index} className="timeline-item">
                        <div className={`timeline-dot ${getStatusClass(item.status)}`}>
                            {item.icon}
                        </div>
                        <div className="timeline-content">
                            {item.date && (
                                <div className="timeline-date">
                                    {format(new Date(item.date), 'dd/MM/yyyy', { locale: vi })}
                                </div>
                            )}
                            <div className="timeline-title">{item.title}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                {details.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                        Đang tải thông tin chi tiết...
                    </div>
                ) : (
                    details.map((detail) => (
                    <Card key={detail.bookingDetailsid} size="small" className="w-full">
                        <div className="flex justify-between mb-2">
                            <span className="font-medium">{detail.service?.serviceName || 'Dịch vụ không xác định'}</span>
                            <span>{detail.price?.toLocaleString('vi-VN')} VNĐ</span>
                        </div>
                        <p className="text-gray-600">Thú cưng: {detail.pet?.petName || 'Không xác định'}</p>
                        <p className="text-gray-600">
                            Ngày hẹn: {detail.selectedDate ? format(new Date(detail.selectedDate), 'dd/MM/yyyy', { locale: vi }) : ''}
                        </p>
                    </Card>
                    ))
                )}
            </div>

            <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Tổng cộng:</span>
                    <span className="text-lg font-bold">
                        {booking.total?.toLocaleString('vi-VN')} VNĐ
                    </span>
                </div>
            </div>

            {booking.note && (
                <div className="mt-4">
                    <h4 className="font-medium mb-2">Ghi chú:</h4>
                    <p className="text-gray-600">{booking.note}</p>
                </div>
            )}

            {booking.rating && (
                <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium mb-2">Đánh giá:</h4>
                    <div className="space-y-2">
                        <Rate disabled value={booking.rating} />
                        {booking.comment && (
                            <p className="text-gray-600">{booking.comment}</p>
                        )}
                    </div>
                </div>
            )}
        </Modal>
    );
}
