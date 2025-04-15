package com.example.BE.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingRequest {

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
