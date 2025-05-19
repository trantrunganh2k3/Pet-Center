package com.example.BE.repository;

import com.example.BE.entity.Booking;
import com.example.BE.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {

    Payment findByBookingBookingId(String bookingId);

}
