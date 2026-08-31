package com.smartpark.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParkingFloorRequest {

    @NotNull(message = "Location ID is required")
    private Long locationId;

    @NotNull(message = "Floor number is required")
    private Integer floorNumber;

    @NotBlank(message = "Floor name is required (e.g. Ground Floor, Basement 1)")
    private String floorName;
}
