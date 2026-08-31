package com.smartpark;

import com.smartpark.dto.request.ParkingPassRequest;
import com.smartpark.dto.response.ParkingPassResponse;
import com.smartpark.entity.ParkingPass;
import com.smartpark.entity.User;
import com.smartpark.entity.Vehicle;
import com.smartpark.enums.PassStatus;
import com.smartpark.enums.Role;
import com.smartpark.enums.VehicleType;
import com.smartpark.exception.BadRequestException;
import com.smartpark.repository.ParkingPassRepository;
import com.smartpark.repository.UserRepository;
import com.smartpark.repository.VehicleRepository;
import com.smartpark.service.NotificationService;
import com.smartpark.service.impl.PassServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PassServiceTest {

    @Mock private ParkingPassRepository passRepository;
    @Mock private UserRepository userRepository;
    @Mock private VehicleRepository vehicleRepository;
    @Mock private NotificationService notificationService;

    @InjectMocks
    private PassServiceImpl passService;

    private User user;
    private Vehicle vehicle;
    private ParkingPass pass;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .fullName("Rahul Sharma")
                .email("customer@smartpark.in")
                .role(Role.ROLE_CUSTOMER)
                .build();

        vehicle = Vehicle.builder()
                .id(1L)
                .vehicleNumber("MH 12 AB 1234")
                .vehicleType(VehicleType.CAR)
                .user(user)
                .build();

        pass = ParkingPass.builder()
                .id(10L)
                .user(user)
                .vehicle(vehicle)
                .planName("Four-Wheeler / Car Pass")
                .vehicleType(VehicleType.CAR)
                .price(BigDecimal.valueOf(2000))
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().plusMonths(1))
                .status(PassStatus.ACTIVE)
                .build();
    }

    @Test
    @DisplayName("Should successfully purchase a monthly pass with status ACTIVE")
    void testPurchasePassSuccess() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(vehicleRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(vehicle));
        when(passRepository.save(any(ParkingPass.class))).thenReturn(pass);

        ParkingPassRequest request = ParkingPassRequest.builder()
                .vehicleId(1L)
                .vehicleType(VehicleType.CAR)
                .planName("Four-Wheeler / Car Pass")
                .build();

        ParkingPassResponse response = passService.purchasePass(1L, request);

        assertNotNull(response);
        assertEquals(PassStatus.ACTIVE, response.getStatus());
        assertEquals("Four-Wheeler / Car Pass", response.getPlanName());
        verify(passRepository, times(1)).save(any(ParkingPass.class));
    }

    @Test
    @DisplayName("Should successfully cancel an active pass and update status to CANCELLED")
    void testCancelPassSuccess() {
        when(passRepository.findById(10L)).thenReturn(Optional.of(pass));

        passService.cancelPass(10L, 1L);

        assertEquals(PassStatus.CANCELLED, pass.getStatus());
        verify(passRepository, times(1)).save(pass);
        verify(notificationService, times(1)).sendNotification(eq(user), anyString(), anyString(), any());
    }

    @Test
    @DisplayName("Should reject cancellation if pass is already cancelled")
    void testCancelAlreadyCancelledPassThrowsException() {
        pass.setStatus(PassStatus.CANCELLED);
        when(passRepository.findById(10L)).thenReturn(Optional.of(pass));

        assertThrows(BadRequestException.class, () -> passService.cancelPass(10L, 1L));
        verify(passRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should reject cancellation by unauthorized user")
    void testCancelPassUnauthorizedThrowsException() {
        when(passRepository.findById(10L)).thenReturn(Optional.of(pass));

        assertThrows(BadRequestException.class, () -> passService.cancelPass(10L, 999L));
        verify(passRepository, never()).save(any());
    }
}
