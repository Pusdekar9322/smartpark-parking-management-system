package com.smartpark.dto.response;

import com.smartpark.enums.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleResponse {
    private Long id;
    private String vehicleNumber;
    private VehicleType vehicleType;
    private String vehicleBrand;
    private String vehicleModel;
    private String color;
    private LocalDateTime createdAt;
}
