package com.smartpark.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckInRequest {

    @NotBlank(message = "Booking number or QR reference is required")
    private String bookingIdentifier;

    private Long locationId;
}
