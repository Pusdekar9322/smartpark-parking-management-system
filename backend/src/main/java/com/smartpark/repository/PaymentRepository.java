package com.smartpark.repository;

import com.smartpark.entity.Payment;
import com.smartpark.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByTransactionId(String transactionId);
    Optional<Payment> findByGatewayOrderId(String gatewayOrderId);
    Optional<Payment> findByBookingId(Long bookingId);
    Page<Payment> findByPaymentStatus(PaymentStatus status, Pageable pageable);
}
