package com.example.BE.dto.response;

import com.example.BE.enums.BookingStatus;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.math.BigInteger;
import java.sql.Time;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingResponse {

    String bookingId;
    BookingStatus status;
    String note;
    LocalDate createdDate;
    LocalDate updatedDate;
    LocalDate bookingDate;
    Time bookingTime;
    CustomerInfo customer;
    BigInteger total;
    int rating;
    String comment;
    CustomerInfo customerInfo;
}
