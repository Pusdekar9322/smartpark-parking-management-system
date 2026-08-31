package com.smartpark.service;

import com.smartpark.dto.request.PaymentVerifyRequest;
import com.smartpark.dto.request.RazorpayOrderRequest;
import com.smartpark.dto.response.PaymentResponse;
import com.smartpark.dto.response.RazorpayOrderResponse;

import java.util.List;

public interface PaymentService {
    RazorpayOrderResponse createRazorpayOrder(RazorpayOrderRequest request, Long userId);
    PaymentResponse verifyPayment(PaymentVerifyRequest request, Long userId);
    PaymentResponse getPaymentById(Long paymentId);
    PaymentResponse getPaymentByBookingId(Long bookingId);
    List<PaymentResponse> getAllPayments();
}
