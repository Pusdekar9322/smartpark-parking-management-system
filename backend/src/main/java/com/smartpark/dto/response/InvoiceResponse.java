package com.smartpark.dto.response;

import com.smartpark.enums.PaymentMethod;
import com.smartpark.enums.PaymentStatus;
import com.smartpark.enums.VehicleType;
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
public class InvoiceResponse {
    private Long id;
    private String invoiceNumber;
    private Long bookingId;
    private String bookingNumber;
    private String customerName;
    private String customerMobile;
    private String vehicleNumber;
    private VehicleType vehicleType;
    private String locationName;
    private String locationAddress;
    private String floorName;
    private String slotNumber;
    private LocalDateTime entryTime;
    private LocalDateTime exitTime;
    private Double durationHours;
    private BigDecimal parkingCharges;
    private BigDecimal discountAmount;
    private BigDecimal cgstAmount;
    private BigDecimal sgstAmount;
    private BigDecimal totalAmount;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private LocalDateTime generatedAt;
}
