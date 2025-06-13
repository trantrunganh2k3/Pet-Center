package com.example.BE.controller;

import io.swagger.v3.oas.annotations.tags.Tag;

import com.example.BE.dto.request.ApiResponse;
import com.example.BE.dto.request.BookingOrderRequest;
import com.example.BE.dto.request.BookingRequest;
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
@Tag(name = "Booking Management", description = "Pet service booking management")
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

    @GetMapping("/info/{bookingId}")
    ApiResponse<BookingResponse> getBooking(@PathVariable String bookingId) {

        return ApiResponse.<BookingResponse>builder()
                .result(bookingService.getBooking(bookingId))
                .build();
    }

    @GetMapping("/{userId}")
    ApiResponse<List<BookingResponse>> getBookingsByUserId(@PathVariable String userId) {

        return ApiResponse.<List<BookingResponse>>builder()
                .result(bookingService.getBookingEachCus(userId))
                .build();
    }

    @PutMapping("/{bookingId}")
    ApiResponse<BookingResponse> updateBooking(@RequestBody @Valid BookingRequest bookingRequest, @PathVariable String bookingId) {

        return ApiResponse.<BookingResponse>builder()
                .result(bookingService.updateBooking(bookingId, bookingRequest))
                .build();
    }

    @PutMapping("/evaluate/{bookingId}")
    ApiResponse<BookingResponse> evaluateBooking(@PathVariable String bookingId, @RequestBody BookingService.Evaluate evaluate) {

        return ApiResponse.<BookingResponse>builder()
                .result(bookingService.evaluateBooking(bookingId, evaluate))
                .build();
    }

//    @DeleteMapping
//    ApiResponse<BookingResponse> deleteBooking(@RequestParam("bookingId") String bookingId) {
//
//    }

}
