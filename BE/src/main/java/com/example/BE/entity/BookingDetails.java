package com.example.BE.entity;

import com.example.BE.enums.BookingDetailsStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Time;
import java.time.LocalDate;
import java.util.Date;


@Entity
@Table(name = "booking_detail")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String bookingDetailsId;

    @Enumerated(EnumType.STRING)
    BookingDetailsStatus status;

    int priority;
    LocalDate selectedDate;
    Time selectedTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bookingId", nullable = false)
    Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "petId", nullable = false)
    Pet pet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "serviceId", nullable = false)
    Services service;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staffId", nullable = true)
    Staff staff;
}