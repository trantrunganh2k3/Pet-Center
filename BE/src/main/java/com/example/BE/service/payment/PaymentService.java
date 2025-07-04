package com.example.BE.service.payment;

import com.example.BE.dto.request.PaymentRequest;
import com.example.BE.dto.response.PaymentResponse;
import com.example.BE.entity.Booking;
import com.example.BE.entity.Payment;
import com.example.BE.enums.BookingStatus;
import com.example.BE.enums.PaymentMethod;
import com.example.BE.exception.AppException;
import com.example.BE.exception.ErrorCode;
import com.example.BE.gateway.PaymentGateway;
import com.example.BE.mapper.PaymentMapper;
import com.example.BE.repository.BookingRepository;
import com.example.BE.repository.PaymentRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PaymentService {

    PaymentRepository paymentRepository;
    BookingRepository bookingRepository;
    PaymentMapper paymentMapper;
    PaymentGatewayFactory paymentGatewayFactory;

    public PaymentResponse createPayment(PaymentRequest paymentRequest) {

        Booking booking = bookingRepository.findById(paymentRequest.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        Payment existingPayment = paymentRepository.findByBookingBookingId(paymentRequest.getBookingId());

        if (existingPayment != null) {
            if(!existingPayment.isPaid()){
                paymentRepository.delete(existingPayment);
            } else {
                throw new AppException(ErrorCode.PAYMENT_PAID);
            }
        }

        Payment payment = paymentMapper.toPayment(paymentRequest);
        if(paymentRequest.getMethod() == PaymentMethod.Cash){
            booking.setStatus(BookingStatus.Paid);
            payment.setPaid(true);
        }
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

    public String createPayLink(String paymentId, String clientIp) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        PaymentGateway paymentGateway = paymentGatewayFactory.of(payment.getMethod());
        return paymentGateway.buildPayUrl(payment, clientIp);
    }

    public String handleCallback(Map<String, String> params, PaymentMethod method){
        PaymentGateway paymentGateway = paymentGatewayFactory.of(method);
        PaymentGateway.GatewayResult result = paymentGateway.verifyCallback(params);
        if(!result.success())
            throw new AppException(ErrorCode.PAYMENT_FAILED);

        Payment payment = paymentRepository.findById(result.paymentId())
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        if(!payment.isPaid()){
            payment.markPaid(result.gatewayTxnNo());
            paymentRepository.save(payment);
            Booking booking = payment.getBooking();
            booking.setStatus(BookingStatus.Paid);
            bookingRepository.save(booking);
        }

        return payment.getPaymentId();
    }
}
