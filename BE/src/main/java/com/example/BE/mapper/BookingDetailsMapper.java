package com.example.BE.mapper;

import com.example.BE.dto.request.BookingRequest;
import com.example.BE.dto.response.BookingDetailsResponse;
import com.example.BE.dto.response.BookingResponse;
import com.example.BE.entity.Booking;
import com.example.BE.entity.BookingDetails;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface BookingDetailsMapper {

    BookingDetailsResponse toBookingDetailsResponse(BookingDetails bookingDetails);
}
