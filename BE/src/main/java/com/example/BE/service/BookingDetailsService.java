package com.example.BE.service;

import com.example.BE.dto.request.BookingOrderRequest;
import com.example.BE.dto.request.BookingRequest;
import com.example.BE.dto.response.BookingDetailsResponse;
import com.example.BE.dto.response.BookingResponse;
import com.example.BE.entity.*;
import com.example.BE.exception.AppException;
import com.example.BE.exception.ErrorCode;
import com.example.BE.mapper.BookingDetailsMapper;
import com.example.BE.mapper.BookingMapper;
import com.example.BE.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class BookingDetailsService {

    BookingDetailsRepository bookingDetailsRepository;
    BookingDetailsMapper bookingDetailsMapper;

    public List<BookingDetailsResponse> getBookingDetailsForEach(String bookingId) {

        return bookingDetailsRepository.findByBookingBookingId(bookingId)
                .stream().map(bookingDetailsMapper::toBookingDetailsResponse).toList();
    }
}
