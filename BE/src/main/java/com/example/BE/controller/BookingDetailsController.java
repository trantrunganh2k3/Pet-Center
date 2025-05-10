package com.example.BE.controller;

import com.example.BE.dto.request.ApiResponse;
import com.example.BE.dto.request.BookingOrderRequest;
import com.example.BE.dto.response.BookingDetailsResponse;
import com.example.BE.dto.response.BookingResponse;
import com.example.BE.service.BookingDetailsService;
import com.example.BE.service.BookingService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/booking_details")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingDetailsController {

    BookingDetailsService bookingDetailsService;

    @GetMapping({"/bookingId"})
    public ApiResponse<List<BookingDetailsResponse>> getBookingDetails(@RequestParam("bookingId") String bookingId) {

        return ApiResponse.<List<BookingDetailsResponse>>builder()
                .result(bookingDetailsService.getBookingDetailsForEach(bookingId))
                .build();
    }

}
