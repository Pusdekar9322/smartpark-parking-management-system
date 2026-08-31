package com.smartpark.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RazorpayOrderResponse {
    private String orderId;
    private String keyId;
    private BigDecimal amount;
    private Long amountInPaise;
    private String currency;
    private String bookingNumber;
    private String customerName;
    private String customerEmail;
    private String customerMobile;
}
