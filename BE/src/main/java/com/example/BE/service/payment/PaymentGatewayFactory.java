package com.example.BE.service.payment;

import com.example.BE.enums.PaymentMethod;
import com.example.BE.gateway.PaymentGateway;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class PaymentGatewayFactory {
    private final Map<String, PaymentGateway> gatewayMap;  // key = bean name

    public PaymentGateway of(PaymentMethod method) {
        return gatewayMap.get(method.name());   // VNPAY, CASH…
    }
}

