"use client";
import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Booking, BookingDetail, PaymentMethod, PAYMENT_METHOD_OPTIONS } from '@/app/types/booking';
import { bookingAPI, subServiceAPI, paymentAPI } from '@/app/APIRoute';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';

export default function InvoicePage({ params }: { params: { id: string } }) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [details, setDetails] = useState<BookingDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [note, setNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchInvoiceData();
  }, []);

  const fetchInvoiceData = async () => {
    try {
      setLoading(true);
      const [bookingResponse, detailsResponse] = await Promise.all([
        axios.get<{ code: number; message?: string; result?: any }>(`${bookingAPI}/info/${params.id}`, {
          headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
        }),
        axios.get<{ code: number; message?: string; result?: any }>(`${subServiceAPI}/${params.id}`, {
          headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
        })
      ]);

      if (bookingResponse.data.code !== 1000 || detailsResponse.data.code !== 1000) {
        throw new Error('Không thể tải thông tin hóa đơn');
      }

      console.log('Booking response:', bookingResponse.data);
      console.log('Details response:', detailsResponse.data);

      if (!bookingResponse.data.result || !detailsResponse.data.result) {
        throw new Error('Dữ liệu không hợp lệ');
      }

      setBooking(bookingResponse.data.result);
      
      // Đảm bảo detailsData là một mảng
      const detailsData = detailsResponse.data.result;
      if (!Array.isArray(detailsData)) {
        console.error('Details data is not an array:', detailsData);
        setDetails([]);
        return;
      }
      
      setDetails(detailsData);
      
    } catch (error) {
      toast.error('Lỗi khi tải thông tin hóa đơn');
      router.push('/admin/schedule-manage');
    } finally {
      setLoading(false);
    }
  };

  // Tính subtotal từ tổng giá các dịch vụ
  const subtotal = details.reduce((sum, detail) => sum + (detail.price || 0), 0);
  const tax = Math.round(subtotal * 0.08); // 8% thuế
  const total = subtotal - discount + tax;

  // Kiểm tra xem tất cả dịch vụ đã có giá chưa
  const hasAllPrices = details.length > 0 && details.every(detail => detail.price && detail.price > 0);

  const createInvoice = async () => {
    // Kiểm tra validation trước khi tạo hóa đơn
    if (!hasAllPrices) {
      toast.error('Vui lòng cập nhật giá cho tất cả dịch vụ trước khi tạo hóa đơn');
      return null;
    }

    if (subtotal <= 0) {
      toast.error('Tổng tiền phải lớn hơn 0');
      return null;
    }

    try {
      const response = await axios.post<{ code: number; message?: string; result?: any }>(
        `${bookingAPI}/create-invoice`,
        {
          bookingId: params.id,
          method: paymentMethod,
          subtotal: subtotal,
          discount: discount,
          tax: tax,
          total: total,
          note: note
        },
        {
          headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` }
        }
      );

      const responseData = response.data;
      if (responseData.code !== 1000) {
        throw new Error(responseData.message || 'Lỗi khi tạo hóa đơn');
      }

      toast.success('Tạo hóa đơn thành công');
      return responseData.result;
    } catch (error: any) {
      console.error('Invoice creation error:', error);
      toast.error(error.message || 'Lỗi khi tạo hóa đơn');
      return null;
    }
  };

  const getVNPayLink = async (paymentId: string) => {
    try {
      setIsProcessing(true);
      const response = await axios.post<{ code: number; message?: string; result?: any }>(
        `${paymentAPI}/${paymentId}/pay-link`,
        {},
        {
          headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` }
        }
      );

      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Lỗi khi lấy link thanh toán');
      }

      return response.data.result;
    } catch (error: any) {
      console.error('VNPay link error:', error);
      toast.error(error.message || 'Lỗi khi lấy link thanh toán VNPAY');
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmPayment = async () => {
    try {
      setIsProcessing(true);
      
      // Bước 1: Tạo hóa đơn
      const invoiceResult = await createInvoice();
      if (!invoiceResult) return; // Nếu tạo hóa đơn thất bại, dừng xử lý

      // Bước 2: Xử lý theo phương thức thanh toán
      if (paymentMethod === 'VNPAY') {
        // Nếu là VNPAY, lấy payment link và chuyển hướng
        const paymentId = invoiceResult.paymentId;
        const paymentUrl = await getVNPayLink(paymentId);
        
        if (paymentUrl) {
          // Chuyển hướng đến trang thanh toán VNPay
          window.location.href = paymentUrl;
        }
      } else {
        // Nếu là Cash, hiển thị thông báo thành công và quay lại trang quản lý
        toast.success('Thanh toán thành công');
        router.push('/admin/schedule-manage');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Lỗi khi xử lý thanh toán');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading || !booking) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
          >
            <ArrowLeftOutlined />
            <span>Quay lại</span>
          </button>
          <h1 className="text-2xl font-bold">Hóa đơn #{params.id}</h1>
        </div>

        <div className="mb-4 p-6 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Thông tin khách hàng</h2>
          <p>Họ tên: {booking.customer.customerName}</p>
          <p>Ngày đặt: {dayjs(booking.createdDate).format('DD/MM/YYYY')}</p>
        </div>

        <div className="mb-4 p-6 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Chi tiết dịch vụ</h2>
          {details && details.length > 0 ? (
            <>
              {details.map((detail) => (
                <div key={detail.bookingDetailsId} className="flex justify-between py-2">
                  <span>{detail.service.serviceName}</span>
                  <span className={`${!detail.price || detail.price <= 0 ? 'text-red-500' : ''}`}>
                    {detail.price && detail.price > 0 
                      ? `${detail.price.toLocaleString('vi-VN')} VND`
                      : 'Chưa có giá'
                    }
                  </span>
                </div>
              ))}
              
              {!hasAllPrices && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-yellow-600 font-medium">⚠️ Cảnh báo:</span>
                    <span className="ml-2 text-yellow-800">
                      Một số dịch vụ chưa có giá. Vui lòng cập nhật giá trước khi thanh toán.
                    </span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-500">Không có chi tiết dịch vụ</div>
          )}
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between mb-2">
              <span>Tổng phụ:</span>
              <span>{subtotal.toLocaleString('vi-VN')} VND</span>
            </div>

            <div className="flex justify-between mb-2 items-center">
              <span>Giảm giá:</span>
              <div className="flex items-center">
                <input
                  type="number"
                  min={0}
                  max={subtotal}
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-32 p-1 border rounded hover:border-blue-400 focus:outline-none focus:border-blue-500"
                />
                <span className="ml-2">VND</span>
              </div>
            </div>

            <div className="flex justify-between mb-2">
              <span>Thuế (8%):</span>
              <span>{tax.toLocaleString('vi-VN')} VND</span>
            </div>

            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Tổng cộng:</span>
              <span>{total.toLocaleString('vi-VN')} VND</span>
            </div>

            <div className="border-t mt-4 pt-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Phương thức thanh toán</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full p-2 border rounded hover:border-blue-400 focus:outline-none focus:border-blue-500"
                >
                  {PAYMENT_METHOD_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Ghi chú</label>
                <textarea 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="Nhập ghi chú nếu có..."
                  className="w-full p-2 border rounded hover:border-blue-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-800"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirmPayment}
            disabled={!hasAllPrices || subtotal <= 0 || isProcessing}
            className={`px-6 py-2 rounded text-white ${
              !hasAllPrices || subtotal <= 0 || isProcessing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            title={
              !hasAllPrices 
                ? 'Vui lòng cập nhật giá cho tất cả dịch vụ'
                : subtotal <= 0
                ? 'Tổng tiền phải lớn hơn 0'
                : isProcessing
                ? 'Đang xử lý...'
                : 'Xác nhận thanh toán'
            }
          >
            {isProcessing ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
          </button>
        </div>
      </div>
    </div>
  );
}
