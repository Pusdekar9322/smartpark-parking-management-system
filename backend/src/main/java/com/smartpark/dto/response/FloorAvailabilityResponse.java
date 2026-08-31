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
public class FloorAvailabilityResponse {
    private Long floorId;
    private Integer floorNumber;
    private String floorName;
    private Integer totalSlots;
    private Integer availableSlots;
    private List<ParkingSlotResponse> slots;
}
