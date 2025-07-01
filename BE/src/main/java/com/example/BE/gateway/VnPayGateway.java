package com.example.BE.gateway;

import com.example.BE.entity.Payment;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component("VNPAY")
@RequiredArgsConstructor
public class VnPayGateway implements PaymentGateway {

    @Value("${vnp.tmn-code}")
    private String tmnCode;

    @Value("${vnp.hash-secret}")
    private String hashSecret;

    @Value("${vnp.pay-url}")
    private String payUrl;

    @Value("${vnp.return-url}")
    private String returnUrl;

    private static final DateTimeFormatter VNP_FMT = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    @Override
    public String buildPayUrl(Payment payment, String clientIp) {
        Map<String, String> params = new TreeMap<>();
        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", tmnCode);
        params.put("vnp_TxnRef", payment.getPaymentId());
        params.put("vnp_OrderInfo", payment.getPaymentId());
        params.put("vnp_OrderType", "other");
        BigDecimal amount = payment.getTotal().multiply(BigDecimal.valueOf(100));
        params.put("vnp_Amount", amount.toBigInteger().toString());
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_IpAddr", clientIp);
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", returnUrl);
        params.put("vnp_CreateDate", LocalDateTime.now().format(VNP_FMT));

        String query = params.entrySet().stream()
                .map(e -> e.getKey() + "=" + urlEncode(e.getValue()))
                .collect(Collectors.joining("&"));
        String secure = hmacSHA512(hashSecret, query);
        return payUrl + "?" + query + "&vnp_SecureHash=" + secure;
    }

    @Override
    public GatewayResult verifyCallback(Map<String, String> p) {
        Map<String, String> params = new TreeMap<>(p);
        String receivedHash = params.remove("vnp_SecureHash");
        String responseCode = params.get("vnp_ResponseCode");
        String transactionStatus = params.get("vnp_TransactionStatus");

        String data = params.entrySet().stream()
                .map(e -> e.getKey() + "=" + e.getValue())
                .collect(Collectors.joining("&"));

        boolean ok = receivedHash != null && receivedHash.equalsIgnoreCase(hmacSHA512(hashSecret, data))
                && "00".equals(params.get("vnp_ResponseCode"));

        boolean isHashValid = receivedHash != null &&
                receivedHash.equalsIgnoreCase(hmacSHA512(hashSecret, data));

        boolean isSuccess = isHashValid &&
                "00".equals(responseCode) &&
                "00".equals(transactionStatus);

        return new GatewayResult(
                isSuccess,
                params.get("vnp_TXnRef"),
                params.get("vnp_TransactionNo"),
                responseCode
        );
    }

    // ------------- helper -------------
    private static String urlEncode(String v) {
        return URLEncoder.encode(v, StandardCharsets.UTF_8);
    }

    private static String hmacSHA512(String key, String data) {
        try {
            javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA512");
            mac.init(new javax.crypto.spec.SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512"));
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(hash.length * 2);
            for (byte b : hash) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            throw new IllegalStateException("Cannot sign VNPAY payload", e);
        }
    }
}
