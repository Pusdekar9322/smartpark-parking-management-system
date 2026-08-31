package com.smartpark;

import com.smartpark.entity.PricingRule;
import com.smartpark.enums.VehicleType;
import com.smartpark.util.FeeCalculator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class FeeCalculatorTest {

    private FeeCalculator feeCalculator;
    private PricingRule carPricing;

    @BeforeEach
    void setUp() {
        feeCalculator = new FeeCalculator();
        carPricing = PricingRule.builder()
                .vehicleType(VehicleType.CAR)
                .baseHours(2)
                .basePrice(new BigDecimal("40.00"))
                .extraHourPrice(new BigDecimal("20.00"))
                .weekendSurcharge(new BigDecimal("10.00"))
                .active(true)
                .build();
    }

    @Test
    @DisplayName("Test within base hours on weekday (2 hours = Base ₹40)")
    void testWithinBaseHoursWeekday() {
        // Wednesday: 2026-09-02 10:00 to 12:00 (2 hrs)
        LocalDateTime start = LocalDateTime.of(2026, 9, 2, 10, 0);
        LocalDateTime end = LocalDateTime.of(2026, 9, 2, 12, 0);

        FeeCalculator.FeeBreakdown result = feeCalculator.calculateFee(carPricing, start, end);

        assertEquals(2.0, result.durationHours);
        assertEquals(2, result.billableHours);
        assertEquals(0, new BigDecimal("40.00").compareTo(result.basePrice));
        assertEquals(0, BigDecimal.ZERO.compareTo(result.extraHourCharges));
        assertEquals(0, new BigDecimal("40.00").compareTo(result.grossAmount));
        assertFalse(result.isWeekend);
    }

    @Test
    @DisplayName("Test fractional extra hours rounded up on weekday (5.5 hrs -> 2 base + 4 extra = 40 + 80 = ₹120)")
    void testFractionalExtraHoursWeekday() {
        // Wednesday: 10:00 to 15:30 (5.5 hrs)
        LocalDateTime start = LocalDateTime.of(2026, 9, 2, 10, 0);
        LocalDateTime end = LocalDateTime.of(2026, 9, 2, 15, 30);

        FeeCalculator.FeeBreakdown result = feeCalculator.calculateFee(carPricing, start, end);

        assertEquals(5.5, result.durationHours);
        assertEquals(6, result.billableHours); // 2 base + ceil(3.5) = 6
        assertEquals(0, new BigDecimal("40.00").compareTo(result.basePrice));
        assertEquals(0, new BigDecimal("80.00").compareTo(result.extraHourCharges)); // 4 * 20 = 80
        assertEquals(0, new BigDecimal("120.00").compareTo(result.grossAmount)); // 40 + 80 = 120
    }

    @Test
    @DisplayName("Test weekend surcharge applied per billable hour on Saturday")
    void testWeekendSurchargeApplied() {
        // Saturday: 2026-09-05 10:00 to 13:00 (3 hrs)
        LocalDateTime start = LocalDateTime.of(2026, 9, 5, 10, 0);
        LocalDateTime end = LocalDateTime.of(2026, 9, 5, 13, 0);

        FeeCalculator.FeeBreakdown result = feeCalculator.calculateFee(carPricing, start, end);

        assertTrue(result.isWeekend);
        assertEquals(3.0, result.durationHours);
        assertEquals(3, result.billableHours); // 2 base + 1 extra = 3 hrs
        assertEquals(0, new BigDecimal("40.00").compareTo(result.basePrice));
        assertEquals(0, new BigDecimal("20.00").compareTo(result.extraHourCharges));
        assertEquals(0, new BigDecimal("30.00").compareTo(result.weekendSurcharge)); // 3 * 10 = 30
        assertEquals(0, new BigDecimal("90.00").compareTo(result.grossAmount)); // 40 + 20 + 30 = 90
    }
}
