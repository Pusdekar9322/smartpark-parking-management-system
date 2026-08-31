package com.smartpark.service;

import com.smartpark.dto.request.ParkingPassRequest;
import com.smartpark.dto.response.ParkingPassResponse;

import java.util.List;

public interface PassService {
    ParkingPassResponse purchasePass(Long userId, ParkingPassRequest request);
    List<ParkingPassResponse> getUserPasses(Long userId);
    ParkingPassResponse getPassById(Long passId, Long userId);
    List<ParkingPassResponse> getAllPasses();
    void cancelPass(Long passId, Long userId);
}
