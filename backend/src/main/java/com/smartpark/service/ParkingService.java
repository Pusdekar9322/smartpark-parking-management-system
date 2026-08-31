package com.smartpark.service;

import com.smartpark.dto.request.ParkingFloorRequest;
import com.smartpark.dto.request.ParkingLocationRequest;
import com.smartpark.dto.request.ParkingSlotRequest;
import com.smartpark.dto.response.ParkingFloorResponse;
import com.smartpark.dto.response.ParkingLocationResponse;
import com.smartpark.dto.response.ParkingSlotResponse;
import com.smartpark.dto.response.SlotAvailabilityResponse;
import com.smartpark.enums.VehicleType;

import java.time.LocalDateTime;
import java.util.List;

public interface ParkingService {
    // Location Operations
    List<ParkingLocationResponse> getAllActiveLocations();
    List<ParkingLocationResponse> searchLocations(String city, LocalDateTime startTime, LocalDateTime endTime, VehicleType vehicleType);
    ParkingLocationResponse getLocationById(Long locationId);
    ParkingLocationResponse createLocation(ParkingLocationRequest request);
    ParkingLocationResponse updateLocation(Long locationId, ParkingLocationRequest request);
    void deleteLocation(Long locationId);

    // Floor Operations
    List<ParkingFloorResponse> getFloorsByLocation(Long locationId);
    ParkingFloorResponse createFloor(ParkingFloorRequest request);
    ParkingFloorResponse updateFloor(Long floorId, ParkingFloorRequest request);
    void deleteFloor(Long floorId);

    // Slot Operations
    List<ParkingSlotResponse> getSlotsByFloor(Long floorId);
    ParkingSlotResponse createSlot(ParkingSlotRequest request);
    ParkingSlotResponse updateSlot(Long slotId, ParkingSlotRequest request);
    void deleteSlot(Long slotId);
    ParkingSlotResponse toggleSlotMaintenance(Long slotId, boolean maintenance);

    // Visual Availability Matrix
    SlotAvailabilityResponse getSlotAvailability(Long locationId, LocalDateTime startTime, LocalDateTime endTime, VehicleType vehicleType);
}
