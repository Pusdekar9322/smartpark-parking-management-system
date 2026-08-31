package com.smartpark.dto.request;

import com.smartpark.enums.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckOutRequest {

    @NotBlank(message = "Booking number or QR reference is required")
    private String bookingIdentifier;

    private PaymentMethod paymentMethod; // Used if paying at parking counter
    private Long locationId;
}
