package com.smartpark.service.impl;

import com.smartpark.dto.request.BookingRequest;
import com.smartpark.dto.request.CalculateFeeRequest;
import com.smartpark.dto.request.CheckInRequest;
import com.smartpark.dto.request.CheckOutRequest;
import com.smartpark.dto.response.BookingResponse;
import com.smartpark.dto.response.CalculateFeeResponse;
import com.smartpark.entity.*;
import com.smartpark.enums.*;
import com.smartpark.exception.BadRequestException;
import com.smartpark.exception.ResourceNotFoundException;
import com.smartpark.exception.SlotNotAvailableException;
import com.smartpark.repository.*;
import com.smartpark.service.BookingService;
import com.smartpark.service.InvoiceService;
import com.smartpark.service.NotificationService;
import com.smartpark.service.PricingService;
import com.smartpark.util.FeeCalculator;
import com.smartpark.util.QrCodeGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final ParkingLocationRepository locationRepository;
    private final ParkingFloorRepository floorRepository;
    private final ParkingSlotRepository slotRepository;
    private final PricingRuleRepository pricingRuleRepository;
    private final CouponRepository couponRepository;
    private final PricingService pricingService;
    private final InvoiceService invoiceService;
    private final NotificationService notificationService;
    private final QrCodeGenerator qrCodeGenerator;

    @Value("${app.cancellation.min-minutes-before-start:30}")
    private int minCancellationMinutes;

    @Override
    @Transactional
    public BookingResponse createBooking(Long userId, BookingRequest request) {
        // 1. Validate User
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // 2. Validate Vehicle & Ownership
        Vehicle vehicle = vehicleRepository.findByIdAndUserId(request.getVehicleId(), userId)
                .orElseThrow(() -> new BadRequestException("Vehicle does not belong to you or does not exist."));

        // 3. Validate Location
        ParkingLocation location = locationRepository.findById(request.getParkingLocationId())
                .orElseThrow(() -> new ResourceNotFoundException("Parking location not found with id: " + request.getParkingLocationId()));

        if (location.getStatus() != LocationStatus.ACTIVE) {
            throw new BadRequestException("Parking location is currently not active for bookings.");
        }

        // 4. Validate Slot
        ParkingSlot slot = slotRepository.findById(request.getParkingSlotId())
                .orElseThrow(() -> new ResourceNotFoundException("Parking slot not found with id: " + request.getParkingSlotId()));

        if (slot.getStatus() == SlotStatus.MAINTENANCE) {
            throw new BadRequestException("Selected parking slot is currently under maintenance.");
        }

        // 5. Validate Slot belongs to location
        if (!slot.getFloor().getParkingLocation().getId().equals(location.getId())) {
            throw new BadRequestException("Selected slot does not belong to the selected parking facility.");
        }

        // 6. Validate Vehicle Type Compatibility with Slot
        if (!isCompatible(slot.getSlotType(), vehicle.getVehicleType())) {
            throw new BadRequestException("Vehicle type " + vehicle.getVehicleType() + " is incompatible with " + slot.getSlotType() + " slot.");
        }

        // 7. Validate Times
        LocalDateTime now = LocalDateTime.now();
        if (request.getStartTime().isBefore(now.minusMinutes(5))) {
            throw new BadRequestException("Booking start time cannot be in the past.");
        }
        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new BadRequestException("Booking end time must be after start time.");
        }

        // 8. Validate Location Operating Hours
        LocalTime startLt = request.getStartTime().toLocalTime();
        LocalTime endLt = request.getEndTime().toLocalTime();
        if (startLt.isBefore(location.getOpeningTime()) || endLt.isAfter(location.getClosingTime())) {
            throw new BadRequestException("Booking requested is outside facility operating hours ("
                    + location.getOpeningTime() + " - " + location.getClosingTime() + ").");
        }

        // 9. CRITICAL: Overlapping Active Bookings Check (Double Booking Prevention)
        List<BookingStatus> activeStatuses = List.of(BookingStatus.RESERVED, BookingStatus.CHECKED_IN, BookingStatus.PARKED);
        List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                slot.getId(), request.getStartTime(), request.getEndTime(), activeStatuses);

        if (!overlapping.isEmpty()) {
            throw new SlotNotAvailableException("Parking slot " + slot.getSlotNumber() + " is already reserved for the selected time window.");
        }

        // 10. Calculate Estimated Pricing & Discounts
        CalculateFeeRequest feeReq = CalculateFeeRequest.builder()
                .vehicleType(vehicle.getVehicleType())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .couponCode(request.getCouponCode())
                .build();

        CalculateFeeResponse feeResp = pricingService.calculateFee(feeReq);

        Coupon coupon = null;
        if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
            coupon = couponRepository.findByCodeIgnoreCaseAndActiveTrue(request.getCouponCode().trim()).orElse(null);
            if (coupon != null && coupon.getUsageLimit() != null && coupon.getUsedCount() < coupon.getUsageLimit()) {
                coupon.setUsedCount(coupon.getUsedCount() + 1);
                couponRepository.save(coupon);
            }
        }

        // 11. Generate Unique Booking Number (e.g. SP-PN-2026-000123)
        String cityCode = getCityCode(location.getCity());
        int year = LocalDateTime.now().getYear();
        String bookingNumber = "SP-" + cityCode + "-" + year + "-" + String.format("%06d", (int) (Math.random() * 900000) + 100000);
        String qrReference = bookingNumber;

        PaymentStatus initialPaymentStatus = PaymentStatus.PENDING;

        Booking booking = Booking.builder()
                .bookingNumber(bookingNumber)
                .user(user)
                .vehicle(vehicle)
                .parkingLocation(location)
                .parkingFloor(slot.getFloor())
                .parkingSlot(slot)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .estimatedAmount(feeResp.getTotalAmount())
                .finalAmount(feeResp.getTotalAmount())
                .discountAmount(feeResp.getDiscountAmount())
                .coupon(coupon)
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(initialPaymentStatus)
                .bookingStatus(BookingStatus.RESERVED)
                .qrCodeReference(qrReference)
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        // Send confirmation notification
        notificationService.sendNotification(
                user,
                "Booking Confirmed 🚗",
                "Your SmartPark booking " + savedBooking.getBookingNumber() + " at " + location.getName() + " (Slot: " + slot.getSlotNumber() + ") is confirmed.",
                NotificationType.BOOKING_CONFIRMED
        );

        return mapToResponse(savedBooking);
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (userId != null && !booking.getUser().getId().equals(userId)) {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null && user.getRole() == Role.ROLE_CUSTOMER) {
                throw new BadRequestException("You are not authorized to view this booking.");
            }
        }
        return mapToResponse(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getBookingByNumber(String bookingNumber) {
        Booking booking = bookingRepository.findByBookingNumber(bookingNumber.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with number: " + bookingNumber));
        return mapToResponse(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getUserBookings(Long userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingsByLocation(Long locationId) {
        return bookingRepository.findByParkingLocationIdOrderByCreatedAtDesc(locationId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .sorted((b1, b2) -> b2.getCreatedAt().compareTo(b1.getCreatedAt()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BookingResponse cancelBooking(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (!booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("You can only cancel your own bookings.");
        }

        if (booking.getBookingStatus() != BookingStatus.RESERVED) {
            throw new BadRequestException("Booking cannot be cancelled in its current state: " + booking.getBookingStatus());
        }

        LocalDateTime now = LocalDateTime.now();
        if (now.isAfter(booking.getStartTime().minusMinutes(minCancellationMinutes))) {
            throw new BadRequestException("Bookings can only be cancelled at least " + minCancellationMinutes + " minutes before the scheduled start time.");
        }

        booking.setBookingStatus(BookingStatus.CANCELLED);
        if (booking.getPaymentStatus() == PaymentStatus.SUCCESS) {
            booking.setPaymentStatus(PaymentStatus.REFUNDED);
        }

        Booking saved = bookingRepository.save(booking);

        notificationService.sendNotification(
                booking.getUser(),
                "Booking Cancelled",
                "Your booking " + booking.getBookingNumber() + " has been successfully cancelled.",
                NotificationType.BOOKING_CANCELLED
        );

        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public BookingResponse checkIn(CheckInRequest request, Long adminId) {
        String identifier = request.getBookingIdentifier().trim();
        Booking booking = bookingRepository.findByBookingNumber(identifier)
                .or(() -> bookingRepository.findByQrCodeReference(identifier))
                .orElseThrow(() -> new ResourceNotFoundException("No booking found for identifier: " + identifier));

        if (request.getLocationId() != null && !booking.getParkingLocation().getId().equals(request.getLocationId())) {
            throw new BadRequestException("This booking is registered for " + booking.getParkingLocation().getName() + ", not this facility.");
        }

        if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Cannot check in: This booking has been cancelled.");
        }
        if (booking.getBookingStatus() == BookingStatus.COMPLETED) {
            throw new BadRequestException("Cannot check in: This booking has already been completed.");
        }
        if (booking.getBookingStatus() == BookingStatus.PARKED || booking.getBookingStatus() == BookingStatus.CHECKED_IN) {
            throw new BadRequestException("Vehicle is already checked in / parked.");
        }

        booking.setBookingStatus(BookingStatus.PARKED);
        booking.setActualEntryTime(LocalDateTime.now());

        // Mark Slot OCCUPIED
        ParkingSlot slot = booking.getParkingSlot();
        slot.setStatus(SlotStatus.OCCUPIED);
        slotRepository.save(slot);

        Booking saved = bookingRepository.save(booking);

        notificationService.sendNotification(
                booking.getUser(),
                "Checked In Successfully",
                "Vehicle " + booking.getVehicle().getVehicleNumber() + " has entered " + booking.getParkingLocation().getName() + " (Slot: " + slot.getSlotNumber() + ").",
                NotificationType.PARKING_COMPLETED
        );

        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public BookingResponse checkOut(CheckOutRequest request, Long adminId) {
        String identifier = request.getBookingIdentifier().trim();
        Booking booking = bookingRepository.findByBookingNumber(identifier)
                .or(() -> bookingRepository.findByQrCodeReference(identifier))
                .orElseThrow(() -> new ResourceNotFoundException("No active booking found for identifier: " + identifier));

        if (booking.getBookingStatus() != BookingStatus.PARKED && booking.getBookingStatus() != BookingStatus.CHECKED_IN) {
            throw new BadRequestException("Cannot check out: Vehicle is not currently parked.");
        }

        LocalDateTime exitTime = LocalDateTime.now();
        booking.setActualExitTime(exitTime);

        // Recalculate Final Amount based on actual parked duration
        LocalDateTime entryTime = booking.getActualEntryTime() != null ? booking.getActualEntryTime() : booking.getStartTime();
        CalculateFeeRequest feeReq = CalculateFeeRequest.builder()
                .vehicleType(booking.getVehicle().getVehicleType())
                .startTime(entryTime)
                .endTime(exitTime)
                .couponCode(booking.getCoupon() != null ? booking.getCoupon().getCode() : null)
                .build();

        CalculateFeeResponse feeResp = pricingService.calculateFee(feeReq);
        booking.setFinalAmount(feeResp.getTotalAmount());
        booking.setDiscountAmount(feeResp.getDiscountAmount());

        // Handle Payment Collection at Exit for Pay-at-Parking or unpaid bookings
        if (booking.getPaymentStatus() != PaymentStatus.SUCCESS) {
            if (request.getPaymentMethod() != null) {
                booking.setPaymentMethod(request.getPaymentMethod());
            }
            booking.setPaymentStatus(PaymentStatus.SUCCESS);
        }

        booking.setBookingStatus(BookingStatus.COMPLETED);

        // Free Slot
        ParkingSlot slot = booking.getParkingSlot();
        slot.setStatus(SlotStatus.AVAILABLE);
        slotRepository.save(slot);

        Booking saved = bookingRepository.save(booking);

        // Auto-generate GST Invoice
        Invoice invoice = invoiceService.generateInvoice(saved);

        notificationService.sendNotification(
                booking.getUser(),
                "Trip Completed 🧾",
                "Your parking session at " + booking.getParkingLocation().getName() + " is complete. Invoice " + invoice.getInvoiceNumber() + " is generated.",
                NotificationType.INVOICE_GENERATED
        );

        return mapToResponse(saved);
    }

    private boolean isCompatible(SlotType slotType, VehicleType vehicleType) {
        if (slotType == SlotType.DISABLED) return false;
        return switch (vehicleType) {
            case BIKE -> slotType == SlotType.BIKE;
            case CAR -> slotType == SlotType.CAR;
            case SUV -> slotType == SlotType.SUV || slotType == SlotType.CAR;
            case EV -> slotType == SlotType.EV || slotType == SlotType.CAR;
        };
    }

    private String getCityCode(String city) {
        if (city == null || city.trim().isEmpty()) return "IN";
        String lower = city.toLowerCase();
        if (lower.contains("pune")) return "PN";
        if (lower.contains("mumbai")) return "MB";
        if (lower.contains("nagpur")) return "NG";
        if (lower.contains("nashik")) return "NS";
        if (lower.contains("bengaluru") || lower.contains("bangalore")) return "BLR";
        if (lower.contains("hyderabad")) return "HYD";
        if (lower.contains("delhi")) return "DL";
        if (lower.contains("chennai")) return "CH";
        return city.substring(0, Math.min(3, city.length())).toUpperCase();
    }

    private BookingResponse mapToResponse(Booking b) {
        String qrBase64 = null;
        try {
            qrBase64 = qrCodeGenerator.generateQrCodeBase64(b.getBookingNumber(), 250, 250);
        } catch (Exception ignored) {}

        return BookingResponse.builder()
                .id(b.getId())
                .bookingNumber(b.getBookingNumber())
                .userId(b.getUser().getId())
                .customerName(b.getUser().getFullName())
                .customerEmail(b.getUser().getEmail())
                .customerMobile(b.getUser().getMobileNumber())
                .vehicleId(b.getVehicle().getId())
                .vehicleNumber(b.getVehicle().getVehicleNumber())
                .vehicleType(b.getVehicle().getVehicleType())
                .parkingLocationId(b.getParkingLocation().getId())
                .locationName(b.getParkingLocation().getName())
                .locationAddress(b.getParkingLocation().getAddress())
                .locationArea(b.getParkingLocation().getArea())
                .locationCity(b.getParkingLocation().getCity())
                .parkingFloorId(b.getParkingFloor().getId())
                .floorName(b.getParkingFloor().getFloorName())
                .parkingSlotId(b.getParkingSlot().getId())
                .slotNumber(b.getParkingSlot().getSlotNumber())
                .startTime(b.getStartTime())
                .endTime(b.getEndTime())
                .actualEntryTime(b.getActualEntryTime())
                .actualExitTime(b.getActualExitTime())
                .estimatedAmount(b.getEstimatedAmount())
                .finalAmount(b.getFinalAmount())
                .discountAmount(b.getDiscountAmount())
                .couponCode(b.getCoupon() != null ? b.getCoupon().getCode() : null)
                .paymentMethod(b.getPaymentMethod())
                .paymentStatus(b.getPaymentStatus())
                .bookingStatus(b.getBookingStatus())
                .qrCodeReference(b.getQrCodeReference())
                .qrCodeBase64(qrBase64)
                .invoiceId(b.getInvoice() != null ? b.getInvoice().getId() : null)
                .invoiceNumber(b.getInvoice() != null ? b.getInvoice().getInvoiceNumber() : null)
                .createdAt(b.getCreatedAt())
                .build();
    }
}
