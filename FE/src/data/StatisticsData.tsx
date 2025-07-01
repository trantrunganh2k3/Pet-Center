import axios from 'axios';
import type { APIResponse } from '@/types/interfaces';
import type { StatisticsData, OverviewStats, RevenueData, BookingStatusData, TopService, TopCustomer, ReviewStats, RecentReview } from '@/types/statistics';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Mock data để test khi chưa có API thật
const mockOverviewStats: OverviewStats = {
  todayBookings: 3,
  totalBookings: 10,
  todayRevenue: 450000,
  totalRevenue: 2500000
};

const mockRevenueData: RevenueData[] = [
  { date: '2025-05-20', revenue: 320000 },
  { date: '2025-05-21', revenue: 410000 },
  { date: '2025-05-22', revenue: 280000 },
  { date: '2025-05-23', revenue: 520000 },
  { date: '2025-05-24', revenue: 390000 },
  { date: '2025-05-25', revenue: 450000 },
  { date: '2025-05-26', revenue: 370000 }
];

const mockBookingStatus: BookingStatusData[] = [
  { status: 'Pending', count: 5, percentage: 15 },
  { status: 'Confirmed', count: 10, percentage: 30 },
  { status: 'InProgress', count: 20, percentage: 22 },
  { status: 'Completed', count: 30, percentage: 52 },
  { status: 'Canceled', count: 25, percentage: 8 },
  { status: 'Paid', count: 60, percentage: 40 }
];

const mockTopServices: TopService[] = [
  { serviceId: '1', serviceName: 'Tắm rửa thú cưng', bookingCount: 9 },
  { serviceId: '2', serviceName: 'Cắt tỉa lông', bookingCount: 5 },
  { serviceId: '3', serviceName: 'Spa thú cưng', bookingCount: 5 },
  { serviceId: '4', serviceName: 'Khám sức khỏe', bookingCount: 3 },
  { serviceId: '5', serviceName: 'Tiêm vaccine', bookingCount: 2 }
];

const mockTopCustomers: TopCustomer[] = [
  { customerId: '1', customerName: 'Nguyễn Văn A', bookingCount: 15, totalSpent: 320000 },
  { customerId: '2', customerName: 'Trần Thị B', bookingCount: 12, totalSpent: 280000 },
  { customerId: '3', customerName: 'Lê Văn C', bookingCount: 10, totalSpent: 240000 },
  { customerId: '4', customerName: 'Phạm Thị D', bookingCount: 8, totalSpent: 190000 },
  { customerId: '5', customerName: 'Hoàng Văn E', bookingCount: 7, totalSpent: 165000 }
];

const mockReviewStats: ReviewStats = {
  averageRating: 4.2,
  totalReviews: 89,
  ratingDistribution: [
    { rating: 5, count: 45, percentage: 51 },
    { rating: 4, count: 28, percentage: 31 },
    { rating: 3, count: 12, percentage: 13 },
    { rating: 2, count: 3, percentage: 3 },
    { rating: 1, count: 1, percentage: 1 }
  ]
};

const mockRecentReviews: RecentReview[] = [
  {
    customerId: '1',
    customerName: 'Nguyễn Văn A',
    rating: 5,
    comment: 'Dịch vụ tuyệt vời, nhân viên rất chu đáo!',
    serviceName: 'Tắm rửa thú cưng',
    createdDate: '2025-05-26'
  },
  {
    customerId: '2',
    customerName: 'Trần Thị B',
    rating: 4,
    comment: 'Thú cưng rất thích, sẽ quay lại.',
    serviceName: 'Spa thú cưng',
    createdDate: '2025-05-25'
  },
  {
    customerId: '3',
    customerName: 'Lê Văn C',
    rating: 5,
    comment: 'Chất lượng dịch vụ xuất sắc!',
    serviceName: 'Cắt tỉa lông',
    createdDate: '2025-05-24'
  },
  {
    customerId: '4',
    customerName: 'Phạm Thị D',
    rating: 4,
    comment: 'Nhân viên thân thiện, giá cả hợp lý.',
    serviceName: 'Khám sức khỏe',
    createdDate: '2025-05-23'
  },
  {
    customerId: '5',
    customerName: 'Hoàng Văn E',
    rating: 5,
    comment: 'Rất hài lòng với dịch vụ.',
    serviceName: 'Tiêm vaccine',
    createdDate: '2025-05-22'
  }
];

