package com.example.BE.controller;

import com.example.BE.dto.request.ApiResponse;
import com.example.BE.dto.request.PaymentRequest;
import com.example.BE.dto.response.PaymentResponse;
import com.example.BE.enums.PaymentMethod;
import com.example.BE.service.payment.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @Value("${fe.success-url}")
    private String feSuccessUrl;

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

    @PostMapping("/{paymentId}/pay-link")
    ApiResponse<String> getPayLink(@PathVariable String paymentId, HttpServletRequest request){

        return ApiResponse.<String>builder()
                .result(paymentService.createPayLink(paymentId, request.getRemoteAddr()))
                .build();
    }

    @GetMapping("/vnpay/return")
    ResponseEntity<Void> returnVnpay(@RequestParam Map<String, String> all) {

        String paymentId = paymentService.handleCallback(all, PaymentMethod.VNPAY);

        return ResponseEntity.status(HttpStatus.FOUND)
                .header(HttpHeaders.LOCATION,
                        feSuccessUrl + "?payment=" + paymentId)
                .build();
    }

    @PostMapping("/vnpay/ipn")
    public ApiResponse<String> ipnVnpay(@RequestParam Map<String,String> all) {

        paymentService.handleCallback(all, PaymentMethod.VNPAY);
        return ApiResponse.<String>builder()
                .result("OK")
                .build();
    }
}
