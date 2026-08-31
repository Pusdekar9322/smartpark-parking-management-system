package com.smartpark.controller;

import com.smartpark.dto.request.ApplyCouponRequest;
import com.smartpark.dto.response.ApiResponse;
import com.smartpark.dto.response.ApplyCouponResponse;
import com.smartpark.dto.response.CouponResponse;
import com.smartpark.service.CouponService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
@Tag(name = "Coupons", description = "Coupon validation and application APIs")
public class CouponController {

    private final CouponService couponService;

    @GetMapping("/active")
    @Operation(summary = "Get all active coupons")
    public ResponseEntity<ApiResponse<List<CouponResponse>>> getActiveCoupons() {
        return ResponseEntity.ok(ApiResponse.success(couponService.getActiveCoupons()));
    }

    @PostMapping("/apply")
    @Operation(summary = "Validate and apply discount coupon on booking amount")
    public ResponseEntity<ApiResponse<ApplyCouponResponse>> applyCoupon(@Valid @RequestBody ApplyCouponRequest request) {
        ApplyCouponResponse response = couponService.applyCoupon(request);
        return ResponseEntity.ok(ApiResponse.success(response.getMessage(), response));
    }
}
