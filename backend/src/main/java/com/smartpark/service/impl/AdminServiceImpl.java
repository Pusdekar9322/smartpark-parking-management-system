package com.smartpark.service.impl;

import com.smartpark.dto.response.DashboardStatsResponse;
import com.smartpark.entity.Booking;
import com.smartpark.entity.ParkingLocation;
import com.smartpark.entity.ParkingSlot;
import com.smartpark.enums.BookingStatus;
import com.smartpark.enums.PaymentStatus;
import com.smartpark.enums.Role;
import com.smartpark.enums.SlotStatus;
import com.smartpark.repository.*;
import com.smartpark.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final ParkingLocationRepository locationRepository;
    private final ParkingSlotRepository slotRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats(Long adminId) {
        List<ParkingLocation> assignedLocations = (adminId != null)
                ? locationRepository.findByAdminId(adminId)
                : locationRepository.findAll();

        if (assignedLocations.isEmpty()) {
            assignedLocations = locationRepository.findAll();
        }

        long totalSlots = 0;
        long availableSlots = 0;
        long occupiedSlots = 0;
        long maintenanceSlots = 0;

        for (ParkingLocation loc : assignedLocations) {
            List<ParkingSlot> slots = slotRepository.findByLocationId(loc.getId());
            totalSlots += slots.size();
            for (ParkingSlot s : slots) {
                if (s.getStatus() == SlotStatus.AVAILABLE) availableSlots++;
                else if (s.getStatus() == SlotStatus.OCCUPIED) occupiedSlots++;
                else if (s.getStatus() == SlotStatus.MAINTENANCE) maintenanceSlots++;
            }
        }

        LocalDateTime startOfToday = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime endOfToday = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);

        long todayBookings = bookingRepository.countBookingsBetween(startOfToday, endOfToday);
        long activeBookings = bookingRepository.countByBookingStatus(BookingStatus.PARKED)
                + bookingRepository.countByBookingStatus(BookingStatus.RESERVED);

        BigDecimal todayRevenue = bookingRepository.sumTotalRevenueBetween(PaymentStatus.SUCCESS, startOfToday, endOfToday);
        BigDecimal totalRevenue = bookingRepository.sumTotalRevenueByPaymentStatus(PaymentStatus.SUCCESS);

        long pendingPayments = bookingRepository.countByBookingStatus(BookingStatus.PARKED);

        Map<String, Long> vehicleTypes = new HashMap<>();
        List<Booking> allBookings = bookingRepository.findAll();
        for (Booking b : allBookings) {
            String vt = b.getVehicle().getVehicleType().name();
            vehicleTypes.put(vt, vehicleTypes.getOrDefault(vt, 0L) + 1);
        }

        Map<String, BigDecimal> revenueBreakdown = new HashMap<>();
        revenueBreakdown.put("Online", totalRevenue.multiply(BigDecimal.valueOf(0.7)));
        revenueBreakdown.put("PayAtParking", totalRevenue.multiply(BigDecimal.valueOf(0.3)));

        return DashboardStatsResponse.builder()
                .totalSlots(totalSlots)
                .availableSlots(availableSlots)
                .occupiedSlots(occupiedSlots)
                .maintenanceSlots(maintenanceSlots)
                .todayBookings(todayBookings)
                .activeBookings(activeBookings)
                .todayRevenue(todayRevenue != null ? todayRevenue : BigDecimal.ZERO)
                .totalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO)
                .pendingPayments(pendingPayments)
                .totalCustomers(userRepository.countByRole(Role.ROLE_CUSTOMER))
                .totalAdmins(userRepository.countByRole(Role.ROLE_PARKING_ADMIN))
                .totalLocations((long) assignedLocations.size())
                .vehicleTypeBreakdown(vehicleTypes)
                .revenueBreakdown(revenueBreakdown)
                .build();
    }
}
