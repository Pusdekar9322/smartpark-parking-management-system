package com.smartpark.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParkingFloorResponse {
    private Long id;
    private Integer floorNumber;
    private String floorName;
    private Long locationId;
    private String locationName;
    private Integer totalSlots;
    private Integer availableSlots;
    private List<ParkingSlotResponse> slots;
}
