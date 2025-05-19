package com.example.BE.mapper;

import com.example.BE.dto.request.BookingRequest;
import com.example.BE.dto.response.BookingResponse;
import com.example.BE.dto.response.CustomerInfo;
import com.example.BE.entity.Booking;
import com.example.BE.entity.Customer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface BookingMapper {

    @Mapping(target = "bookingId", ignore = true)
    @Mapping(target = "customer", ignore = true)
    Booking toBooking(BookingRequest bookingRequest);

    @Mapping(target = "bookingId", ignore = true)
    @Mapping(target = "customer", ignore = true)
    void updateBooking(@MappingTarget Booking booking, BookingRequest bookingRequest);

    @Mapping(target = "customer", source = "customer")
    BookingResponse toBookingResponse(Booking booking);

    @Mapping(target = "customerId", source = "customerId")
    @Mapping(target = "customerName", source = "name")
    @Mapping(target = "phone", source = "phone")
    CustomerInfo toCustomerInfo(Customer customer);
}
