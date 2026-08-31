package com.smartpark.service.impl;

import com.smartpark.dto.request.PaymentVerifyRequest;
import com.smartpark.dto.request.RazorpayOrderRequest;
import com.smartpark.dto.response.PaymentResponse;
import com.smartpark.dto.response.RazorpayOrderResponse;
import com.smartpark.entity.Booking;
import com.smartpark.entity.Payment;
import com.smartpark.enums.NotificationType;
import com.smartpark.enums.PaymentMethod;
import com.smartpark.enums.PaymentStatus;
import com.smartpark.exception.BadRequestException;
import com.smartpark.exception.PaymentException;
import com.smartpark.exception.ResourceNotFoundException;
import com.smartpark.repository.BookingRepository;
import com.smartpark.repository.PaymentRepository;
import com.smartpark.service.NotificationService;
import com.smartpark.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentServiceImpl.class);

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;

    @Value("${app.razorpay.key-id}")
    private String razorpayKeyId;

    @Value("${app.razorpay.key-secret}")
    private String razorpayKeySecret;

    @Override
    @Transactional
    public RazorpayOrderResponse createRazorpayOrder(RazorpayOrderRequest request, Long userId) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + request.getBookingId()));

        if (!booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("You can only initiate payment for your own bookings.");
        }

        BigDecimal amount = booking.getEstimatedAmount();
        long amountInPaise = amount.multiply(BigDecimal.valueOf(100)).longValue();

        // Generate Test Gateway Order ID
        String orderId = "order_" + booking.getId() + "_" + System.currentTimeMillis();

        logger.info("Created Razorpay Sandbox order {} for booking {}", orderId, booking.getBookingNumber());

        return RazorpayOrderResponse.builder()
                .orderId(orderId)
                .keyId(razorpayKeyId)
                .amount(amount)
                .amountInPaise(amountInPaise)
                .currency("INR")
                .bookingNumber(booking.getBookingNumber())
                .customerName(booking.getUser().getFullName())
                .customerEmail(booking.getUser().getEmail())
                .customerMobile(booking.getUser().getMobileNumber())
                .build();
    }

    @Override
    @Transactional
    public PaymentResponse verifyPayment(PaymentVerifyRequest request, Long userId) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + request.getBookingId()));

        if (!booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("You can only verify payment for your own bookings.");
        }

        // Verify Razorpay HMAC SHA256 Signature
        boolean isValidSignature = verifySignature(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature()
        );

        if (!isValidSignature) {
            logger.warn("Invalid payment signature detected for booking {}", booking.getBookingNumber());
            throw new PaymentException("Payment verification failed: Invalid payment signature.");
        }

        PaymentMethod method = request.getPaymentMethod() != null ? request.getPaymentMethod() : PaymentMethod.ONLINE_UPI;
        String transactionId = "TXN-RZP-" + System.currentTimeMillis();

        Payment payment = paymentRepository.findByBookingId(booking.getId()).orElse(
                Payment.builder()
                        .booking(booking)
                        .transactionId(transactionId)
                        .gatewayOrderId(request.getRazorpayOrderId())
                        .gatewayPaymentId(request.getRazorpayPaymentId())
                        .gatewaySignature(request.getRazorpaySignature())
                        .amount(booking.getEstimatedAmount())
                        .paymentMethod(method)
                        .paymentStatus(PaymentStatus.SUCCESS)
                        .paymentDate(LocalDateTime.now())
                        .build()
        );

        payment.setPaymentStatus(PaymentStatus.SUCCESS);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setGatewayPaymentId(request.getRazorpayPaymentId());
        Payment savedPayment = paymentRepository.save(payment);

        booking.setPaymentStatus(PaymentStatus.SUCCESS);
        booking.setPaymentMethod(method);
        bookingRepository.save(booking);

        notificationService.sendNotification(
                booking.getUser(),
                "Payment Successful 💳",
                "Payment of ₹" + payment.getAmount() + " for booking " + booking.getBookingNumber() + " was successful via " + method.name(),
                NotificationType.PAYMENT_SUCCESS
        );

        logger.info("Payment SUCCESS for booking {} with transaction {}", booking.getBookingNumber(), transactionId);

        return mapToResponse(savedPayment);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + paymentId));
        return mapToResponse(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByBookingId(Long bookingId) {
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for booking id: " + bookingId));
        return mapToResponse(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll().stream()
                .sorted((p1, p2) -> p2.getCreatedAt().compareTo(p1.getCreatedAt()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private boolean verifySignature(String orderId, String paymentId, String signature) {
        if (signature == null || signature.trim().isEmpty()) {
            return false;
        }

        // Allow test sandbox simulation signature
        if (signature.startsWith("test_sig_") || signature.equals("SANDBOX_SUCCESS_SIGNATURE")) {
            return true;
        }

        try {
            String data = orderId + "|" + paymentId;
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(razorpayKeySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256_HMAC.init(secret_key);
            byte[] hash = sha256_HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));
            String generatedSignature = HexFormat.of().formatHex(hash);

            return MessageDigest.isEqual(generatedSignature.getBytes(), signature.getBytes());
        } catch (Exception e) {
            logger.error("Signature verification error", e);
            return false;
        }
    }

    private PaymentResponse mapToResponse(Payment p) {
        return PaymentResponse.builder()
                .id(p.getId())
                .bookingId(p.getBooking().getId())
                .bookingNumber(p.getBooking().getBookingNumber())
                .customerName(p.getBooking().getUser().getFullName())
                .transactionId(p.getTransactionId())
                .gatewayOrderId(p.getGatewayOrderId())
                .gatewayPaymentId(p.getGatewayPaymentId())
                .amount(p.getAmount())
                .paymentMethod(p.getPaymentMethod())
                .paymentStatus(p.getPaymentStatus())
                .paymentDate(p.getPaymentDate())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
