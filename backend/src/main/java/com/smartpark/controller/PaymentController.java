package com.smartpark.controller;

import com.smartpark.dto.request.PaymentVerifyRequest;
import com.smartpark.dto.request.RazorpayOrderRequest;
import com.smartpark.dto.response.ApiResponse;
import com.smartpark.dto.response.PaymentResponse;
import com.smartpark.dto.response.RazorpayOrderResponse;
import com.smartpark.security.UserPrincipal;
import com.smartpark.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Razorpay Online Payment and Verification APIs")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    @Operation(summary = "Create a Razorpay sandbox order for booking")
    public ResponseEntity<ApiResponse<RazorpayOrderResponse>> createOrder(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody RazorpayOrderRequest request) {
        RazorpayOrderResponse response = paymentService.createRazorpayOrder(request, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/verify")
    @Operation(summary = "Verify Razorpay payment signature")
    public ResponseEntity<ApiResponse<PaymentResponse>> verifyPayment(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody PaymentVerifyRequest request) {
        PaymentResponse response = paymentService.verifyPayment(request, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Payment verified successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get payment receipt by ID")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentById(@PathVariable Long id) {
        PaymentResponse response = paymentService.getPaymentById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/booking/{bookingId}")
    @Operation(summary = "Get payment receipt by Booking ID")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentByBookingId(@PathVariable Long bookingId) {
        PaymentResponse response = paymentService.getPaymentByBookingId(bookingId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
