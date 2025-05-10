package com.example.BE.repository;

import com.example.BE.dto.response.BookingResponse;
import com.example.BE.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {

    List<Booking> findBookingByCustomerCustomerId(String customerId);

    Optional<Booking> findByBookingId(String bookingId);

}
