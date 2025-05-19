"use client";
import { Modal, Button } from 'antd';
import { useEffect, useState } from 'react';
import { BookingDetail } from '@/app/types/booking';
import { toast } from 'react-toastify';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: BookingDetail[];
  onConfirm: (prices: Record<string, number>) => void;
}

export default function PaymentModal({ isOpen, onClose, bookingDetails = [], onConfirm }: PaymentModalProps) {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setPrices({});
      setTotal(0);
    }
  }, [isOpen]);

  const handlePriceChange = (bookingDetailId: string, value: number | null) => {
    const newPrices = {
      ...prices,
      [bookingDetailId]: value || 0
    };
    setPrices(newPrices);

    // Calculate total
    const newTotal = Object.values(newPrices).reduce((sum, price) => sum + (price || 0), 0);
    setTotal(newTotal);
  };

  const handleSubmit = () => {
    // Kiểm tra xem tất cả dịch vụ đã có giá chưa
    const isValid = bookingDetails.every(detail => 
      prices[detail.bookingDetailsId] && prices[detail.bookingDetailsId] > 0
    );

    if (!isValid) {
      toast.warning('Vui lòng nhập giá cho tất cả dịch vụ.');
      return;
    }

    onConfirm(prices);
  };

  return (
    <Modal
      title="Nhập giá dịch vụ"
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Xác nhận
        </Button>
      ]}
    >
      <div>
        {bookingDetails.map((detail) => (
          <div key={detail.bookingDetailsId} className="mb-4">
            <div className="mb-2">{detail.service.serviceName}</div>
            <input
              type="number"
              min={0}
              value={prices[detail.bookingDetailsId] || ''}
              onChange={(e) => handlePriceChange(detail.bookingDetailsId, parseFloat(e.target.value) || null)}
              className="w-full p-2 border rounded hover:border-blue-400 focus:outline-none focus:border-blue-500"
              placeholder="Nhập giá"
            />
          </div>
        ))}

        <div className="flex justify-end mt-4 text-lg font-semibold">
          Tổng tiền: {total.toLocaleString('vi-VN')} VND
        </div>
      </div>
    </Modal>
  );
}
