package com.example.BE.controller;

import com.example.BE.dto.request.ApiResponse;
import com.example.BE.dto.request.BookingOrderRequest;
import com.example.BE.dto.response.BookingResponse;
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
@RequestMapping("/bookings")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingController {

    BookingService bookingService;

    @PostMapping
    ApiResponse<BookingResponse> createBooking(@RequestBody @Valid BookingOrderRequest bookingOrderRequest) {

        return ApiResponse.<BookingResponse>builder()
                .result(bookingService.createBooking(bookingOrderRequest))
                .build();
    }

    @GetMapping
    ApiResponse<List<BookingResponse>> getBookings() {

        return ApiResponse.<List<BookingResponse>>builder()
                .result(bookingService.getAllBookings())
                .build();
    }

    @GetMapping({"/userId"})
    ApiResponse<List<BookingResponse>> getBookingsByUserId(@RequestParam("userId") String userId) {

        return ApiResponse.<List<BookingResponse>>builder()
                .result(bookingService.getBookingEachCus(userId))
                .build();
    }

//    @DeleteMapping
//    ApiResponse<BookingResponse> deleteBooking(@RequestParam("bookingId") String bookingId) {
//
//    }

}
