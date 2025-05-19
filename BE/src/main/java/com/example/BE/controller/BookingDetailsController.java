package com.example.BE.controller;

import com.example.BE.dto.request.ApiResponse;
import com.example.BE.dto.request.BookingOrderRequest;
import com.example.BE.dto.response.BookingDetailsResponse;
import com.example.BE.dto.response.BookingResponse;
import com.example.BE.entity.Booking;
import com.example.BE.enums.BookingDetailsStatus;
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

    @GetMapping("/{bookingId}")
    public ApiResponse<List<BookingDetailsResponse>> getBookingDetails(@PathVariable String bookingId) {

        return ApiResponse.<List<BookingDetailsResponse>>builder()
                .result(bookingDetailsService.getBookingDetailsForEach(bookingId))
                .build();
    }

    @GetMapping("/staff/{staffId}")
    public ApiResponse<List<BookingDetailsResponse>> getDetailsByStaff(@PathVariable String staffId) {

        return ApiResponse.<List<BookingDetailsResponse>>builder()
                .result(bookingDetailsService.getBookingForStaff(staffId))
                .build();
    }

    @PutMapping("/status/{bookingId}")
    public ApiResponse<BookingDetailsResponse> updateDetailStatus(@PathVariable String bookingId, @RequestBody BookingDetailsStatus newStatus){

        return ApiResponse.<BookingDetailsResponse>builder()
                .result(bookingDetailsService.updateBookingDetailsStatus(bookingId, newStatus))
                .build();
    }

    @PutMapping("/arrange/{bookingId}")
    public ApiResponse<BookingResponse> arrangeBookingDetails(@RequestBody List<BookingDetailsService.BookingArrangement> arrangement, @PathVariable String bookingId) {

        return ApiResponse.<BookingResponse>builder()
                .result(bookingDetailsService.arrangeBookingDetails(bookingId, arrangement))
                .build();
    }

    @PutMapping("/price/{bookingId}")
    public ApiResponse<BookingResponse> updatePrice(@PathVariable("bookingId") String bookingId, @RequestBody List<BookingDetailsService.DetailsPrice> price) {

        return ApiResponse.<BookingResponse>builder()
                .result(bookingDetailsService.updateBookingPrice(bookingId, price))
                .build();
    }
}
