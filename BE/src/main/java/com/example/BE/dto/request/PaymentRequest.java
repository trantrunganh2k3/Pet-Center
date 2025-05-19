package com.example.BE.dto.request;

import com.example.BE.entity.Booking;
import com.example.BE.enums.BookingStatus;
import com.example.BE.enums.PaymentMethod;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigInteger;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentRequest {

    String bookingId;
    PaymentMethod method;
    BigInteger subtotal;
    BigInteger discount;
    BigInteger tax;
    BigInteger total;
    LocalDate paymentDate;
    String note;
}
