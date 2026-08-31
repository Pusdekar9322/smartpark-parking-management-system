package com.smartpark.service.impl;

import com.smartpark.dto.request.RegisterRequest;
import com.smartpark.dto.response.DashboardStatsResponse;
import com.smartpark.dto.response.UserProfileResponse;
import com.smartpark.entity.User;
import com.smartpark.enums.Role;
import com.smartpark.exception.BadRequestException;
import com.smartpark.exception.ResourceNotFoundException;
import com.smartpark.repository.UserRepository;
import com.smartpark.service.AdminService;
import com.smartpark.service.SuperAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SuperAdminServiceImpl implements SuperAdminService {

    private final UserRepository userRepository;
    private final AdminService adminService;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getSuperAdminDashboardStats() {
        return adminService.getDashboardStats(null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserProfileResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserProfileResponse> getAllParkingAdmins() {
        return userRepository.findByRole(Role.ROLE_PARKING_ADMIN).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserProfileResponse createParkingAdmin(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Password and confirm password do not match");
        }

        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("An account with this email already exists.");
        }

        User admin = User.builder()
                .fullName(request.getFullName().trim())
                .email(request.getEmail().toLowerCase().trim())
                .mobileNumber(request.getMobileNumber().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_PARKING_ADMIN)
                .active(true)
                .build();

        User saved = userRepository.save(admin);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public UserProfileResponse toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setActive(!Boolean.TRUE.equals(user.getActive()));
        User saved = userRepository.save(user);
        return mapToResponse(saved);
    }

    private UserProfileResponse mapToResponse(User u) {
        return UserProfileResponse.builder()
                .id(u.getId())
                .fullName(u.getFullName())
                .email(u.getEmail())
                .mobileNumber(u.getMobileNumber())
                .role(u.getRole())
                .active(u.getActive())
                .createdAt(u.getCreatedAt())
                .build();
    }
}
