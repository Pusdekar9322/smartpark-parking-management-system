package com.smartpark.service.impl;

import com.smartpark.dto.request.ParkingPassRequest;
import com.smartpark.dto.response.ParkingPassResponse;
import com.smartpark.entity.ParkingPass;
import com.smartpark.entity.User;
import com.smartpark.entity.Vehicle;
import com.smartpark.enums.NotificationType;
import com.smartpark.enums.PassStatus;
import com.smartpark.enums.VehicleType;
import com.smartpark.exception.BadRequestException;
import com.smartpark.exception.ResourceNotFoundException;
import com.smartpark.repository.ParkingPassRepository;
import com.smartpark.repository.UserRepository;
import com.smartpark.repository.VehicleRepository;
import com.smartpark.service.NotificationService;
import com.smartpark.service.PassService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PassServiceImpl implements PassService {

    private final ParkingPassRepository passRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public ParkingPassResponse purchasePass(Long userId, ParkingPassRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Vehicle vehicle = vehicleRepository.findByIdAndUserId(request.getVehicleId(), userId)
                .orElseThrow(() -> new BadRequestException("Vehicle does not belong to you or does not exist."));

        BigDecimal price = getPlanPrice(request.getVehicleType());
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusMonths(1);

        String paymentId = "PASS-PAY-" + System.currentTimeMillis();

        ParkingPass pass = ParkingPass.builder()
                .user(user)
                .vehicle(vehicle)
                .planName(request.getPlanName() != null ? request.getPlanName() : (vehicle.getVehicleType() + " Monthly Unlimited Pass"))
                .vehicleType(request.getVehicleType())
                .price(price)
                .startDate(startDate)
                .endDate(endDate)
                .status(PassStatus.ACTIVE)
                .paymentId(paymentId)
                .build();

        ParkingPass saved = passRepository.save(pass);

        notificationService.sendNotification(
                user,
                "Monthly Pass Activated 🎟️",
                "Your " + pass.getPlanName() + " for " + vehicle.getVehicleNumber() + " is active until " + endDate + ".",
                NotificationType.PASS_ACTIVATED
        );

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ParkingPassResponse> getUserPasses(Long userId) {
        return passRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ParkingPassResponse getPassById(Long passId, Long userId) {
        ParkingPass pass = passRepository.findById(passId)
                .orElseThrow(() -> new ResourceNotFoundException("Parking pass not found with id: " + passId));

        if (!pass.getUser().getId().equals(userId)) {
            throw new BadRequestException("You are not authorized to view this pass.");
        }
        return mapToResponse(pass);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ParkingPassResponse> getAllPasses() {
        return passRepository.findAll().stream()
                .sorted((p1, p2) -> p2.getCreatedAt().compareTo(p1.getCreatedAt()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void cancelPass(Long passId, Long userId) {
        ParkingPass pass = passRepository.findById(passId)
                .orElseThrow(() -> new ResourceNotFoundException("Parking pass not found with id: " + passId));

        if (!pass.getUser().getId().equals(userId)) {
            throw new BadRequestException("You are not authorized to cancel this pass.");
        }

        if (pass.getStatus() == PassStatus.CANCELLED) {
            throw new BadRequestException("This parking pass is already cancelled.");
        }

        pass.setStatus(PassStatus.CANCELLED);
        passRepository.save(pass);

        notificationService.sendNotification(
                pass.getUser(),
                "Monthly Pass Cancelled ❌",
                "Your " + pass.getPlanName() + " for " + pass.getVehicle().getVehicleNumber() + " has been cancelled.",
                NotificationType.PASS_CANCELLED
        );
    }

    private BigDecimal getPlanPrice(VehicleType type) {
        return switch (type) {
            case BIKE -> BigDecimal.valueOf(800);
            case CAR -> BigDecimal.valueOf(2000);
            case SUV -> BigDecimal.valueOf(2500);
            case EV -> BigDecimal.valueOf(1800);
        };
    }

    private ParkingPassResponse mapToResponse(ParkingPass p) {
        return ParkingPassResponse.builder()
                .id(p.getId())
                .userId(p.getUser().getId())
                .customerName(p.getUser().getFullName())
                .vehicleId(p.getVehicle().getId())
                .vehicleNumber(p.getVehicle().getVehicleNumber())
                .planName(p.getPlanName())
                .vehicleType(p.getVehicleType())
                .price(p.getPrice())
                .startDate(p.getStartDate())
                .endDate(p.getEndDate())
                .status(p.getStatus())
                .paymentId(p.getPaymentId())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
