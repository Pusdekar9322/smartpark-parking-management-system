package com.smartpark.dto.response;

import com.smartpark.enums.SlotStatus;
import com.smartpark.enums.SlotType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParkingSlotResponse {
    private Long id;
    private String slotNumber;
    private SlotType slotType;
    private SlotStatus status;
    private Long floorId;
    private String floorName;
    private Integer floorNumber;
    private Boolean isCompatible;
    private Boolean isAvailableForTime;
}
