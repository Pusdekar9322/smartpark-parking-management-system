package com.smartpark.controller;

import com.smartpark.dto.request.ParkingPassRequest;
import com.smartpark.dto.response.ApiResponse;
import com.smartpark.dto.response.ParkingPassResponse;
import com.smartpark.security.UserPrincipal;
import com.smartpark.service.PassService;
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
@RequestMapping("/api/passes")
@RequiredArgsConstructor
@Tag(name = "Monthly Passes", description = "Monthly parking pass purchase and management APIs")
public class PassController {

    private final PassService passService;

    @PostMapping
    @Operation(summary = "Purchase a monthly parking pass")
    public ResponseEntity<ApiResponse<ParkingPassResponse>> purchasePass(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ParkingPassRequest request) {
        ParkingPassResponse response = passService.purchasePass(principal.getId(), request);
        return new ResponseEntity<>(ApiResponse.success("Monthly pass purchased successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/my")
    @Operation(summary = "List all monthly passes for the logged-in customer")
    public ResponseEntity<ApiResponse<List<ParkingPassResponse>>> getMyPasses(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<ParkingPassResponse> passes = passService.getUserPasses(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(passes));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get monthly pass details by ID")
    public ResponseEntity<ApiResponse<ParkingPassResponse>> getPassById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        ParkingPassResponse pass = passService.getPassById(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(pass));
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel a monthly pass")
    public ResponseEntity<ApiResponse<Void>> cancelPass(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        passService.cancelPass(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Pass cancelled successfully", null));
    }
}
