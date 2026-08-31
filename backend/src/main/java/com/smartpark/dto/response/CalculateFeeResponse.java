package com.smartpark.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CalculateFeeResponse {
    private Double durationHours;
    private Long billableHours;
    private BigDecimal basePrice;
    private BigDecimal extraHourCharges;
    private BigDecimal weekendSurcharge;
    private BigDecimal grossAmount;
    private BigDecimal discountAmount;
    private BigDecimal cgstAmount;
    private BigDecimal sgstAmount;
    private BigDecimal totalAmount;
    private Boolean isWeekend;
}
