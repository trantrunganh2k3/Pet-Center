package com.example.BE.mapper;

import com.example.BE.dto.response.*;
import com.example.BE.entity.*;
import org.mapstruct.*;

@Mapper(componentModel = "spring", nullValueMappingStrategy = NullValueMappingStrategy.RETURN_NULL)
public interface BookingDetailsMapper {

    @Mapping(target = "pet", source = "pet")
    @Mapping(target = "customer", source = "booking.customer")
    @Mapping(target = "staff", source = "staff", qualifiedByName = "mapStaffInfoNullable")
    @Mapping(target = "service", source = "service")
    BookingDetailsResponse toBookingDetailsResponse(BookingDetails bookingDetails);

    // Sub mappings
    @Mapping(source = "petId", target = "petId")
    @Mapping(source = "name", target = "petName")
    PetInfo toPetInfo(Pet pet);

    @Mapping(source = "customerId", target = "customerId")
    @Mapping(source = "name", target = "customerName")
    @Mapping(source = "phone", target = "phone")
    CustomerInfo toCustomerInfo(Customer customer);

    @Named("mapStaffInfoNullable")
    @Mapping(source = "staffId", target = "staffId")
    @Mapping(source = "name", target = "name")
    StaffInfo toStaffInfo(Staff staff);

    @Mapping(source = "serviceId", target = "serviceId")
    @Mapping(source = "name", target = "serviceName")
    ServiceInfo toServiceInfo(Services service);
}
