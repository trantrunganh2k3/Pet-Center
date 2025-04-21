package com.example.BE.dto.response;

import com.example.BE.entity.Booking;
import com.example.BE.entity.Pet;
import com.example.BE.entity.Services;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.sql.Time;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingDetailsResponse {
    String bookingDetailsId;

    enum Status {
        Pending,
        Processing,
        Completed,
        Canceled
    }

    String note;
    LocalDate selectedDate;
    Time selectedTime;

}
