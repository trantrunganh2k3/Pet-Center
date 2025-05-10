import { Booking, BookingDetail } from '../types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface BookingDetailsProps {
    booking: Booking;
    details: BookingDetail[];
    onClose: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    canModify: boolean;
}

export default function BookingDetails({ 
    booking, 
    details, 
    onClose,
    onEdit,
    onDelete,
    canModify
}: BookingDetailsProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Chi tiết đặt lịch #{booking.id}</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Booking Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-600">Ngày đặt:</p>
                            <p className="font-medium">
                                {format(new Date(booking.bookingDate), 'dd MMMM yyyy', { locale: vi })}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600">Trạng thái:</p>
                            <span className={`px-3 py-1 rounded-full text-sm inline-block mt-1 ${
                                booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                            }`}>
                                {booking.status === 'COMPLETED' ? 'Hoàn thành' :
                                 booking.status === 'CANCELLED' ? 'Đã hủy' :
                                 'Chờ thực hiện'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Booking Details */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Chi tiết dịch vụ</h3>
                    <div className="space-y-3">
                        {details.map((detail) => (
                            <div key={detail.id} className="border rounded-lg p-3">
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium">{detail.serviceName}</span>
                                    <span>{detail.price.toLocaleString('vi-VN')} VNĐ</span>
                                </div>
                                <p className="text-gray-600">Thú cưng: {detail.petName}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Total */}
                <div className="border-t pt-4 mb-4">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Tổng cộng:</span>
                        <span className="text-lg font-bold">
                            {booking.totalPrice.toLocaleString('vi-VN')} VNĐ
                        </span>
                    </div>
                </div>

                {/* Note */}
                {booking.note && (
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Ghi chú</h3>
                        <p className="text-gray-600">{booking.note}</p>
                    </div>
                )}

                {/* Actions */}
                {canModify && (
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={onEdit}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Chỉnh sửa
                        </button>
                        <button
                            onClick={onDelete}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Hủy lịch
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
