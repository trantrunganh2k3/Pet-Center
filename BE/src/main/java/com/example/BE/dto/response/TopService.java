package com.example.BE.dto.response;

public record TopService(
        String serviceId,
        String serviceName,
        long bookingCount
) {
}
