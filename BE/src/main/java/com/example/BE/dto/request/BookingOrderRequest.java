package com.example.BE.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Time;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingOrderRequest {

    String customerId;
    String petId;
    List<String> servicesId;
    LocalDate selectedDate;
    Time selectedTime;
    LocalDate createdDate;
}
