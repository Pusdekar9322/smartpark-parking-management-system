package com.smartpark.dto.response;

import com.smartpark.enums.BookingStatus;
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
public class BookingResponse {
    private Long id;
    private String bookingNumber;
    private Long userId;
    private String customerName;
    private String customerEmail;
    private String customerMobile;
    private Long vehicleId;
    private String vehicleNumber;
    private VehicleType vehicleType;
    private Long parkingLocationId;
    private String locationName;
    private String locationAddress;
    private String locationArea;
    private String locationCity;
    private Long parkingFloorId;
    private String floorName;
    private Long parkingSlotId;
    private String slotNumber;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime actualEntryTime;
    private LocalDateTime actualExitTime;
    private BigDecimal estimatedAmount;
    private BigDecimal finalAmount;
    private BigDecimal discountAmount;
    private String couponCode;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private BookingStatus bookingStatus;
    private String qrCodeReference;
    private String qrCodeBase64;
    private Long invoiceId;
    private String invoiceNumber;
    private LocalDateTime createdAt;
}
