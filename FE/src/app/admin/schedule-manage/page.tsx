"use client";
import { useState, useEffect } from "react";
import { Table, Select, DatePicker, Input, Button, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined, FilterOutlined, LoadingOutlined } from "@ant-design/icons";
import { bookingAPI } from "@/app/APIRoute";
import { useRouter } from "next/navigation";
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';
import {
  Booking,
  BookingStatus,
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
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu đặt lịch');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (bookingId: string) => {
    router.push(`/admin/schedule-manage/details/${bookingId}`);
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
      dataIndex: ["customer", "fullName"],
      key: "customerName",
      width: 200,
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdDate",
      key: "createdDate",
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
            style={{ width: 140 }}
            onChange={(value) => handleUpdateStatus(record.bookingId, value)}
            disabled={updatingStatus === record.bookingId}
            options={STATUS_OPTIONS.map(option => ({
              value: option.value,
              label: (
                <Tag color={getStatusColor(option.value)}>
                  {option.label}
                </Tag>
              )
            }))}
          />
          {updatingStatus === record.bookingId && (
            <LoadingOutlined style={{ fontSize: 18 }} />
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
    }
  ];

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
            onChange={(_: Dayjs | null, dateString: string) => setSelectedDate(dateString)}
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
        loading={loading}
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
    </div>
  );
};

export default ScheduleManagePage;
