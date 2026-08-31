package com.smartpark.dto.request;

import com.smartpark.enums.VehicleType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PricingRuleRequest {

    @NotNull(message = "Vehicle type is required")
    private VehicleType vehicleType;

    @NotNull(message = "Base hours is required")
    @Min(value = 1, message = "Base hours must be at least 1")
    private Integer baseHours;

    @NotNull(message = "Base price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Base price must be greater than 0")
    private BigDecimal basePrice;

    @NotNull(message = "Extra hour price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Extra hour price cannot be negative")
    private BigDecimal extraHourPrice;

    private BigDecimal weekendSurcharge;
    private Boolean active;
}
