package com.smartpark.service;

import com.smartpark.dto.request.RegisterRequest;
import com.smartpark.dto.response.DashboardStatsResponse;
import com.smartpark.dto.response.UserProfileResponse;

import java.util.List;

public interface SuperAdminService {
    DashboardStatsResponse getSuperAdminDashboardStats();
    List<UserProfileResponse> getAllUsers();
    List<UserProfileResponse> getAllParkingAdmins();
    UserProfileResponse createParkingAdmin(RegisterRequest request);
    UserProfileResponse toggleUserStatus(Long userId);
}
