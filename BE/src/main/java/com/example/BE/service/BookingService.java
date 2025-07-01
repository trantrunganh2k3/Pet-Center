package com.example.BE.service;

import com.example.BE.dto.request.*;
import com.example.BE.dto.response.BookingResponse;
import com.example.BE.dto.response.UserResponse;
import com.example.BE.entity.*;
import com.example.BE.enums.BookingDetailsStatus;
import com.example.BE.enums.BookingStatus;
import com.example.BE.exception.AppException;
import com.example.BE.exception.ErrorCode;
import com.example.BE.mapper.BookingMapper;
import com.example.BE.mapper.UserMapper;
import com.example.BE.repository.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;


@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class BookingService {

    BookingRepository bookingRepository;
    BookingMapper bookingMapper;
    CustomerRepository customerRepository;
    PetRepository petRepository;
    ServiceRepository serviceRepository;
    BookingDetailsRepository bookingDetailsRepository;

    public BookingResponse createBooking(BookingOrderRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new AppException(ErrorCode.CUSTOMER_NOT_FOUND));

        Pet pet = petRepository.findById(request.getPetId())
                .orElseThrow(() -> new AppException(ErrorCode.PET_NOT_FOUND));

        List<Services> foundServices = serviceRepository.findAllById(request.getServicesId());

        Booking booking = Booking.builder()
                .customer(customer)
                .createdDate(request.getCreatedDate())
                .bookingDate(request.getSelectedDate())
                .bookingTime(request.getSelectedTime())
                .status(BookingStatus.Pending)
                .build();

        bookingRepository.save(booking);

        AtomicInteger counter = new AtomicInteger(1);

        List<BookingDetails> bookingDetailsList = foundServices.stream()
                .map(services -> BookingDetails.builder()
                        .booking(booking)
                        .pet(pet)
                        .service(services)
                        .selectedDate(request.getSelectedDate())
                        .selectedTime(request.getSelectedTime())
                        .priority(counter.getAndIncrement())
                        .status(BookingDetailsStatus.Blocked)
                        .build())
                .toList();

        bookingDetailsRepository.saveAll(bookingDetailsList);

        return bookingMapper.toBookingResponse(booking);

    }

    public List<BookingResponse> getBookingEachCus(String customerId) {
        return bookingRepository.findBookingByCustomerCustomerId(customerId)
                .stream().map(bookingMapper::toBookingResponse).toList();
    }

    public BookingResponse getBooking(String bookingId) {
        return bookingMapper.toBookingResponse(bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND)));
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

    public BookingResponse evaluateBooking(String bookingId, Evaluate evaluate) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        booking.setRating(evaluate.getRating());
        booking.setComment(evaluate.getComment());

        return bookingMapper.toBookingResponse(bookingRepository.save(booking));
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Evaluate {
        private String comment;
        private int rating;
    }

    public void deleteBooking(String bookingId) {
        bookingRepository.deleteById(bookingId);
    }

}
