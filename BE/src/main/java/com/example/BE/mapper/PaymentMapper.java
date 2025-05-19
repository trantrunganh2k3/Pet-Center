package com.example.BE.mapper;

import com.example.BE.dto.request.PaymentRequest;
import com.example.BE.dto.response.PaymentResponse;
import com.example.BE.entity.Payment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PaymentMapper {

    @Mapping(target = "booking", ignore = true)
    Payment toPayment(PaymentRequest paymentRequest);

    PaymentResponse toPaymentResponse(Payment payment);

    @Mapping(target = "booking", ignore = true)
    void updatePayment(@MappingTarget Payment payment, PaymentRequest paymentRequest);
}
