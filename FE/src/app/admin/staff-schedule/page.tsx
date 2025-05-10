"use client";
import React, { useState, useEffect } from "react";
import { Button, Tag, Select, Spin, Card } from "antd";
import { toast } from "react-toastify";
//import "../styles.css";
import { LoadingOutlined } from "@ant-design/icons";
import { subServiceAPI } from "@/app/APIRoute";
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import {
  BookingDetail,
  BookingDetailsStatus,
  STATUS_OPTIONS_DETAILS,
  getStatusColor,
  getStatusText,
} from "@/app/types/booking";
import Cookies from "js-cookie";
import axios from "axios";

interface APIResponse<T> {
  code: number;
  message?: string;
  result: T;
}

dayjs.locale('vi');

export default function StaffSchedulePage( ) {
  const [bookingDetails, setBookingDetails] = useState<BookingDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | BookingDetailsStatus>('all');
  const [updatingDetailStatus, setUpdatingDetailStatus] = useState<string | null>(null);
  const staffId = Cookies.get('userId')

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get<APIResponse<BookingDetail[]>>(`${subServiceAPI}/staff/${staffId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` }
      });

      if (response.data.code !== 1000) {
        throw new Error('Không thể lấy danh sách công việc');
      }

      setBookingDetails(response.data.result);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách công việc');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingDetails();
  }, []);

  const handleUpdateDetailStatus = async (detailId: string, newStatus: BookingDetailsStatus) => {
    try {
      setUpdatingDetailStatus(detailId);
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

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const filteredBookingDetails = bookingDetails.filter(detail => 
    filterStatus === 'all' || detail.status === filterStatus
  );

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl font-bold mb-6">Lịch làm việc</h1>

        <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
          <Button 
            type={filterStatus === 'all' ? 'primary' : 'default'}
            onClick={() => setFilterStatus('all')}
          >
            Tất cả
          </Button>
          {STATUS_OPTIONS_DETAILS.map(option => (
            <Button
              key={option.value}
              type={filterStatus === option.value ? 'primary' : 'default'}
              onClick={() => setFilterStatus(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredBookingDetails.map((detail) => (
            <Card key={detail.bookingDetailsId} className="shadow-sm">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{detail.service.serviceName}</h3>
                    <p className="text-sm text-gray-500">
                      {dayjs(detail.selectedDate).format('DD/MM/YYYY')} {detail.selectedTime}
                    </p>
                    <p className="text-sm">Thú cưng: {detail.pet.petName}</p>
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
              </div>
            </Card>
          ))}
          
          {filteredBookingDetails.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Không có công việc nào
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
