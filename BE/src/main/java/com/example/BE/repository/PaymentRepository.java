package com.example.BE.repository;

import com.example.BE.entity.Payment;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigInteger;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {

    Payment findByBookingBookingId(String bookingId);

    @Query("SELECT COALESCE(SUM(p.total), 0) FROM Payment p WHERE DATE(p.booking.bookingDate) = CURRENT_DATE")
    BigInteger getTodayRevenue();

    @Query("SELECT COALESCE(SUM(p.total), 0) FROM Payment p")
    BigInteger getTotalRevenue();

    @Query("""
    SELECT DATE(b.bookingDate), SUM(p.total)
    FROM Payment p JOIN p.booking b
    WHERE DATE(b.bookingDate) >= :startDate
    GROUP BY DATE(b.bookingDate)
    ORDER BY DATE(b.bookingDate)
""")
    List<Object[]> getRevenueLast7Days(@Param("startDate") LocalDate startDate);

    @Query("""
    SELECT b.customer.name, SUM(p.total) AS totalSpent
    FROM Payment p
    JOIN p.booking b
    GROUP BY b.customer.name
    ORDER BY totalSpent DESC
""")
    List<Object[]> getTop5HighestSpendingCustomers(Pageable pageable);  // Pageable.ofSize(5)

}
