package com.example.BE.repository;

import com.example.BE.entity.Booking;
import com.example.BE.entity.BookingDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingDetailsRepository extends JpaRepository<BookingDetails, String> {

    List<BookingDetails> findByBookingBookingId(String bookingId);
}
