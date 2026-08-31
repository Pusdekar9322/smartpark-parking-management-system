package com.smartpark.service;

import com.smartpark.dto.request.ChangePasswordRequest;
import com.smartpark.dto.request.UpdateProfileRequest;
import com.smartpark.dto.response.UserProfileResponse;

public interface UserService {
    UserProfileResponse getCurrentUserProfile(Long userId);
    UserProfileResponse updateProfile(Long userId, UpdateProfileRequest request);
    void changePassword(Long userId, ChangePasswordRequest request);
}
