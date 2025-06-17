package com.example.BE.gateway;

import com.example.BE.entity.Payment;

import java.util.Map;
import java.util.UUID;

public interface PaymentGateway {

    public record GatewayResult(boolean success,
                                String paymentId,
                                String gatewayTxnNo,
                                String errorCode) {
    }

    String buildPayUrl(Payment payment, String clientIp);
    GatewayResult verifyCallback(Map<String, String> params);

}
