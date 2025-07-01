package com.example.BE.repository;

import com.example.BE.dto.response.BookingResponse;
import com.example.BE.entity.Booking;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {

    List<Booking> findBookingByCustomerCustomerId(String customerId);

    Optional<Booking> findByBookingId(String bookingId);

    @Query("SELECT COUNT(b) FROM Booking b WHERE DATE(b.bookingDate) = CURRENT_DATE")
    long countBookingsToday();

    @Query("SELECT COUNT(b) FROM Booking b")
    long countAllBookings();

    @Query("""
    SELECT b.customer.customerId, b.customer.name, COUNT(b), SUM(b.total) AS totalSpent
    FROM Booking b
    WHERE b.total IS NOT NULL
    GROUP BY b.customer.customerId, b.customer.name
    ORDER BY totalSpent DESC
""")
    List<Object[]> getTop5HighestSpendingCustomers(Pageable pageable);


}
