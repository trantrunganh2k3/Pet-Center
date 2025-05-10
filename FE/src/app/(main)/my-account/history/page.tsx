'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BookingCard from './components/BookingCard';
import BookingDetails from './components/BookingDetails';
import { Booking, BookingDetail } from './types';
import { bookingAPI, subServiceAPI } from '@/app/APIRoute';
import { format } from 'date-fns';
import { notification } from 'antd';

export default function HistoryPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [bookingDetails, setBookingDetails] = useState<BookingDetail[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch bookings
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch(bookingAPI, {
                    credentials: 'include'
                });
                if (!response.ok) throw new Error('Failed to fetch bookings');
                const data = await response.json();
                setBookings(data);
            } catch (error) {
                notification.error({
                    message: 'Lỗi',
                    description: 'Không thể tải lịch sử đặt lịch',
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookings();
    }, []);

    // Fetch booking details when a booking is selected
    const handleBookingClick = async (booking: Booking) => {
        try {
            const response = await fetch(`${subServiceAPI}/${booking.id}`, {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to fetch booking details');
            const data = await response.json();
            setBookingDetails(data);
            setSelectedBooking(booking);
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Không thể tải chi tiết đặt lịch',
            });
        }
    };

    // Check if booking can be modified (not completed/cancelled and booking date is in future)
    const canModifyBooking = (booking: Booking) => {
        return (
            booking.status !== 'COMPLETED' &&
            booking.status !== 'CANCELLED' &&
            new Date(booking.bookingDate) > new Date()
        );
    };

    // Handle booking deletion
    const handleDeleteBooking = async () => {
        if (!selectedBooking) return;

        try {
            const response = await fetch(`${bookingAPI}/${selectedBooking.id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Failed to delete booking');

            notification.success({
                message: 'Thành công',
                description: 'Đã hủy lịch thành công',
            });

            // Update bookings list
            setBookings(bookings.filter(b => b.id !== selectedBooking.id));
            setSelectedBooking(null);
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Không thể hủy lịch',
            });
        }
    };

    // Handle booking edit
    const handleEditBooking = () => {
        if (!selectedBooking) return;
        router.push(`/shedule?booking=${selectedBooking.id}`);
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
            
            {bookings.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600">Bạn chưa có lịch đặt nào.</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {bookings.map((booking) => (
                        <BookingCard
                            key={booking.id}
                            booking={booking}
                            onClick={() => handleBookingClick(booking)}
                        />
                    ))}
                </div>
            )}

            {selectedBooking && (
                <BookingDetails
                    booking={selectedBooking}
                    details={bookingDetails}
                    onClose={() => setSelectedBooking(null)}
                    onEdit={canModifyBooking(selectedBooking) ? handleEditBooking : undefined}
                    onDelete={canModifyBooking(selectedBooking) ? handleDeleteBooking : undefined}
                    canModify={canModifyBooking(selectedBooking)}
                />
            )}
        </div>
    );
}
