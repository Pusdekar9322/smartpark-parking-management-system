package com.smartpark.service.impl;

import com.smartpark.dto.request.VehicleRequest;
import com.smartpark.dto.response.VehicleResponse;
import com.smartpark.entity.User;
import com.smartpark.entity.Vehicle;
import com.smartpark.exception.BadRequestException;
import com.smartpark.exception.ResourceNotFoundException;
import com.smartpark.repository.UserRepository;
import com.smartpark.repository.VehicleRepository;
import com.smartpark.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public VehicleResponse addVehicle(Long userId, VehicleRequest request) {
        String formattedVehicleNum = request.getVehicleNumber().toUpperCase().replaceAll("\\s+", " ").trim();

        if (vehicleRepository.existsByVehicleNumber(formattedVehicleNum)) {
            throw new BadRequestException("Vehicle with number " + formattedVehicleNum + " is already registered.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Vehicle vehicle = Vehicle.builder()
                .vehicleNumber(formattedVehicleNum)
                .vehicleType(request.getVehicleType())
                .vehicleBrand(request.getVehicleBrand())
                .vehicleModel(request.getVehicleModel())
                .color(request.getColor())
                .user(user)
                .build();

        Vehicle saved = vehicleRepository.save(vehicle);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleResponse> getUserVehicles(Long userId) {
        return vehicleRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public VehicleResponse getVehicleById(Long vehicleId, Long userId) {
        Vehicle vehicle = vehicleRepository.findByIdAndUserId(vehicleId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found or does not belong to you."));
        return mapToResponse(vehicle);
    }

    @Override
    @Transactional
    public VehicleResponse updateVehicle(Long vehicleId, Long userId, VehicleRequest request) {
        Vehicle vehicle = vehicleRepository.findByIdAndUserId(vehicleId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found or does not belong to you."));

        String formattedVehicleNum = request.getVehicleNumber().toUpperCase().replaceAll("\\s+", " ").trim();
        if (!vehicle.getVehicleNumber().equalsIgnoreCase(formattedVehicleNum) &&
                vehicleRepository.existsByVehicleNumber(formattedVehicleNum)) {
            throw new BadRequestException("Vehicle with number " + formattedVehicleNum + " is already registered.");
        }

        vehicle.setVehicleNumber(formattedVehicleNum);
        vehicle.setVehicleType(request.getVehicleType());
        vehicle.setVehicleBrand(request.getVehicleBrand());
        vehicle.setVehicleModel(request.getVehicleModel());
        vehicle.setColor(request.getColor());

        Vehicle updated = vehicleRepository.save(vehicle);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteVehicle(Long vehicleId, Long userId) {
        Vehicle vehicle = vehicleRepository.findByIdAndUserId(vehicleId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found or does not belong to you."));
        vehicleRepository.delete(vehicle);
    }

    private VehicleResponse mapToResponse(Vehicle v) {
        return VehicleResponse.builder()
                .id(v.getId())
                .vehicleNumber(v.getVehicleNumber())
                .vehicleType(v.getVehicleType())
                .vehicleBrand(v.getVehicleBrand())
                .vehicleModel(v.getVehicleModel())
                .color(v.getColor())
                .createdAt(v.getCreatedAt())
                .build();
    }
}
