package com.smartpark.service;

import com.smartpark.dto.request.VehicleRequest;
import com.smartpark.dto.response.VehicleResponse;

import java.util.List;

public interface VehicleService {
    VehicleResponse addVehicle(Long userId, VehicleRequest request);
    List<VehicleResponse> getUserVehicles(Long userId);
    VehicleResponse getVehicleById(Long vehicleId, Long userId);
    VehicleResponse updateVehicle(Long vehicleId, Long userId, VehicleRequest request);
    void deleteVehicle(Long vehicleId, Long userId);
}
