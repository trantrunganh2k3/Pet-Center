package com.example.BE.dto.response;

import java.math.BigInteger;

public record TopCustomer(
        String customerId,
        String customerName,
        long bookingCount,
        BigInteger totalSpent
) {
}
