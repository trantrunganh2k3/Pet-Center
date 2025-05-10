package com.example.BE.repository;

import com.example.BE.entity.Booking;
import com.example.BE.entity.BookingDetails;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingDetailsRepository extends JpaRepository<BookingDetails, String> {

    @EntityGraph(attributePaths = {
            "pet",              // lấy thông tin thú cưng
            "booking.customer", // lấy thông tin khách hàng từ booking
            "service",          // nếu cần hiển thị thông tin dịch vụ
            "staff"             // nếu có staff đã được gán
    })
    List<BookingDetails> findByBookingBookingId(String bookingId);

    @EntityGraph(attributePaths = {
            "pet",              // lấy thông tin thú cưng
            "booking.customer", // lấy thông tin khách hàng từ booking
            "service",          // nếu cần hiển thị thông tin dịch vụ
            "staff"             // nếu có staff đã được gán
    })
    List<BookingDetails> findByBookingBookingIdOrderByPriorityAsc(String bookingId);

    @EntityGraph(attributePaths = {
            "pet",              // lấy thông tin thú cưng
            "booking.customer", // lấy thông tin khách hàng từ booking
            "service",          // nếu cần hiển thị thông tin dịch vụ
            "staff"             // nếu có staff đã được gán
    })
    Optional<BookingDetails> findFirstByBookingBookingIdAndPriorityGreaterThanOrderByPriorityAsc(String bookingId, Integer priority);

    List<BookingDetails> findByStaffStaffId(String staffId);
}
