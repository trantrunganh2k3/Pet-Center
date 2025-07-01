package com.example.BE.dto.response;

import java.util.List;

public record DashboardResponse(
        OverviewStats overviewStats,
        List<RevenueData> revenueChart,
        List<TopService> topServices,
        List<TopCustomer> topCustomers
) {
}
