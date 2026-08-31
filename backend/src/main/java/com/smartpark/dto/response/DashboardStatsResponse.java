package com.smartpark.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsResponse {
    private Long totalSlots;
    private Long availableSlots;
    private Long occupiedSlots;
    private Long maintenanceSlots;
    private Long todayBookings;
    private Long activeBookings;
    private BigDecimal todayRevenue;
    private BigDecimal totalRevenue;
    private Long pendingPayments;
    private Long totalCustomers;
    private Long totalAdmins;
    private Long totalLocations;
    private Map<String, Long> vehicleTypeBreakdown;
    private Map<String, BigDecimal> revenueBreakdown;
}
