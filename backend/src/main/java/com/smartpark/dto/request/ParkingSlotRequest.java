package com.smartpark.dto.request;

import com.smartpark.enums.SlotStatus;
import com.smartpark.enums.SlotType;
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
public class ParkingSlotRequest {

    @NotNull(message = "Floor ID is required")
    private Long floorId;

    @NotBlank(message = "Slot number is required (e.g. A01, B12)")
    private String slotNumber;

    @NotNull(message = "Slot type is required (BIKE, CAR, SUV, EV, DISABLED)")
    private SlotType slotType;

    private SlotStatus status;
}
