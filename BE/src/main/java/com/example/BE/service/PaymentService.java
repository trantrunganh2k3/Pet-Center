package com.example.BE.service;

import com.example.BE.dto.request.PaymentRequest;
import com.example.BE.dto.response.PaymentResponse;
import com.example.BE.entity.Booking;
import com.example.BE.entity.Payment;
import com.example.BE.enums.BookingStatus;
import com.example.BE.exception.AppException;
import com.example.BE.exception.ErrorCode;
import com.example.BE.mapper.PaymentMapper;
import com.example.BE.repository.BookingRepository;
import com.example.BE.repository.PaymentRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PaymentService {

    PaymentRepository paymentRepository;
    BookingRepository bookingRepository;
    PaymentMapper paymentMapper;

    public PaymentResponse createPayment(PaymentRequest paymentRequest) {

        Booking booking = bookingRepository.findById(paymentRequest.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        booking.setStatus(BookingStatus.Paid);
        bookingRepository.save(booking);

        Payment payment = paymentMapper.toPayment(paymentRequest);
        payment.setBooking(booking);

        return paymentMapper.toPaymentResponse(paymentRepository.save(payment));
    }

    public PaymentResponse getPayment(String paymentId) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        return paymentMapper.toPaymentResponse(payment);
    }

    public PaymentResponse getPaymentByBookingId(String bookingId) {

        Payment payment = paymentRepository.findByBookingBookingId(bookingId);
        return paymentMapper.toPaymentResponse(payment);
    }
}
