"use client";
import React, { useState, useEffect } from "react";
import { Button, Tag, Select, Spin, Card } from "antd";
import { toast } from "react-toastify";
import "../styles.css";
import { ArrowLeftOutlined, ArrowUpOutlined, ArrowDownOutlined, ClockCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { UpdateStatusModal } from "@/app/components/booking/UpdateStatusModal";
import { useRouter } from "next/navigation";
import { bookingAPI, subServiceAPI, staffAPI } from "@/app/APIRoute";
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import {
  Booking,
  BookingDetail,
  Staff,
  BookingStatus,
  STATUS_OPTIONS,
  getStatusColor,
  getStatusText,
  BookingDetailsStatus,
  STATUS_OPTIONS_DETAILS,
} from "@/app/types/booking";
import Cookies from "js-cookie";
import axios from "axios";

interface APIResponse<T> {
  code: number;
  message?: string;
  result: T;
}

interface ArrangeData {
  bookingDetailsId: string;
  staffId: string;
}

dayjs.locale('vi');

export default function BookingDetailsPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = React.use(params as Promise<{ id: string }>);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [selectedStaffs, setSelectedStaffs] = useState<Record<string, string>>({});
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | BookingStatus>('all');
  const [updatingDetailStatus, setUpdatingDetailStatus] = useState<string | null>(null);
  const router = useRouter();

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const [bookingResponse, detailsResponse] = await Promise.all([
        axios.get<APIResponse<Booking>>(`${bookingAPI}/info/${resolvedParams.id}`, { 
          withCredentials: true,
          headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` }
        }),
        axios.get<APIResponse<BookingDetail[]>>(`${subServiceAPI}/${resolvedParams.id}`, { 
          withCredentials: true,
          headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` }
        })
      ]);

      if (bookingResponse.data.code !== 1000 || detailsResponse.data.code !== 1000) {
        throw new Error('Không thể lấy thông tin đặt lịch');
      }

      const bookingData = bookingResponse.data.result;
      const details = detailsResponse.data.result;
      console.log('Booking: ', bookingData);
      console.log('Details: ', details);

      const staffMap: Record<string, string> = {};
      details.forEach((detail) => {
        if (detail.staff?.staffId) {
          staffMap[detail.service.serviceId] = detail.staff.staffId;
        }
      });
      setSelectedStaffs(staffMap);
      setBooking({ ...bookingData, bookingDetails: details });
    } catch (error) {
      toast.error('Lỗi khi tải thông tin đặt lịch');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffs = async () => {
    try {
      const response = await axios.get<APIResponse<Staff[]>>(staffAPI, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${Cookies.get('accessToken')}`,
        },
      });

      if (response.data.code !== 1000) {
        throw new Error('Không thể lấy danh sách nhân viên');
      }

      setStaffs(response.data.result);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách nhân viên');
    }
  };

  useEffect(() => {
    fetchBookingDetails();
    fetchStaffs();
  }, []);

  const handleUpdateDetailStatus = async (detailId: string, newStatus: BookingDetailsStatus) => {
    try {
      setUpdatingDetailStatus(detailId);
      console.log('Updating status for detailId:', detailId, 'to', newStatus);
      const response = await axios.put<APIResponse<any>>(
        `${subServiceAPI}/status/${detailId}`,
        `"${newStatus}"`,
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

      toast.success('Cập nhật trạng thái thành công');
      await fetchBookingDetails();
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
      console.error(error);
    } finally {
      setUpdatingDetailStatus(null);
    }
  };

  const handleStaffChange = (serviceId: string, staffId: string | null) => {
    setSelectedStaffs(prev => ({
      ...prev,
      [serviceId]: staffId || ''
    }));
  };

  const handleSaveArrangement = async () => {
    if (!booking) return;

    const arrangeData: ArrangeData[] = booking.bookingDetails
      .map(detail => ({
        bookingDetailsId: detail.bookingDetailsId,
        staffId: selectedStaffs[detail.service.serviceId] || ''
      }))
      .filter(item => item.staffId);

      console.log('arrangeData', arrangeData);
    if (arrangeData.length === 0) {
      toast.error('Vui lòng phân công ít nhất một nhân viên');
      return;
    }

    try {
      const response = await axios.put<APIResponse<any>>(`${subServiceAPI}/arrange/${resolvedParams.id}`, arrangeData, {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('accessToken')}`,
        },
        withCredentials: true,
      });

      if (response.data.code !== 1000) {
        throw new Error('Không thể cập nhật thông tin');
      }
      
      toast.success('Cập nhật thành công');
      await fetchBookingDetails();
    } catch (error) {
      toast.error('Lỗi khi cập nhật');
      console.error(error);
    }
  };

  const handleUpdateStatus = async (status: BookingStatus) => {
    try {
      if (!booking) return;

      // Tạo đối tượng chỉ chứa các trường cần thiết
      const updatedBookingData = {
        status,
        note: booking.note,
        createdDate: booking.createdDate,
        updatedDate: new Date().toISOString() // Cập nhật ngày hiện tại
      };
      
      const response = await axios.put<APIResponse<any>>(
        `${bookingAPI}/${resolvedParams.id}`,
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
      
      toast.success('Cập nhật trạng thái thành công');
      await fetchBookingDetails();
      setIsUpdateStatusModalOpen(false);
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
      console.error(error);
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (!booking) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= booking.bookingDetails.length) return;

    const newDetails = [...booking.bookingDetails];
    const temp = newDetails[index];
    newDetails[index] = newDetails[newIndex];
    newDetails[newIndex] = temp;

    setBooking({ ...booking, bookingDetails: newDetails });
  };

  if (loading || !booking) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const filteredBookingDetails = booking.bookingDetails.filter(detail => 
    filterStatus === 'all' || detail.status === filterStatus
  );

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
            Quay lại
          </Button>
          <h1 className="text-xl font-bold">Chi tiết đặt lịch #{resolvedParams.id}</h1>
          <Button 
            type="primary"
            onClick={() => setIsUpdateStatusModalOpen(true)}
          >
            Cập nhật trạng thái tổng
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="md:col-span-2">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-2">
                <p><span className="font-medium">Khách hàng:</span> {booking.customer?.customerName}</p>
                <p><span className="font-medium">Ngày đặt:</span> {dayjs(booking.createdDate).format('DD/MM/YYYY HH:mm')}</p>
                {booking.note && <p><span className="font-medium">Ghi chú:</span> {booking.note}</p>}
              </div>
              <Tag color={getStatusColor(booking.status)} style={{ fontSize: '1rem', padding: '4px 12px' }}>
                {getStatusText(booking.status)}
              </Tag>
            </div>
          </Card>

          <Card className="md:col-span-1">
            <div className="border-l-2 border-gray-200 pl-4 space-y-4">
              <div className="flex items-start">
                <div className="-ml-6 mr-2 mt-1">
                  <ClockCircleOutlined className="text-green-500 text-lg" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">
                    {dayjs(booking.createdDate).format('DD/MM/YYYY HH:mm')}
                  </div>
                  <div className="font-medium">Đặt lịch</div>
                </div>
              </div>
              {booking.status === 'Confirmed' && (
                <div className="flex items-start">
                  <div className="-ml-[9px] mr-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                  <div>
                    <div className="font-medium">Xác nhận</div>
                  </div>
                </div>
              )}
              {booking.status === 'InProgress' && (
                <div className="flex items-start">
                  <div className="-ml-[9px] mr-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                  </div>
                  <div>
                    <div className="font-medium">Đang thực hiện</div>
                  </div>
                </div>
              )}
              {booking.status === 'Completed' && (
                <div className="flex items-start">
                  <div className="-ml-[9px] mr-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <div>
                    <div className="font-medium">Hoàn thành</div>
                  </div>
                </div>
              )}
              {booking.status === 'Canceled' && (
                <div className="flex items-start">
                  <div className="-ml-[9px] mr-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                  </div>
                  <div>
                    <div className="font-medium">Đã hủy</div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Sắp xếp dịch vụ</h2>
            <Button type="primary" onClick={handleSaveArrangement}>
              Lưu thứ tự và phân công
            </Button>
          </div>

          <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
            <Button 
              type={filterStatus === 'all' ? 'primary' : 'default'}
              onClick={() => setFilterStatus('all')}
            >
              Tất cả
            </Button>
            {STATUS_OPTIONS.map(option => (
              <Button
                key={option.value}
                type={filterStatus === option.value ? 'primary' : 'default'}
                onClick={() => setFilterStatus(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredBookingDetails.map((detail, index) => (
            <Card key={detail.bookingDetailsId} className="shadow-sm">
              <div className="flex gap-4">
                <div className="flex flex-col justify-center space-y-1">
                  <Button 
                    type="text" 
                    disabled={index === 0}
                    onClick={() => moveItem(index, 'up')}
                    icon={<ArrowUpOutlined />}
                  />
                  <span className="text-center font-medium">{index + 1}</span>
                  <Button 
                    type="text"
                    disabled={index === booking.bookingDetails.length - 1}
                    onClick={() => moveItem(index, 'down')}
                    icon={<ArrowDownOutlined />}
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between mb-4">
                    <div>
                      <h3 className="font-medium">{detail.service.serviceName}</h3>
                      <p className="text-sm text-gray-500">
                        {dayjs(detail.selectedDate).format('DD/MM/YYYY')} {detail.selectedTime}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={detail.status}
                        style={{ width: 140 }}
                        onChange={(value) => handleUpdateDetailStatus(detail.bookingDetailsId, value)}
                        disabled={updatingDetailStatus === detail.bookingDetailsId}
                        popupClassName="status-select-dropdown"
                        options={STATUS_OPTIONS_DETAILS.map(option => ({
                          value: option.value,
                          label: option.label,
                          className: `status-option-${option.value.toLowerCase()}`
                        }))}
                      />
                      {updatingDetailStatus === detail.bookingDetailsId && (
                        <LoadingOutlined style={{ fontSize: 16 }} />
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm mb-1">Thú cưng:</label>
                      <p>{detail.pet.petName}</p>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Nhân viên:</label>
                      <Select
                        style={{ width: '100%' }}
                        placeholder="Chọn nhân viên"
                        value={selectedStaffs[detail.service.serviceId]}
                        onChange={(value) => handleStaffChange(detail.service.serviceId, value)}
                        allowClear
                        options={staffs.map(staff => ({
                          value: staff.staffId,
                          label: staff.name,
                        }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <UpdateStatusModal
          open={isUpdateStatusModalOpen}
          onClose={() => setIsUpdateStatusModalOpen(false)}
          onUpdate={handleUpdateStatus}
        />
      </div>
    </div>
  );
}
