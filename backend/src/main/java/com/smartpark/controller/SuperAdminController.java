package com.smartpark.controller;

import com.smartpark.dto.request.RegisterRequest;
import com.smartpark.dto.response.*;
import com.smartpark.service.BookingService;
import com.smartpark.service.ParkingService;
import com.smartpark.service.PaymentService;
import com.smartpark.service.SuperAdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/super-admin")
@RequiredArgsConstructor
@Tag(name = "Super Admin", description = "System-wide analytics, admin creation, and user management APIs")
public class SuperAdminController {

    private final SuperAdminService superAdminService;
    private final ParkingService parkingService;
    private final BookingService bookingService;
    private final PaymentService paymentService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get system-wide metrics and revenue analytics")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getSystemDashboard() {
        return ResponseEntity.ok(ApiResponse.success(superAdminService.getSuperAdminDashboardStats()));
    }

    @GetMapping("/users")
    @Operation(summary = "Get all users in the system")
    public ResponseEntity<ApiResponse<List<UserProfileResponse>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(superAdminService.getAllUsers()));
    }

    @PutMapping("/users/{id}/status")
    @Operation(summary = "Activate or deactivate a user account")
    public ResponseEntity<ApiResponse<UserProfileResponse>> toggleUserStatus(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("User status updated", superAdminService.toggleUserStatus(id)));
    }

    @GetMapping("/admins")
    @Operation(summary = "Get all Parking Admins")
    public ResponseEntity<ApiResponse<List<UserProfileResponse>>> getAllParkingAdmins() {
        return ResponseEntity.ok(ApiResponse.success(superAdminService.getAllParkingAdmins()));
    }

    @PostMapping("/admins")
    @Operation(summary = "Create a new Parking Admin account")
    public ResponseEntity<ApiResponse<UserProfileResponse>> createParkingAdmin(@Valid @RequestBody RegisterRequest request) {
        return new ResponseEntity<>(ApiResponse.success("Parking Admin created", superAdminService.createParkingAdmin(request)), HttpStatus.CREATED);
    }

    @GetMapping("/locations")
    public ResponseEntity<ApiResponse<List<ParkingLocationResponse>>> getAllLocations() {
        return ResponseEntity.ok(ApiResponse.success(parkingService.getAllActiveLocations()));
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings() {
        return ResponseEntity.ok(ApiResponse.success(bookingService.getAllBookings()));
    }

    @GetMapping("/payments")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getAllPayments() {
        return ResponseEntity.ok(ApiResponse.success(paymentService.getAllPayments()));
    }
}
