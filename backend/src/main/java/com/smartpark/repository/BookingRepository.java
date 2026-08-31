package com.smartpark.repository;

import com.smartpark.entity.Booking;
import com.smartpark.enums.BookingStatus;
import com.smartpark.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByBookingNumber(String bookingNumber);
    Optional<Booking> findByQrCodeReference(String qrCodeReference);

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);
    Page<Booking> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    List<Booking> findByParkingLocationIdOrderByCreatedAtDesc(Long locationId);
    Page<Booking> findByParkingLocationIdOrderByCreatedAtDesc(Long locationId, Pageable pageable);

    @Query("SELECT b FROM Booking b WHERE b.parkingSlot.id = :slotId " +
           "AND b.bookingStatus IN :activeStatuses " +
           "AND (b.startTime < :endTime AND b.endTime > :startTime)")
    List<Booking> findOverlappingBookings(
            @Param("slotId") Long slotId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("activeStatuses") List<BookingStatus> activeStatuses
    );

    @Query("SELECT b FROM Booking b WHERE b.parkingLocation.id = :locationId " +
           "AND b.bookingStatus IN :activeStatuses " +
           "AND (b.startTime < :endTime AND b.endTime > :startTime)")
    List<Booking> findOverlappingBookingsForLocation(
            @Param("locationId") Long locationId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("activeStatuses") List<BookingStatus> activeStatuses
    );

    long countByBookingStatus(BookingStatus status);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.parkingLocation.id = :locationId AND b.bookingStatus = :status")
    long countByLocationIdAndStatus(@Param("locationId") Long locationId, @Param("status") BookingStatus status);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.createdAt >= :startDate AND b.createdAt <= :endDate")
    long countBookingsBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.parkingLocation.id = :locationId AND b.createdAt >= :startDate AND b.createdAt <= :endDate")
    long countBookingsBetweenForLocation(@Param("locationId") Long locationId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COALESCE(SUM(b.finalAmount), 0) FROM Booking b WHERE b.paymentStatus = :paymentStatus")
    BigDecimal sumTotalRevenueByPaymentStatus(@Param("paymentStatus") PaymentStatus paymentStatus);

    @Query("SELECT COALESCE(SUM(b.finalAmount), 0) FROM Booking b WHERE b.parkingLocation.id = :locationId AND b.paymentStatus = :paymentStatus")
    BigDecimal sumRevenueByLocationAndPaymentStatus(@Param("locationId") Long locationId, @Param("paymentStatus") PaymentStatus paymentStatus);

    @Query("SELECT COALESCE(SUM(b.finalAmount), 0) FROM Booking b WHERE b.parkingLocation.id = :locationId AND b.paymentStatus = :paymentStatus AND b.createdAt >= :startDate AND b.createdAt <= :endDate")
    BigDecimal sumRevenueByLocationAndPaymentStatusBetween(@Param("locationId") Long locationId, @Param("paymentStatus") PaymentStatus paymentStatus, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COALESCE(SUM(b.finalAmount), 0) FROM Booking b WHERE b.paymentStatus = :paymentStatus AND b.createdAt >= :startDate AND b.createdAt <= :endDate")
    BigDecimal sumTotalRevenueBetween(@Param("paymentStatus") PaymentStatus paymentStatus, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT b FROM Booking b WHERE b.bookingStatus = 'RESERVED' AND b.startTime < :threshold")
    List<Booking> findExpiredReservations(@Param("threshold") LocalDateTime threshold);
}
