package com.example.BE.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingResponse {

    String bookingId;

    enum Status {
        Pending,
        Processing,
        Completed,
        Canceled
    }

    String note;
    LocalDate createdDate;
    LocalDate updatedDate;
}
