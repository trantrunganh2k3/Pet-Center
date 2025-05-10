export interface Staff {
  staffId: string;
  name: string;
}

export interface Pet {
  petId: string;
  petName: string;
}

export interface Services {
  serviceId: string;
  serviceName: string;
}

export interface Customer {
  customerId: string;
  customerName: string;
}

export interface BookingDetail {
  bookingDetailsId: string;
  status: BookingDetailsStatus;
  priority: number;
  selectedDate: string;
  selectedTime: string;
  pet: Pet;
  service: Services;
  staff: Staff | null;
}

export interface Booking {
  bookingId: string;
  status: BookingStatus;
  note: string;
  createdDate: string;
  customer: Customer;
  bookingDetails: BookingDetail[];
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'InProgress' | 'Completed' | 'Canceled';
export type BookingDetailsStatus = 'Pending' | 'Ready' | 'InProgress' | 'Completed';

export interface BookingStatusOption {
  value: BookingStatus;
  label: string;
}

export interface BookingDetailsStatusOption {
  value: BookingDetailsStatus;
  label: string;
}

export const STATUS_OPTIONS: BookingStatusOption[] = [
  { value: 'Pending', label: 'Chờ xác nhận' },
  { value: 'Confirmed', label: 'Đã xác nhận' },
  { value: 'InProgress', label: 'Đang thực hiện' },
  { value: 'Completed', label: 'Hoàn thành' },
  { value: 'Canceled', label: 'Đã hủy' },
];

export const STATUS_OPTIONS_DETAILS: BookingDetailsStatusOption[] = [
  { value: 'Pending', label: 'Chờ xác nhận' },
  { value: 'Ready', label: 'Sẵn sàng' },
  { value: 'InProgress', label: 'Đang thực hiện' },
  { value: 'Completed', label: 'Hoàn thành' },
];

export const getStatusColor = (status: BookingStatus | BookingDetailsStatus) => {
  switch (status) {
    case 'Pending': return 'yellow';
    case 'Confirmed': return 'blue';
    case 'InProgress': return 'orange';
    case 'Completed': return 'green';
    case 'Canceled': return 'red';
    case 'Ready': return 'green';
    default: return 'gray';
  }
};

export const getStatusText = (status: BookingStatus | BookingDetailsStatus) => {
  switch (status) {
    case 'Pending': return 'Chờ xác nhận';
    case 'Confirmed': return 'Đã xác nhận';
    case 'InProgress': return 'Đang thực hiện';
    case 'Completed': return 'Hoàn thành';
    case 'Canceled': return 'Đã hủy';
    case 'Ready': return 'Sẵn sàng';
    default: return 'Không xác định';
  }
};