export const statisticsService = {
  // Fetch tất cả dữ liệu thống kê
  async getAllStatistics(): Promise<StatisticsData> {
    try {
      // Thử gọi API thật trước
      const response = await axios.get<APIResponse<StatisticsData>>(`${API_BASE_URL}/api/admin/statistics`);
      return response.data.result;
    } catch (error) {
      console.warn('API chưa có, sử dụng mock data:', error);
      // Nếu API chưa có, trả về mock data
      return {
        overview: mockOverviewStats,
        revenueChart: mockRevenueData,
        topServices: mockTopServices,
        topCustomers: mockTopCustomers,
        reviewStats: mockReviewStats,
        recentReviews: mockRecentReviews
      };
    }
  },

  // Fetch thống kê tổng quan
  async getOverviewStats(): Promise<OverviewStats> {
    try {
      const response = await axios.get<APIResponse<OverviewStats>>(`${API_BASE_URL}/api/admin/statistics/overview`);
      return response.data.result;
    } catch (error) {
      console.warn('API chưa có, sử dụng mock data:', error);
      return mockOverviewStats;
    }
  },

  // Fetch dữ liệu doanh thu
  async getRevenueData(days: number = 7): Promise<RevenueData[]> {
    try {
      const response = await axios.get<APIResponse<RevenueData[]>>(`${API_BASE_URL}/api/admin/statistics/revenue?days=${days}`);
      return response.data.result;
    } catch (error) {
      console.warn('API chưa có, sử dụng mock data:', error);
      return mockRevenueData;
    }
  },

  // Fetch trạng thái booking
  async getBookingStatus(): Promise<BookingStatusData[]> {
    try {
      const response = await axios.get<APIResponse<BookingStatusData[]>>(`${API_BASE_URL}/api/admin/statistics/booking-status`);
      return response.data.result;
    } catch (error) {
      console.warn('API chưa có, sử dụng mock data:', error);
      return mockBookingStatus;
    }
  },

  // Fetch top services
  async getTopServices(limit: number = 5): Promise<TopService[]> {
    try {
      const response = await axios.get<APIResponse<TopService[]>>(`${API_BASE_URL}/api/admin/statistics/top-services?limit=${limit}`);
      return response.data.result;
    } catch (error) {
      console.warn('API chưa có, sử dụng mock data:', error);
      return mockTopServices.slice(0, limit);
    }
  },

  // Fetch top customers
  async getTopCustomers(limit: number = 5): Promise<TopCustomer[]> {
    try {
      const response = await axios.get<APIResponse<TopCustomer[]>>(`${API_BASE_URL}/api/admin/statistics/top-customers?limit=${limit}`);
      return response.data.result;
    } catch (error) {
      console.warn('API chưa có, sử dụng mock data:', error);
      return mockTopCustomers.slice(0, limit);
    }
  },

  // Fetch review statistics
  async getReviewStats(): Promise<ReviewStats> {
    try {
      const response = await axios.get<APIResponse<ReviewStats>>(`${API_BASE_URL}/api/admin/statistics/reviews`);
      return response.data.result;
    } catch (error) {
      console.warn('API chưa có, sử dụng mock data:', error);
      return mockReviewStats;
    }
  },

  // Fetch recent reviews
  async getRecentReviews(limit: number = 5): Promise<RecentReview[]> {
    try {
      const response = await axios.get<APIResponse<RecentReview[]>>(`${API_BASE_URL}/api/admin/statistics/recent-reviews?limit=${limit}`);
      return response.data.result;
    } catch (error) {
      console.warn('API chưa có, sử dụng mock data:', error);
      return mockRecentReviews.slice(0, limit);
    }
  }
};
