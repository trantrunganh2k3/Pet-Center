import { Customer } from '@/app/types/interfaces';

export type BookingStatus = 'Pending' | 'Confirmed' | 'InProgress' | 'Completed' | 'Canceled' | 'Paid';

export type BookingDetailsStatus = 'Pending' | 'InProgress' | 'Completed' | 'Canceled';

export type PaymentMethod = 'Cash' | 'Transfer' | 'VnPay' | 'Momo';

export const PAYMENT_METHOD_OPTIONS = [
  { value: 'Cash', label: 'Tiền mặt' },
  { value: 'Transfer', label: 'Chuyển khoản' },
  { value: 'VnPay', label: 'VnPay' },
  { value: 'Momo', label: 'Momo' }
];

export interface Service {
  serviceId: string;
  serviceName: string;
  description: string;
}

export interface Pet {
  petId: string;
  petName: string;
  customerId: string;
}

export interface Staff {
  staffId: string;
  name: string;
}

export interface CustomerInfo{
  customerId: string;
  customerName: string;
  phone: string;
}

export interface BookingDetail {
  bookingDetailsId: string;
  service: Service;
  pet: Pet;
  selectedDate: string;
  selectedTime: string;
  status: BookingDetailsStatus;
  staff?: Staff;
  price?: number;
}

export interface Booking {
  bookingId: string;
  status: BookingStatus;
  customer: CustomerInfo;
  createdDate: string;
  updatedDate?: string;
  bookingDate: string;
  bookingTime: string;
  note?: string;
  bookingDetails: BookingDetail[];
  rating?: number;
  comment?: string;
}

export interface DetailsPrice {
  bookingDetailsId: string;
  price: number;
}

export const STATUS_OPTIONS = [
  { value: 'Pending', label: 'Chờ xác nhận' },
  { value: 'Confirmed', label: 'Đã xác nhận' },
  { value: 'InProgress', label: 'Đang thực hiện' },
  { value: 'Completed', label: 'Hoàn thành' },
  { value: 'Canceled', label: 'Đã hủy' },
  { value: 'Paid', label: 'Đã thanh toán' }
];

export const STATUS_OPTIONS_DETAILS = [
  { value : 'Blocked', label: 'Chưa đến lượt' },
  { value: 'Pending', label: 'Chờ thực hiện' },
  { value: 'InProgress', label: 'Đang thực hiện' },
  { value: 'Completed', label: 'Hoàn thành' },
  { value: 'Canceled', label: 'Đã hủy' }
];

export const getStatusColor = (status: BookingStatus | BookingDetailsStatus) => {
  switch (status) {
    case 'Pending':
      return 'blue';
    case 'Confirmed':
      return 'cyan';
    case 'InProgress':
      return 'orange';
    case 'Completed':
      return 'green';
    case 'Canceled':
      return 'red';
    case 'Paid':
      return 'purple';
    default:
      return 'default';
  }
};

export const getStatusText = (status: BookingStatus | BookingDetailsStatus) => {
  switch (status) {
    case 'Pending':
      return 'Chờ xác nhận';
    case 'Confirmed':
      return 'Đã xác nhận';
    case 'InProgress':
      return 'Đang thực hiện';
    case 'Completed':
      return 'Hoàn thành';
    case 'Canceled':
      return 'Đã hủy';
    case 'Paid':
      return 'Đã thanh toán';
    default:
      return status;
  }
};
