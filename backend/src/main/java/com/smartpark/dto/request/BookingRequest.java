package com.smartpark.dto.request;

import com.smartpark.enums.PaymentMethod;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingRequest {

    @NotNull(message = "Vehicle ID is required")
    private Long vehicleId;

    @NotNull(message = "Parking location ID is required")
    private Long parkingLocationId;

    @NotNull(message = "Parking slot ID is required")
    private Long parkingSlotId;

    @NotNull(message = "Start time is required")
    @Future(message = "Start time must be in the future or current time")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    @Future(message = "End time must be in the future")
    private LocalDateTime endTime;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    private String couponCode;
}
