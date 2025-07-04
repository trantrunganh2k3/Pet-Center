export interface OverviewStats {
  todayBookings: number;
  totalBookings: number;
  todayRevenue: number;
  totalRevenue: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
}

export interface BookingStatusData {
  status: string;
  count: number;
  percentage: number;
}

export interface TopService {
  serviceId: string;
  serviceName: string;
  bookingCount: number;
}

export interface TopCustomer {
  customerId: string;
  customerName: string;
  bookingCount: number;
  totalSpent: number;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    rating: number;
    count: number;
    percentage: number;
  }[];
}

export interface RecentReview {
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  serviceName: string;
  createdDate: string;
}

export interface DashboardResponse {
  overviewStats: OverviewStats;
  revenueChart: RevenueData[];
  topServices: TopService[];
  topCustomers: TopCustomer[];
}

export interface StatisticsData {
  overview: OverviewStats;
  revenueChart: RevenueData[];
  topServices: TopService[];
  topCustomers: TopCustomer[];
  reviewStats: ReviewStats;
  recentReviews: RecentReview[];
}
