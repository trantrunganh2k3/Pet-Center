'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table, Button, notification } from 'antd';
import RatingModal from './components/RatingModal';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { getStatusText, getStatusColor, BookingStatus } from '@/app/types/booking';
import BookingDetails from './components/BookingDetails';
import { Booking, BookingDetail } from './types';
import { bookingAPI, subServiceAPI } from '@/app/APIRoute';
import Cookies from 'js-cookie';
import {toast} from 'react-toastify';
import axios from 'axios';

export default function HistoryPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [bookingDetails, setBookingDetails] = useState<BookingDetail[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [ratingBooking, setRatingBooking] = useState<Booking | null>(null);
    
    const customerId = Cookies.get('userId') || '';

    // Fetch bookings
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get<{ code: number; message?: string; result: any[] }>(
                `${bookingAPI}/${customerId}`,
                {
                    headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                },
                withCredentials: true,
            });
                if (response.data.code !== 1000) {
                    toast.error(response.data.message || 'Failed to fetch bookings');
                    throw new Error(response.data.message || 'Failed to fetch bookings');
                }else {
                    const data = response.data.result;
                    setBookings(data);
                }
            } catch (error) {
                toast.error('Không thể tải lịch sử đặt lịch');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookings();
    }, []);

    // Fetch booking details when a booking is selected
    const handleBookingClick = async (booking: Booking) => {
        setSelectedBooking(booking);
        try {
            const response = await axios.get<{ code: number; message?: string; result: any[] }>(
                `${subServiceAPI}/${booking.bookingId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    },
                    withCredentials: true,
                }
            );
            if (response.data.code !== 1000) {
                toast.error(response.data.message || 'Failed to fetch booking details');
                throw new Error(response.data.message || 'Failed to fetch booking details');
            }
            setBookingDetails(response.data.result);
        } catch (error) {
            toast.error('Không thể tải chi tiết đặt lịch');
            setSelectedBooking(null);
        }
    };

    // Check if booking can be modified
    const canModifyBooking = (booking: Booking) => {
        return (
            booking.status !== 'Completed' &&
            booking.status !== 'Canceled' &&
            booking.status !== 'Paid' &&
            new Date(booking.createdDate) > new Date()
        );
    };

    // Handle booking cancellation
    const handleCancelBooking = async (bookingId: string) => {
        try {
            const response = await fetch(`${bookingAPI}/${bookingId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Failed to cancel booking');

            notification.success({
                message: 'Thành công',
                description: 'Đã hủy lịch thành công',
            });

            // Update bookings list
            setBookings(bookings.filter(b => b.bookingId !== bookingId));
            setSelectedBooking(null);
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Không thể hủy lịch',
            });
        }
    };

    // Handle rating
    const handleRating = (booking: Booking) => {
        setRatingBooking(booking);
        setShowRatingModal(true);
    };

    // Handle booking edit
    const handleEditBooking = () => {
        if (!selectedBooking) return;
        router.push(`/shedule?booking=${selectedBooking.bookingId}`);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Lịch sử đặt lịch</h1>
            
            <Table 
                dataSource={bookings}
                columns={[
                    {
                        title: 'ID',
                        dataIndex: 'bookingId',
                        key: 'bookingId',
                    },
                    {
                        title: 'Ngày đặt',
                        dataIndex: 'createdDate',
                        key: 'createdDate',
                        render: (date: string) => format(new Date(date), 'dd MMMM yyyy', { locale: vi })
                    },
                    {
                        title: 'Tổng tiền',
                        dataIndex: 'total',
                        key: 'total',
                        render: (total: number | null) => total != null ? `${total.toLocaleString('vi-VN')} VNĐ` : '0 VNĐ'
                    },
                    {
                        title: 'Trạng thái',
                        dataIndex: 'status',
                        key: 'status',
                        render: (status: BookingStatus) => {
                            const color = getStatusColor(status);
                            const colorMap: Record<string, string> = {
                                'green': 'bg-green-100 text-green-800',
                                'red': 'bg-red-100 text-red-800',
                                'blue': 'bg-blue-100 text-blue-800',
                                'cyan': 'bg-cyan-100 text-cyan-800',
                                'orange': 'bg-orange-100 text-orange-800',
                                'purple': 'bg-purple-100 text-purple-800',
                                'default': 'bg-gray-100 text-gray-800'
                            };
                            return (
                                <span className={`px-3 py-1 rounded-full ${colorMap[color]}`}>
                                    {getStatusText(status)}
                                </span>
                            );
                        }
                    },
                    {
                        title: 'Hành động',
                        key: 'action',
                        render: (_: any, record: Booking) => (
                            <div className="space-x-2">
                                <Button onClick={() => handleBookingClick(record)}>
                                    Xem chi tiết
                                </Button>
                                {(record.status === 'Completed' || record.status === 'Paid') && (
                                    record.rating ? (
                                        <Button type="primary" disabled title="Bạn đã đánh giá đơn này">
                                            Đã đánh giá
                                        </Button>
                                    ) : (
                                        <Button type="primary" onClick={() => handleRating(record)}>
                                            Đánh giá
                                        </Button>
                                    )
                                )}
                                {canModifyBooking(record) && (
                                    <Button danger onClick={() => handleCancelBooking(record.bookingId)}>
                                        Hủy dịch vụ
                                    </Button>
                                )}
                            </div>
                        )
                    }
                ]}
                locale={{
                    emptyText: 'Bạn chưa có lịch đặt nào'
                }}
                rowKey="bookingId"
            />

            {selectedBooking && (
                <BookingDetails
                    booking={selectedBooking}
                    details={bookingDetails}
                    visible={true}
                    onClose={() => setSelectedBooking(null)}
                />
            )}

            {ratingBooking && (
                <RatingModal
                    booking={ratingBooking}
                    visible={showRatingModal}
                    onClose={() => {
                        setShowRatingModal(false);
                        setRatingBooking(null);
                    }}
                />
            )}
        </div>
    );
}
