package com.smartpark.service;

import com.smartpark.dto.request.LoginRequest;
import com.smartpark.dto.request.RegisterRequest;
import com.smartpark.dto.response.JwtAuthResponse;

public interface AuthService {
    JwtAuthResponse register(RegisterRequest request);
    JwtAuthResponse login(LoginRequest request);
}
