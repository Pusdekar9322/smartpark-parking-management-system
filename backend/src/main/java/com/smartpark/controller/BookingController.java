package com.smartpark.controller;

import com.smartpark.dto.request.BookingRequest;
import com.smartpark.dto.response.ApiResponse;
import com.smartpark.dto.response.BookingResponse;
import com.smartpark.security.UserPrincipal;
import com.smartpark.service.BookingService;
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
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Customer Booking creation, retrieval, and cancellation APIs")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @Operation(summary = "Create a new parking reservation")
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody BookingRequest request) {
        BookingResponse response = bookingService.createBooking(principal.getId(), request);
        return new ResponseEntity<>(ApiResponse.success("Booking created successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/my")
    @Operation(summary = "Get all bookings for the logged-in customer")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<BookingResponse> bookings = bookingService.getUserBookings(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get booking details by ID")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        BookingResponse booking = bookingService.getBookingById(id, principal != null ? principal.getId() : null);
        return ResponseEntity.ok(ApiResponse.success(booking));
    }

    @GetMapping("/number/{bookingNumber}")
    @Operation(summary = "Get booking details by Booking Number")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingByNumber(@PathVariable String bookingNumber) {
        BookingResponse booking = bookingService.getBookingByNumber(bookingNumber);
        return ResponseEntity.ok(ApiResponse.success(booking));
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel an eligible booking")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        BookingResponse cancelled = bookingService.cancelBooking(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", cancelled));
    }
}
