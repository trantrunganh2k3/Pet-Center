"use client";
import { useState, useEffect } from "react";
import "./styles.css";
import { Table, Select, DatePicker, Input, Button, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined, FilterOutlined, LoadingOutlined, DollarOutlined } from "@ant-design/icons";
import GlobalLoading from "@/components/GlobalLoading";
import PaymentModal from "@/app/components/payment/PaymentModal";
import ViewInvoiceModal from "@/app/components/payment/ViewInvoiceModal";
import { bookingAPI, subServiceAPI } from "@/app/APIRoute";
import { useRouter } from "next/navigation";
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';
import { toast } from 'react-toastify';
import {
  Booking,
  BookingDetail,
  BookingStatus,
  DetailsPrice,
  STATUS_OPTIONS,
  getStatusColor,
  getStatusText,
} from "@/app/types/booking";

import Cookies from "js-cookie";
import axios from "axios";

dayjs.locale('vi');

const ScheduleManagePage = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [bookingDetails, setBookingDetails] = useState<DetailsPrice[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      interface BookingAPIResponse {
        code: number;
        message?: string;
        result: Booking[];
      }

      const response = await axios.get<BookingAPIResponse>(bookingAPI, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${Cookies.get('accessToken')}`,
        },
      });

      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Lỗi khi tải dữ liệu đặt lịch');
      }
      setBookings(response.data.result);
      console.log('Bookings:', response.data.result);
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu đặt lịch');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<BookingDetail[] | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isViewInvoiceModalOpen, setIsViewInvoiceModalOpen] = useState(false);

  const handleViewDetails = (bookingId: string) => {
    router.push(`/admin/schedule-manage/details/${bookingId}`);
  };

  const handleViewInvoice = async (booking: Booking) => {
    try {
      // Lấy thông tin chi tiết của booking
      const detailsResponse = await axios.get<{ code: number; message?: string; result: BookingDetail[] }>(
        `${subServiceAPI}/${booking.bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('accessToken')}`,
          },
        }
      );

      if (detailsResponse.data.code === 1000) {
        setSelectedBooking(booking);
        setSelectedBookingDetails(detailsResponse.data.result);
        setIsViewInvoiceModalOpen(true);
      } else {
        toast.error('Không thể tải thông tin chi tiết đặt lịch');
      }
    } catch (error) {
      toast.error('Lỗi khi tải thông tin chi tiết đặt lịch');
      console.error(error);
    }
  };

  const handlePaymentClick = async (booking: Booking) => {
    try {
      const detailsResponse = await axios.get<{ code: number; message?: string; result: BookingDetail[] }>(`${subServiceAPI}/${booking.bookingId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('accessToken')}`,
        },
      });

      if (detailsResponse.data.code === 1000) {
        setSelectedBooking({
          ...booking,
          bookingDetails: detailsResponse.data.result
        });
        setIsPaymentModalOpen(true);
      } else {
        toast.error('Không thể tải thông tin chi tiết đặt lịch');
      }
    } catch (error) {
      toast.error('Lỗi khi tải thông tin chi tiết đặt lịch');
      console.error(error);
    }
  };

  const handlePaymentConfirm = async (prices: Record<string, number>) => {
    if (!selectedBooking) {
      toast.error('Không tìm thấy thông tin đặt lịch');
      return;
    }

    const details : DetailsPrice[] = Object.entries(prices).map(([key, value]) => ({
      bookingDetailsId: key,
      price: value,
    }));

    setBookingDetails(details);

    const bookingId = selectedBooking.bookingId;
    console.log('Booking ID:', bookingId);
    console.log('Booking Details:', bookingDetails);

    try {
      const response = await axios.put<{ code: number; message?: string }>(`${subServiceAPI}/price/${bookingId}`,
        details,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('accessToken')}`,
        },
        withCredentials: true,
      });

      if (response.data.code !== 1000) {
        toast.error('Lỗi khi lưu giá dịch vụ');
        throw new Error(response.data.message || 'Lỗi khi lưu giá dịch vụ');
      } else {
        toast.success('Lưu giá dịch vụ thành công');
        setIsPaymentModalOpen(false);
        
        // Chuyển sang trang invoice
        router.push(`/admin/invoice/${selectedBooking?.bookingId}`);
      }
    } catch (error) {
      message.error('Lỗi khi lưu giá dịch vụ');
    }
  };

  const filteredData = bookings.filter((item) => {
    const matchesSearch = !searchText || 
      item.customer.customerName.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(item.status);
    const matchesDate = !selectedDate || item.createdDate.includes(selectedDate);

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleUpdateStatus = async (bookingId: string, status: BookingStatus) => {
    try {
      setUpdatingStatus(bookingId);

      // Tìm booking cần cập nhật
      const bookingToUpdate = bookings.find(b => b.bookingId === bookingId);
      if (!bookingToUpdate) {
        throw new Error('Không tìm thấy booking');
      }

      // Tạo đối tượng chỉ chứa các trường cần thiết
      const updatedBookingData = {
        status,
        note: bookingToUpdate.note,
        createdDate: bookingToUpdate.createdDate,
        updatedDate: new Date().toISOString() // Cập nhật ngày hiện tại
      };

      const response = await axios.put<{ code: number; message?: string }>(
        `${bookingAPI}/${bookingId}`,
        updatedBookingData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get('accessToken')}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.code !== 1000) {
        throw new Error('Không thể cập nhật trạng thái');
      }

      message.success('Cập nhật trạng thái thành công');
      await fetchBookings();
    } catch (error) {
      message.error('Lỗi khi cập nhật trạng thái');
      console.error(error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const columns: ColumnsType<Booking> = [
    {
      title: "Mã đặt lịch",
      dataIndex: "bookingId",
      key: "bookingId",
      width: 100,
      align: 'center',
    },
    {
      title: "Khách hàng",
      key: "customer",
      width: 250,
      render: (_: any, record: Booking) => {
        const { customerName, phone } = record.customer;
        return `${customerName} - ${phone}`;
      }
    },
    {
      title: "Ngày đặt",
      dataIndex: "bookingDate",
      key: "bookingDate",
      width: 120,
      align: 'center',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 180,
      align: 'center',
      render: (status: BookingStatus, record: Booking) => (
        <div className="flex items-center justify-center gap-2">
          <Select
            value={status}
            style={{ width: 160 }}
            className="status-select"
            onChange={(value) => handleUpdateStatus(record.bookingId, value)}
            disabled={updatingStatus === record.bookingId}
            options={STATUS_OPTIONS.map(option => ({
              value: option.value,
              label: (
                <Tag 
                  color={getStatusColor(option.label as BookingStatus)}
                  className="w-full text-center py-1 px-3 rounded-full transition-all hover:opacity-80"
                  style={{
                    fontSize: '0.9rem',
                    border: 'none',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  {option.label}
                </Tag>
              )
            }))}
            dropdownStyle={{
              padding: '8px'
            }}
          />
          {updatingStatus === record.bookingId && (
            <LoadingOutlined style={{ fontSize: 18, color: '#1890ff' }} />
          )}
        </div>
      )
    },
    {
      title: "Chi tiết",
      key: "detail",
      width: 100,
      render: (_: unknown, record: Booking) => (
        <Button
          type="link"
          onClick={() => handleViewDetails(record.bookingId)}
        >
          Xem chi tiết
        </Button>
      )
    },
    {
      title: "Thanh toán",
      key: "payment",
      width: 100,
      align: 'center',
      render: (_, record: Booking) => {
        if (record.status === 'Completed') {
          return (
            <Button
              type="primary"
              icon={<DollarOutlined />}
              onClick={() => handlePaymentClick(record)}
            >
              Thanh toán
            </Button>
          );
        }
        if (record.status === 'Paid') {
          return (
            <Button
              type="default"
              onClick={() => handleViewInvoice(record)}
            >
              Xem hóa đơn
            </Button>
          );
        }
        return (
          <Button
            type="primary"
            icon={<DollarOutlined />}
            disabled
          >
            Thanh toán
          </Button>
        );
      }
    }
  ];

  if (loading) {
    return (
      <GlobalLoading 
        type="page" 
        rows={8} 
        showHeader={true} 
        showFilters={true} 
      />
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Quản lý đặt lịch</h1>
        
        <div className="flex flex-wrap gap-4 mb-4">
          <Input
            id="search"
            placeholder="Tìm kiếm khách hàng..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
          />
          
          <Select
            mode="multiple"
            placeholder="Chọn trạng thái"
            value={selectedStatus}
            onChange={setSelectedStatus}
            style={{ width: 250 }}
            options={STATUS_OPTIONS}
          />
          
          <DatePicker
            placeholder="Chọn ngày"
            format="DD/MM/YYYY"
            onChange={(_: Dayjs | null, dateString: string | string[]) => {
              if (typeof dateString === 'string') {
                setSelectedDate(dateString);
              } else {
                setSelectedDate(dateString[0] || null);
              }
            }}
            style={{ width: 150 }}
          />

          <Button 
            onClick={() => {
              setSearchText("");
              setSelectedStatus([]);
              setSelectedDate(null);
            }}
            icon={<FilterOutlined />}
          >
            Xóa bộ lọc
          </Button>
        </div>
      </div>

      <Table
        loading={false}
        columns={columns}
        dataSource={filteredData}
        rowKey="bookingId"
        scroll={{ x: 1000 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total: number) => `Tổng số ${total} đặt lịch`
        }}
      />
      {selectedBooking && (
        <>
          <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            bookingDetails={selectedBooking.bookingDetails}
            onConfirm={handlePaymentConfirm}
          />
          <ViewInvoiceModal
            isOpen={isViewInvoiceModalOpen}
            onClose={() => setIsViewInvoiceModalOpen(false)}
            booking={selectedBooking}
            details={selectedBookingDetails}
          />
        </>
      )}
    </div>
  );
};

export default ScheduleManagePage;
