package com.smartpark.dto.response;

import com.smartpark.enums.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PricingRuleResponse {
    private Long id;
    private VehicleType vehicleType;
    private Integer baseHours;
    private BigDecimal basePrice;
    private BigDecimal extraHourPrice;
    private BigDecimal weekendSurcharge;
    private Boolean active;
}
