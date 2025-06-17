package com.example.BE.entity;

import com.example.BE.enums.PaymentMethod;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.math.BigInteger;

@Entity
@Table(name = "payment")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String paymentId;

    @Enumerated(EnumType.STRING)
    PaymentMethod method;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bookingId", nullable = false)
    Booking booking;

    String invoiceNumber;
    String note;
    BigInteger subtotal;
    BigInteger discount;
    BigInteger tax;
    BigDecimal total;
    boolean paid = false;

    public void markPaid(String txnNo){
        if (this.paid) throw new IllegalStateException("Payment has already been paid");
        this.paid = true;
        this.invoiceNumber = txnNo;
    }
}