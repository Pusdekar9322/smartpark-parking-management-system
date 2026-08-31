package com.smartpark;

import com.smartpark.dto.request.BookingRequest;
import com.smartpark.entity.*;
import com.smartpark.enums.*;
import com.smartpark.exception.SlotNotAvailableException;
import com.smartpark.repository.*;
import com.smartpark.service.InvoiceService;
import com.smartpark.service.NotificationService;
import com.smartpark.service.PricingService;
import com.smartpark.service.impl.BookingServiceImpl;
import com.smartpark.util.QrCodeGenerator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingOverlapTest {

    @Mock private BookingRepository bookingRepository;
    @Mock private UserRepository userRepository;
    @Mock private VehicleRepository vehicleRepository;
    @Mock private ParkingLocationRepository locationRepository;
    @Mock private ParkingFloorRepository floorRepository;
    @Mock private ParkingSlotRepository slotRepository;
    @Mock private PricingRuleRepository pricingRuleRepository;
    @Mock private CouponRepository couponRepository;
    @Mock private PricingService pricingService;
    @Mock private InvoiceService invoiceService;
    @Mock private NotificationService notificationService;
    @Mock private QrCodeGenerator qrCodeGenerator;

    @InjectMocks
    private BookingServiceImpl bookingService;

    private User user;
    private Vehicle vehicle;
    private ParkingLocation location;
    private ParkingFloor floor;
    private ParkingSlot slot;

    @BeforeEach
    void setUp() {
        user = User.builder().id(1L).fullName("Rahul Sharma").email("customer@smartpark.in").mobileNumber("+91 9876543210").role(Role.ROLE_CUSTOMER).active(true).build();
        vehicle = Vehicle.builder().id(1L).vehicleNumber("MH 12 AB 1234").vehicleType(VehicleType.CAR).user(user).build();
        location = ParkingLocation.builder().id(1L).name("Phoenix Marketcity Parking").city("Pune").status(LocationStatus.ACTIVE).openingTime(LocalTime.of(6, 0)).closingTime(LocalTime.of(23, 59)).build();
        floor = ParkingFloor.builder().id(1L).floorNumber(0).floorName("Ground Floor").parkingLocation(location).build();
        slot = ParkingSlot.builder().id(1L).slotNumber("G-C01").slotType(SlotType.CAR).status(SlotStatus.AVAILABLE).floor(floor).build();
    }

    @Test
    @DisplayName("Scenario C: Double Booking Prevention - Rejects overlapping reservation attempt")
    void testOverlappingBookingRejected() {
        // Set daytime operating hours: Tomorrow 10:00 AM to 12:00 PM
        LocalDateTime start = LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.of(10, 0));
        LocalDateTime end = start.plusHours(2);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(vehicleRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(vehicle));
        when(locationRepository.findById(1L)).thenReturn(Optional.of(location));
        when(slotRepository.findById(1L)).thenReturn(Optional.of(slot));

        // Existing booking overlapping with the requested interval (09:30 AM to 11:00 AM)
        Booking existing = Booking.builder()
                .id(99L)
                .bookingNumber("SP-PN-2026-000099")
                .parkingSlot(slot)
                .startTime(start.minusMinutes(30))
                .endTime(start.plusHours(1))
                .bookingStatus(BookingStatus.RESERVED)
                .build();

        when(bookingRepository.findOverlappingBookings(eq(1L), any(), any(), any())).thenReturn(List.of(existing));

        BookingRequest request = BookingRequest.builder()
                .parkingLocationId(1L)
                .parkingSlotId(1L)
                .vehicleId(1L)
                .startTime(start)
                .endTime(end)
                .paymentMethod(PaymentMethod.ONLINE_UPI)
                .build();

        assertThrows(SlotNotAvailableException.class, () -> bookingService.createBooking(1L, request));
    }
}
