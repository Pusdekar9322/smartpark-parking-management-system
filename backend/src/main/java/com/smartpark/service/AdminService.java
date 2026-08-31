package com.smartpark.service;

import com.smartpark.dto.response.DashboardStatsResponse;

public interface AdminService {
    DashboardStatsResponse getDashboardStats(Long adminId);
}
