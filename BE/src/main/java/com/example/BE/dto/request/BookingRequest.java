package com.example.BE.dto.request;

import com.example.BE.enums.BookingStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingRequest {

    BookingStatus status;
    String note;
    LocalDate createdDate;
    LocalDate updatedDate;
}
