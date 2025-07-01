package com.example.BE.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public record RevenueData(
        LocalDate date,
        BigDecimal revenue
) {
}
