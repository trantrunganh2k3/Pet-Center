package com.example.BE.dto.response;

import java.math.BigInteger;

public record OverviewStats(
        long todayBookings,
        long totalBooking,
        BigInteger todayRevenue,
        BigInteger totalRevenue
) {
}
