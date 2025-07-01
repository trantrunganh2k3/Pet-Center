package com.example.BE.dto.response;

import com.example.BE.enums.BookingStatus;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentResponse {

    String paymentId;
    String bookingId;
    String invoiceNumber;
    String note;
    BigInteger subtotal;
    BigInteger discount;
    BigInteger tax;
    BigDecimal total;
    boolean paid;
}
