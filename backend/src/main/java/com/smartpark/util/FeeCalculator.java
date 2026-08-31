package com.smartpark.util;

import com.smartpark.entity.PricingRule;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDateTime;

@Component
public class FeeCalculator {

    public static class FeeBreakdown {
        public double durationHours;
        public long billableHours;
        public BigDecimal basePrice = BigDecimal.ZERO;
        public BigDecimal extraHourCharges = BigDecimal.ZERO;
        public BigDecimal weekendSurcharge = BigDecimal.ZERO;
        public BigDecimal grossAmount = BigDecimal.ZERO;
        public boolean isWeekend;
    }

    public FeeBreakdown calculateFee(PricingRule rule, LocalDateTime startTime, LocalDateTime endTime) {
        FeeBreakdown breakdown = new FeeBreakdown();
        if (rule == null || startTime == null || endTime == null || !endTime.isAfter(startTime)) {
            return breakdown;
        }

        long minutes = Duration.between(startTime, endTime).toMinutes();
        if (minutes < 1) {
            minutes = 1;
        }

        double totalHours = minutes / 60.0;
        breakdown.durationHours = Math.round(totalHours * 100.0) / 100.0;

        int baseHours = rule.getBaseHours() != null ? rule.getBaseHours() : 2;
        breakdown.basePrice = rule.getBasePrice() != null ? rule.getBasePrice() : BigDecimal.ZERO;

        DayOfWeek day = startTime.getDayOfWeek();
        breakdown.isWeekend = (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY);

        BigDecimal weekendRate = (breakdown.isWeekend && rule.getWeekendSurcharge() != null)
                ? rule.getWeekendSurcharge()
                : BigDecimal.ZERO;

        if (totalHours <= baseHours) {
            breakdown.billableHours = (long) baseHours;
            breakdown.extraHourCharges = BigDecimal.ZERO;
            breakdown.weekendSurcharge = weekendRate.multiply(BigDecimal.valueOf(baseHours));
            breakdown.grossAmount = breakdown.basePrice.add(breakdown.weekendSurcharge);
        } else {
            double extraHours = totalHours - baseHours;
            // Rule: Every started additional hour is rounded up to a full hour
            long roundedExtraHours = (long) Math.ceil(extraHours);
            breakdown.billableHours = baseHours + roundedExtraHours;

            BigDecimal extraRate = rule.getExtraHourPrice() != null ? rule.getExtraHourPrice() : BigDecimal.ZERO;
            breakdown.extraHourCharges = extraRate.multiply(BigDecimal.valueOf(roundedExtraHours));

            breakdown.weekendSurcharge = weekendRate.multiply(BigDecimal.valueOf(breakdown.billableHours));
            breakdown.grossAmount = breakdown.basePrice.add(breakdown.extraHourCharges).add(breakdown.weekendSurcharge);
        }

        breakdown.basePrice = breakdown.basePrice.setScale(2, RoundingMode.HALF_UP);
        breakdown.extraHourCharges = breakdown.extraHourCharges.setScale(2, RoundingMode.HALF_UP);
        breakdown.weekendSurcharge = breakdown.weekendSurcharge.setScale(2, RoundingMode.HALF_UP);
        breakdown.grossAmount = breakdown.grossAmount.setScale(2, RoundingMode.HALF_UP);
        return breakdown;
    }
}
