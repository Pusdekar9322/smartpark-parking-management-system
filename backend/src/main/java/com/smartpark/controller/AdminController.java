package com.smartpark.controller;

import com.smartpark.dto.request.*;
import com.smartpark.dto.response.*;
import com.smartpark.security.UserPrincipal;
import com.smartpark.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Parking Admin", description = "Facility Admin management, live terminal, check-in/out and revenue APIs")
public class AdminController {

    private final AdminService adminService;
    private final ParkingService parkingService;
    private final BookingService bookingService;
    private final PricingService pricingService;
    private final CouponService couponService;
    private final PaymentService paymentService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get parking facility statistics and live occupancy")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats(
            @AuthenticationPrincipal UserPrincipal principal) {
        DashboardStatsResponse stats = adminService.getDashboardStats(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    // Locations
    @PostMapping("/locations")
    public ResponseEntity<ApiResponse<ParkingLocationResponse>> createLocation(@Valid @RequestBody ParkingLocationRequest request) {
        return new ResponseEntity<>(ApiResponse.success("Location created", parkingService.createLocation(request)), HttpStatus.CREATED);
    }

    @PutMapping("/locations/{id}")
    public ResponseEntity<ApiResponse<ParkingLocationResponse>> updateLocation(@PathVariable Long id, @Valid @RequestBody ParkingLocationRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Location updated", parkingService.updateLocation(id, request)));
    }

    @DeleteMapping("/locations/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLocation(@PathVariable Long id) {
        parkingService.deleteLocation(id);
        return ResponseEntity.ok(ApiResponse.success("Location deleted", null));
    }

    // Floors
    @PostMapping("/floors")
    public ResponseEntity<ApiResponse<ParkingFloorResponse>> createFloor(@Valid @RequestBody ParkingFloorRequest request) {
        return new ResponseEntity<>(ApiResponse.success("Floor created", parkingService.createFloor(request)), HttpStatus.CREATED);
    }

    @PutMapping("/floors/{id}")
    public ResponseEntity<ApiResponse<ParkingFloorResponse>> updateFloor(@PathVariable Long id, @Valid @RequestBody ParkingFloorRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Floor updated", parkingService.updateFloor(id, request)));
    }

    @DeleteMapping("/floors/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFloor(@PathVariable Long id) {
        parkingService.deleteFloor(id);
        return ResponseEntity.ok(ApiResponse.success("Floor deleted", null));
    }

    // Slots
    @PostMapping("/slots")
    public ResponseEntity<ApiResponse<ParkingSlotResponse>> createSlot(@Valid @RequestBody ParkingSlotRequest request) {
        return new ResponseEntity<>(ApiResponse.success("Slot created", parkingService.createSlot(request)), HttpStatus.CREATED);
    }

    @PutMapping("/slots/{id}")
    public ResponseEntity<ApiResponse<ParkingSlotResponse>> updateSlot(@PathVariable Long id, @Valid @RequestBody ParkingSlotRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Slot updated", parkingService.updateSlot(id, request)));
    }

    @PutMapping("/slots/{id}/maintenance")
    public ResponseEntity<ApiResponse<ParkingSlotResponse>> toggleSlotMaintenance(
            @PathVariable Long id,
            @RequestParam boolean maintenance) {
        return ResponseEntity.ok(ApiResponse.success("Slot status updated", parkingService.toggleSlotMaintenance(id, maintenance)));
    }

    @DeleteMapping("/slots/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSlot(@PathVariable Long id) {
        parkingService.deleteSlot(id);
        return ResponseEntity.ok(ApiResponse.success("Slot deleted", null));
    }

    // Pricing
    @PostMapping("/pricing")
    public ResponseEntity<ApiResponse<PricingRuleResponse>> createOrUpdatePricing(@Valid @RequestBody PricingRuleRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Pricing updated", pricingService.createOrUpdatePricingRule(request)));
    }

    @GetMapping("/pricing")
    public ResponseEntity<ApiResponse<List<PricingRuleResponse>>> getAllPricing() {
        return ResponseEntity.ok(ApiResponse.success(pricingService.getAllPricingRules()));
    }

    // Coupons
    @PostMapping("/coupons")
    public ResponseEntity<ApiResponse<CouponResponse>> createCoupon(@Valid @RequestBody CouponRequest request) {
        return new ResponseEntity<>(ApiResponse.success("Coupon created", couponService.createCoupon(request)), HttpStatus.CREATED);
    }

    @GetMapping("/coupons")
    public ResponseEntity<ApiResponse<List<CouponResponse>>> getAllCoupons() {
        return ResponseEntity.ok(ApiResponse.success(couponService.getAllCoupons()));
    }

    @PutMapping("/coupons/{id}")
    public ResponseEntity<ApiResponse<CouponResponse>> updateCoupon(@PathVariable Long id, @Valid @RequestBody CouponRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Coupon updated", couponService.updateCoupon(id, request)));
    }

    @DeleteMapping("/coupons/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.ok(ApiResponse.success("Coupon deleted", null));
    }

    // Bookings & Terminal Operations
    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings(
            @RequestParam(required = false) Long locationId) {
        List<BookingResponse> list = (locationId != null)
                ? bookingService.getBookingsByLocation(locationId)
                : bookingService.getAllBookings();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping("/check-in")
    @Operation(summary = "Process vehicle check-in by QR code or Booking Number")
    public ResponseEntity<ApiResponse<BookingResponse>> checkIn(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CheckInRequest request) {
        BookingResponse response = bookingService.checkIn(request, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Vehicle checked in successfully", response));
    }

    @PostMapping("/check-out")
    @Operation(summary = "Process vehicle check-out, fee recalculation and cash/UPI collection")
    public ResponseEntity<ApiResponse<BookingResponse>> checkOut(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CheckOutRequest request) {
        BookingResponse response = bookingService.checkOut(request, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Vehicle checked out successfully", response));
    }

    @GetMapping("/payments")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getAllPayments() {
        return ResponseEntity.ok(ApiResponse.success(paymentService.getAllPayments()));
    }
}
