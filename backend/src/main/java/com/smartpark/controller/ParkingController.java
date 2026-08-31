package com.smartpark.controller;

import com.smartpark.dto.request.CalculateFeeRequest;
import com.smartpark.dto.response.*;
import com.smartpark.enums.VehicleType;
import com.smartpark.service.ParkingService;
import com.smartpark.service.PricingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/parking")
@RequiredArgsConstructor
@Tag(name = "Parking Locations & Search", description = "Public & Customer Parking Search and Slot Availability APIs")
public class ParkingController {

    private final ParkingService parkingService;
    private final PricingService pricingService;

    @GetMapping("/locations")
    @Operation(summary = "Search and list parking locations")
    public ResponseEntity<ApiResponse<List<ParkingLocationResponse>>> getLocations(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime,
            @RequestParam(required = false) VehicleType vehicleType) {

        List<ParkingLocationResponse> locations = (city != null || startTime != null)
                ? parkingService.searchLocations(city, startTime, endTime, vehicleType)
                : parkingService.getAllActiveLocations();

        return ResponseEntity.ok(ApiResponse.success(locations));
    }

    @GetMapping("/locations/{id}")
    @Operation(summary = "Get location details by ID")
    public ResponseEntity<ApiResponse<ParkingLocationResponse>> getLocationById(@PathVariable Long id) {
        ParkingLocationResponse location = parkingService.getLocationById(id);
        return ResponseEntity.ok(ApiResponse.success(location));
    }

    @GetMapping("/locations/{id}/availability")
    @Operation(summary = "Get visual floor & slot availability matrix for a location")
    public ResponseEntity<ApiResponse<SlotAvailabilityResponse>> getSlotAvailability(
            @PathVariable Long id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime,
            @RequestParam(required = false) VehicleType vehicleType) {

        SlotAvailabilityResponse response = parkingService.getSlotAvailability(id, startTime, endTime, vehicleType);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/pricing")
    @Operation(summary = "Get all active vehicle pricing rules")
    public ResponseEntity<ApiResponse<List<PricingRuleResponse>>> getPricingRules() {
        return ResponseEntity.ok(ApiResponse.success(pricingService.getAllPricingRules()));
    }

    @PostMapping("/calculate-fee")
    @Operation(summary = "Calculate estimated parking fee and taxes")
    public ResponseEntity<ApiResponse<CalculateFeeResponse>> calculateFee(@Valid @RequestBody CalculateFeeRequest request) {
        CalculateFeeResponse response = pricingService.calculateFee(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
