"use client";
import { useState } from "react";
import { Table, Select, DatePicker, Input, Button, Space, Tag } from "antd";
import type { ColumnsType } from "antd/lib/table";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";

interface Schedule {
  id: string;
  customerName: string;
  petName: string;
  service: string;
  date: string;
  time: string;
  staff: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

export default function ScheduleManage() {
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<Schedule["status"][]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Mock data - sẽ được thay thế bằng API call
  const schedules: Schedule[] = [
    {
      id: "1",
      customerName: "Nguyễn Văn A",
      petName: "Mèo Mun",
      service: "Tắm và vệ sinh",
      date: "2024-04-08",
      time: "09:00",
      staff: "Nhân viên 1",
      status: "pending",
    },
    {
      id: "2",
      customerName: "Trần Thị B",
      petName: "Chó Bông",
      service: "Cắt tỉa lông",
      date: "2024-04-08",
      time: "10:30",
      staff: "Nhân viên 2",
      status: "confirmed",
    },
  ];

  const getStatusColor = (status: Schedule['status']) => {
    switch (status) {
      case "pending":
        return "#faad14";  // gold-6
      case "confirmed":
        return "#1890ff";  // blue-6
      case "completed":
        return "#52c41a";  // green-6
      case "cancelled":
        return "#ff4d4f";  // red-5
      default:
        return "#d9d9d9";  // gray-5
    }
  };

  const getStatusText = (status: Schedule['status']) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  // Sử dụng Select của Ant Design thay vì thẻ select thông thường
  const handleStatusFilter = (values: Schedule["status"][]) => {
    setSelectedStatus(values);
  };

  const handleDateChange = (dateString: string) => {
    setSelectedDate(dateString);
  };

  const handleClearFilters = () => {
    setSearchText("");
    setSelectedStatus([]);
    setSelectedDate(null);
  };

  // Filter data based on search and filters
  const filteredData = schedules.filter((item) => {
    const matchesSearch =
      !searchText ||
      Object.values(item).some(
        (val) =>
          val &&
          val.toString().toLowerCase().includes(searchText.toLowerCase())
      );
    const matchesStatus =
      selectedStatus.length === 0 || selectedStatus.includes(item.status);
    const matchesDate =
      !selectedDate ||
      item.date === selectedDate;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const tableColumns: ColumnsType<Schedule> = [
    {
      title: "Mã đặt lịch",
      dataIndex: "id",
      key: "id",
      width: 120,
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      width: 150,
    },
    {
      title: "Thú cưng",
      dataIndex: "petName",
      key: "petName",
      width: 120,
    },
    {
      title: "Dịch vụ",
      dataIndex: "service",
      key: "service",
      width: 150,
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      width: 120,
    },
    {
      title: "Giờ",
      dataIndex: "time",
      key: "time",
      width: 100,
    },
    {
      title: "Nhân viên",
      dataIndex: "staff",
      key: "staff",
      width: 130,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (value: Schedule["status"]) => (
        <Tag color={getStatusColor(value)}>
          {getStatusText(value)}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 200,
      render: (_: unknown, record: Schedule) => (
        <Space>
          <Button type="primary" size="small">
            Cập nhật
          </Button>
          <Button size="small">
            Chi tiết
          </Button>
          {record.status === "pending" && (
            <Button type="primary" danger size="small">
              Hủy
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const filterOptions = [
    { value: "pending", label: "Chờ xác nhận" },
    { value: "confirmed", label: "Đã xác nhận" },
    { value: "completed", label: "Hoàn thành" },
    { value: "cancelled", label: "Đã hủy" },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Quản lý đặt lịch</h1>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <Input
            placeholder="Tìm kiếm..."
            value={searchText}
            onChange={handleSearch}
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
          />
          
          {/* Sử dụng Select của Ant Design thay vì thẻ select HTML */}
          <Select
            mode="multiple"
            placeholder="Chọn trạng thái"
            value={selectedStatus}
            onChange={handleStatusFilter}
            style={{ width: 250 }}
            options={filterOptions}
            optionFilterProp="label"
          />
          
          <DatePicker 
            placeholder="Chọn ngày"
            onChange={(date, dateString) => handleDateChange(dateString)}
            style={{ width: 150 }}
          />

          <Button 
            onClick={handleClearFilters}
            icon={<FilterOutlined />}
          >
            Xóa bộ lọc
          </Button>
        </div>
      </div>

      <Table
        columns={tableColumns as any}
        dataSource={filteredData}
        rowKey={(record) => record.id}
        scroll={{ x: 1200 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total: number) => `Tổng số ${total} lịch hẹn`,
        }}
      />
    </div>
  );
}