// components/InvoiceContent.tsx
import { Booking, BookingDetail } from '@/app/types/booking';
import dayjs from 'dayjs';

interface InvoiceContentProps {
  booking: Booking;
  details: BookingDetail[];
}

const InvoiceContent = ({ booking, details }: InvoiceContentProps) => {
  const subtotal = booking.total ?? 0;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + tax;

  return (
    <div id="receipt" className="p-8 bg-white shadow-lg rounded-lg border border-gray-200 max-w-2xl mx-auto font-sans">
      {/* Header với logo và thông tin cửa hàng */}
      <div className="flex items-center justify-between border-b pb-6 mb-6">
        <div className="flex items-center">
          <img src="/images/Logo.jpg" alt="Pet Center Logo" className="h-16 w-16 object-contain mr-4 rounded" />
          <div>
            <h1 className="text-2xl font-bold text-blue-800">Pet Center</h1>
            <p className="text-gray-600">Trung tâm chăm sóc thú cưng chuyên nghiệp</p>
          </div>
        </div>
        <div className="text-right text-gray-600 text-sm">
          <p>123 Đường ABC, Quận XYZ</p>
          <p>Điện thoại: 0123-456-789</p>
          <p>Email: info@petcenter.com</p>
          <p>Website: petcenter.com</p>
        </div>
      </div>

      {/* Thông tin hóa đơn */}
      <div className="mb-8 grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <h2 className="text-lg font-bold mb-2 text-blue-800 uppercase">Hóa Đơn</h2>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Số hóa đơn:</span>
              <span className="font-medium">#Invoice-{booking.bookingId.slice(0, 8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ngày lập:</span>
              <span>{dayjs(new Date()).format('DD/MM/YYYY HH:mm')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Trạng thái:</span>
              <span className="font-medium text-green-600">Đã thanh toán</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <h2 className="text-lg font-bold mb-2 text-gray-800 uppercase">Thông tin khách hàng</h2>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Họ tên:</span>
              <span className="font-medium">{booking.customer.customerName}</span>
            </div>
            {booking.customer.phone && (
              <div className="flex justify-between">
                <span className="text-gray-600">Điện thoại:</span>
                <span>{booking.customer.phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chi tiết dịch vụ - Đã đơn giản hóa */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-3 text-gray-800 uppercase border-b pb-2">Chi tiết dịch vụ</h2>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">STT</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Dịch vụ</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Đơn giá</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {details.map((detail, index) => (
                <tr key={detail.bookingDetailsId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="py-3 px-4 whitespace-nowrap">{index + 1}</td>
                  <td className="py-3 px-4 whitespace-nowrap font-medium">{detail.service.serviceName}</td>
                  <td className="py-3 px-4 whitespace-nowrap text-right">{detail.price?.toLocaleString('vi-VN')} ₫</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tổng tiền */}
      <div className="mt-8 border-t pt-4">
        <div className="bg-gray-50 rounded-lg p-4 ml-auto max-w-xs">
          <div className="flex justify-between mb-2 text-gray-600">
            <span>Tổng phụ:</span>
            <span>{subtotal.toLocaleString('vi-VN')} ₫</span>
          </div>
          <div className="flex justify-between mb-2 text-gray-600">
            <span>Thuế (8%):</span>
            <span>{tax.toLocaleString('vi-VN')} ₫</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
            <span>Tổng cộng:</span>
            <span className="text-blue-800">{total.toLocaleString('vi-VN')} ₫</span>
          </div>
        </div>
      </div>

      {/* Chân trang */}
      <div className="mt-10 pt-6 border-t text-center text-gray-600 text-sm">
        <p className="font-medium">Cảm ơn quý khách đã sử dụng dịch vụ của Pet Center!</p>
        <p className="mt-2">Mọi thắc mắc về hóa đơn, xin vui lòng liên hệ với chúng tôi trong vòng 7 ngày kể từ ngày xuất hóa đơn.</p>
        <div className="mt-4 flex justify-center space-x-4">
          <span>Website: petcenter.com</span>
          <span>|</span>
          <span>Hotline: 0123-456-789</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceContent;
