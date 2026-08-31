package com.smartpark.dto.response;

import com.smartpark.enums.PaymentMethod;
import com.smartpark.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {
    private Long id;
    private Long bookingId;
    private String bookingNumber;
    private String customerName;
    private String transactionId;
    private String gatewayOrderId;
    private String gatewayPaymentId;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private LocalDateTime paymentDate;
    private LocalDateTime createdAt;
}
