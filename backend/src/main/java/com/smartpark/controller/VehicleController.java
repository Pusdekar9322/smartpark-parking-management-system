package com.smartpark.controller;

import com.smartpark.dto.request.VehicleRequest;
import com.smartpark.dto.response.ApiResponse;
import com.smartpark.dto.response.VehicleResponse;
import com.smartpark.security.UserPrincipal;
import com.smartpark.service.VehicleService;
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
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
@Tag(name = "Vehicle Management", description = "Customer vehicle management APIs")
public class VehicleController {

    private final VehicleService vehicleService;

    @PostMapping
    @Operation(summary = "Add a new vehicle")
    public ResponseEntity<ApiResponse<VehicleResponse>> addVehicle(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody VehicleRequest request) {
        VehicleResponse response = vehicleService.addVehicle(principal.getId(), request);
        return new ResponseEntity<>(ApiResponse.success("Vehicle registered successfully", response), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "List all vehicles for current customer")
    public ResponseEntity<ApiResponse<List<VehicleResponse>>> getMyVehicles(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<VehicleResponse> vehicles = vehicleService.getUserVehicles(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(vehicles));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get vehicle details by ID")
    public ResponseEntity<ApiResponse<VehicleResponse>> getVehicleById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        VehicleResponse vehicle = vehicleService.getVehicleById(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(vehicle));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update vehicle details")
    public ResponseEntity<ApiResponse<VehicleResponse>> updateVehicle(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody VehicleRequest request) {
        VehicleResponse updated = vehicleService.updateVehicle(id, principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Vehicle updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete vehicle")
    public ResponseEntity<ApiResponse<Void>> deleteVehicle(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        vehicleService.deleteVehicle(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Vehicle deleted successfully", null));
    }
}
