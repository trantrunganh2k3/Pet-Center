import { Booking } from '../types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface BookingCardProps {
    booking: Booking;
    onClick: () => void;
}

export default function BookingCard({ booking, onClick }: BookingCardProps) {
    return (
        <div 
            className="bg-white shadow-md rounded-lg p-4 mb-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={onClick}
        >
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">
                    Booking #{booking.id}
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm ${
                    booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                }`}>
                    {booking.status === 'COMPLETED' ? 'Hoàn thành' :
                     booking.status === 'CANCELLED' ? 'Đã hủy' :
                     'Chờ thực hiện'}
                </span>
            </div>
            <div className="text-gray-600">
                <p>Ngày đặt: {format(new Date(booking.bookingDate), 'dd MMMM yyyy', { locale: vi })}</p>
                <p>Tổng tiền: {booking.totalPrice.toLocaleString('vi-VN')} VNĐ</p>
            </div>
        </div>
    );
}
