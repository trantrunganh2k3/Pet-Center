package com.example.BE.service;

import com.example.BE.dto.response.*;
import com.example.BE.repository.BookingDetailsRepository;
import com.example.BE.repository.BookingRepository;
import com.example.BE.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final BookingRepository bookingRepo;
    private final PaymentRepository paymentRepo;
    private final BookingDetailsRepository bookingDetailsRepo;

    public DashboardResponse getDashboardStats() {
        // 1. Tổng quan
        long todayBookings = bookingRepo.countBookingsToday();
        long totalBookings = bookingRepo.countAllBookings();
        BigInteger todayRevenue = paymentRepo.getTodayRevenue();
        BigInteger totalRevenue = paymentRepo.getTotalRevenue();

        OverviewStats overviewStats = new OverviewStats(
                todayBookings, totalBookings, todayRevenue, totalRevenue
        );

        // 2. Doanh thu 7 ngày
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(6); // 7 ngày gần nhất

        List<Object[]> raw = paymentRepo.getRevenueLast7Days(startDate);

        Map<LocalDate, BigDecimal> actualMap = raw.stream()
                .collect(Collectors.toMap(
                        row -> ((java.sql.Date) row[0]).toLocalDate(),
                        row -> (BigDecimal) row[1]
                ));

        List<RevenueData> revenueChart = IntStream.rangeClosed(0, 6)
                .mapToObj(i -> {
                    LocalDate date = startDate.plusDays(i);
                    BigDecimal revenue = actualMap.getOrDefault(date, BigDecimal.ZERO);
                    return new RevenueData(date, revenue);
                })
                .toList();

        // 3. Top dịch vụ
        List<TopService> topServices = bookingDetailsRepo.getTop5MostUsedServices().stream()
                .map(row -> new TopService(
                        (String) row[0], // serviceId
                        (String) row[1], // serviceName
                        (Long) row[2]))  // bookingCount
                .toList();

        // 4. Top khách hàng
        List<TopCustomer> topCustomers = bookingRepo.getTop5HighestSpendingCustomers(PageRequest.of(0, 5)).stream()
                .map(row -> new TopCustomer(
                        (String) row[0], // customerId
                        (String) row[1], // customerName
                        (Long) row[2],   // bookingCount
                        (BigInteger) row[3])) // totalSpent
                .toList();

        return new DashboardResponse(overviewStats, revenueChart, topServices, topCustomers);
    }
}

