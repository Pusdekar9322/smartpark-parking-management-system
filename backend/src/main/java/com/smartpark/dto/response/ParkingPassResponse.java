package com.smartpark.dto.response;

import com.smartpark.enums.PassStatus;
import com.smartpark.enums.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParkingPassResponse {
    private Long id;
    private Long userId;
    private String customerName;
    private Long vehicleId;
    private String vehicleNumber;
    private String planName;
    private VehicleType vehicleType;
    private BigDecimal price;
    private LocalDate startDate;
    private LocalDate endDate;
    private PassStatus status;
    private String paymentId;
    private LocalDateTime createdAt;
}
