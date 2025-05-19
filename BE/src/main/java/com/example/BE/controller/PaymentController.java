package com.example.BE.controller;

import com.example.BE.dto.request.ApiResponse;
import com.example.BE.dto.request.PaymentRequest;
import com.example.BE.dto.response.PaymentResponse;
import com.example.BE.service.PaymentService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentController {

    PaymentService paymentService;

    @PostMapping
    ApiResponse<PaymentResponse> createPayment(@RequestBody @Valid PaymentRequest paymentRequest) {

        return ApiResponse.<PaymentResponse>builder()
                .result(paymentService.createPayment(paymentRequest))
                .build();
    }

    @GetMapping("/payment/{paymentId}")
    ApiResponse<PaymentResponse> getPaymentById(@PathVariable("paymentId") String paymentId) {

        return ApiResponse.<PaymentResponse>builder()
                .result(paymentService.getPayment(paymentId))
                .build();
    }

    @GetMapping("/booking/{bookingId}")
    ApiResponse<PaymentResponse> getPaymentByBookingId(@PathVariable("bookingId") String bookingId) {

        return ApiResponse.<PaymentResponse>builder()
                .result(paymentService.getPaymentByBookingId(bookingId))
                .build();
    }
}
