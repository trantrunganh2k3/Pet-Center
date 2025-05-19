"use client";
import { Modal, Spin } from 'antd';
import { Booking, BookingDetail } from '@/app/types/booking';
import dayjs from 'dayjs';

interface ViewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  details: BookingDetail[] | null;
}

const ViewInvoiceModal = ({ isOpen, onClose, booking, details }: ViewInvoiceModalProps) => {
  if (!booking || !details) {
    return (
      <Modal
        open={isOpen}
        onCancel={onClose}
        footer={null}
        width={600}
        title="Xem hóa đơn"
      >
        <div className="flex justify-center py-8">
          <Spin size="large" />
        </div>
      </Modal>
    );
  }

  const subtotal = booking.total ?? 0;
  const tax = Math.round(subtotal * 0.08); // 8% thuế
  const total = subtotal + tax;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
      title={`Hóa đơn #${booking.bookingId}`}
    >
      <div className="py-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Thông tin khách hàng</h2>
          <p>Họ tên: {booking.customer.customerName}</p>
          <p>Ngày đặt: {dayjs(booking.createdDate).format('DD/MM/YYYY')}</p>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Chi tiết dịch vụ</h2>
          {details.map((detail) => (
            <div key={detail.bookingDetailsId} className="flex justify-between py-2">
              <span>{detail.service.serviceName}</span>
              <span>{detail.price?.toLocaleString('vi-VN')} VND</span>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between mb-2">
            <span>Tổng phụ:</span>
            <span>{subtotal.toLocaleString('vi-VN')} VND</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Thuế (8%):</span>
            <span>{tax.toLocaleString('vi-VN')} VND</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Tổng cộng:</span>
            <span>{total.toLocaleString('vi-VN')} VND</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewInvoiceModal;
