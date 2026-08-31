package com.smartpark.dto.request;

import com.smartpark.enums.VehicleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleRequest {

    @NotBlank(message = "Vehicle number is required")
    @Pattern(regexp = "^[A-Z]{2}[\\s\\-]?[0-9]{1,2}[\\s\\-]?[A-Z]{1,3}[\\s\\-]?[0-9]{4}$",
            message = "Please provide a valid Indian vehicle registration number (e.g. MH 12 AB 1234)")
    private String vehicleNumber;

    @NotNull(message = "Vehicle type is required (BIKE, CAR, SUV, EV)")
    private VehicleType vehicleType;

    private String vehicleBrand;
    private String vehicleModel;
    private String color;
}
