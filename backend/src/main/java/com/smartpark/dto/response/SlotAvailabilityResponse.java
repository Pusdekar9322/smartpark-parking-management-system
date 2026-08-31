package com.smartpark.dto.response;

import com.smartpark.enums.LocationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SlotAvailabilityResponse {
    private Long locationId;
    private String locationName;
    private String locationAddress;
    private LocationStatus status;
    private LocalDateTime requestedStartTime;
    private LocalDateTime requestedEndTime;
    private Integer totalCapacity;
    private Integer totalAvailableForTime;
    private List<FloorAvailabilityResponse> floors;
}
