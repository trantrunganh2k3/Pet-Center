package com.example.BE.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;


@Entity
@Table(name = "booking")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingService {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String bookingId;

    enum Status {
        Pending,
        Processing,
        Completed,
        Canceled
    }

    String note;
    Date createdDate;
}