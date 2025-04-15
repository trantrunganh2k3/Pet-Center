package com.example.BE.service;

import com.example.BE.dto.request.BookingRequest;
import com.example.BE.dto.request.CustomerRegistrationRequest;
import com.example.BE.dto.request.UserCreationRequest;
import com.example.BE.dto.request.UserUpdateRequest;
import com.example.BE.dto.response.BookingResponse;
import com.example.BE.dto.response.UserResponse;
import com.example.BE.entity.Booking;
import com.example.BE.entity.Customer;
import com.example.BE.entity.Staff;
import com.example.BE.entity.User;
import com.example.BE.exception.AppException;
import com.example.BE.exception.ErrorCode;
import com.example.BE.mapper.BookingMapper;
import com.example.BE.mapper.UserMapper;
import com.example.BE.repository.BookingRepository;
import com.example.BE.repository.CustomerRepository;
import com.example.BE.repository.StaffRepository;
import com.example.BE.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class BookingService {

    BookingRepository bookingRepository;
    BookingMapper bookingMapper;
    CustomerRepository customerRepository;

    public BookingResponse createBooking(String customerId, BookingRequest bookingRequest) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new AppException(ErrorCode.CUSTOMER_NOT_FOUND));

        Booking booking = bookingMapper.toBooking(bookingRequest);
        booking.setCustomer(customer);

        bookingRepository.save(booking);
        return bookingMapper.toBookingResponse(booking);
    }

    public List<BookingResponse> getAllBookings(String customerId) {
        return bookingRepository.findBookingByCustomerCustomerId(customerId)
                .stream().map(bookingMapper::toBookingResponse).toList();
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll()
                .stream().map(bookingMapper::toBookingResponse).toList();
    }

    public BookingResponse updateBooking(String bookingId, BookingRequest bookingRequest) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        bookingMapper.updateBooking(booking, bookingRequest);
        return bookingMapper.toBookingResponse(bookingRepository.save(booking));
    }

    public void deleteBooking(String bookingId) {
        bookingRepository.deleteById(bookingId);
    }

}
