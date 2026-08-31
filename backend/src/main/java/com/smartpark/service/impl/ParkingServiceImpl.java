package com.smartpark.service.impl;

import com.smartpark.dto.request.ParkingFloorRequest;
import com.smartpark.dto.request.ParkingLocationRequest;
import com.smartpark.dto.request.ParkingSlotRequest;
import com.smartpark.dto.response.*;
import com.smartpark.entity.*;
import com.smartpark.enums.BookingStatus;
import com.smartpark.enums.LocationStatus;
import com.smartpark.enums.SlotStatus;
import com.smartpark.enums.SlotType;
import com.smartpark.enums.VehicleType;
import com.smartpark.exception.BadRequestException;
import com.smartpark.exception.ResourceNotFoundException;
import com.smartpark.repository.*;
import com.smartpark.service.ParkingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParkingServiceImpl implements ParkingService {

    private final ParkingLocationRepository locationRepository;
    private final ParkingFloorRepository floorRepository;
    private final ParkingSlotRepository slotRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final PricingRuleRepository pricingRuleRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ParkingLocationResponse> getAllActiveLocations() {
        return locationRepository.findByStatus(LocationStatus.ACTIVE).stream()
                .map(this::mapToLocationResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ParkingLocationResponse> searchLocations(String city, LocalDateTime startTime, LocalDateTime endTime, VehicleType vehicleType) {
        List<ParkingLocation> locations;
        if (city != null && !city.trim().isEmpty()) {
            locations = locationRepository.findByCityIgnoreCaseAndStatus(city.trim(), LocationStatus.ACTIVE);
        } else {
            locations = locationRepository.findByStatus(LocationStatus.ACTIVE);
        }

        return locations.stream()
                .map(loc -> {
                    ParkingLocationResponse response = mapToLocationResponse(loc);
                    if (startTime != null && endTime != null) {
                        SlotAvailabilityResponse availability = getSlotAvailability(loc.getId(), startTime, endTime, vehicleType);
                        response.setAvailableSlots(availability.getTotalAvailableForTime());
                    }
                    return response;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ParkingLocationResponse getLocationById(Long locationId) {
        ParkingLocation location = getLocation(locationId);
        return mapToLocationResponse(location);
    }

    @Override
    @Transactional
    public ParkingLocationResponse createLocation(ParkingLocationRequest request) {
        User admin = null;
        if (request.getAdminId() != null) {
            admin = userRepository.findById(request.getAdminId())
                    .orElseThrow(() -> new ResourceNotFoundException("Admin user not found with id: " + request.getAdminId()));
        }

        ParkingLocation location = ParkingLocation.builder()
                .name(request.getName().trim())
                .description(request.getDescription())
                .address(request.getAddress().trim())
                .area(request.getArea().trim())
                .city(request.getCity().trim())
                .state(request.getState().trim())
                .pincode(request.getPincode().trim())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .openingTime(request.getOpeningTime())
                .closingTime(request.getClosingTime())
                .status(request.getStatus() != null ? request.getStatus() : LocationStatus.ACTIVE)
                .imageUrl(request.getImageUrl())
                .admin(admin)
                .build();

        ParkingLocation saved = locationRepository.save(location);
        return mapToLocationResponse(saved);
    }

    @Override
    @Transactional
    public ParkingLocationResponse updateLocation(Long locationId, ParkingLocationRequest request) {
        ParkingLocation location = getLocation(locationId);

        location.setName(request.getName().trim());
        location.setDescription(request.getDescription());
        location.setAddress(request.getAddress().trim());
        location.setArea(request.getArea().trim());
        location.setCity(request.getCity().trim());
        location.setState(request.getState().trim());
        location.setPincode(request.getPincode().trim());
        location.setLatitude(request.getLatitude());
        location.setLongitude(request.getLongitude());
        location.setOpeningTime(request.getOpeningTime());
        location.setClosingTime(request.getClosingTime());
        if (request.getStatus() != null) {
            location.setStatus(request.getStatus());
        }
        location.setImageUrl(request.getImageUrl());

        if (request.getAdminId() != null) {
            User admin = userRepository.findById(request.getAdminId())
                    .orElseThrow(() -> new ResourceNotFoundException("Admin user not found with id: " + request.getAdminId()));
            location.setAdmin(admin);
        }

        ParkingLocation updated = locationRepository.save(location);
        return mapToLocationResponse(updated);
    }

    @Override
    @Transactional
    public void deleteLocation(Long locationId) {
        ParkingLocation location = getLocation(locationId);
        long activeBookings = bookingRepository.countByLocationIdAndStatus(locationId, BookingStatus.RESERVED)
                + bookingRepository.countByLocationIdAndStatus(locationId, BookingStatus.PARKED);
        if (activeBookings > 0) {
            throw new BadRequestException("Cannot delete parking location because it has active reservations or parked vehicles.");
        }
        locationRepository.delete(location);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ParkingFloorResponse> getFloorsByLocation(Long locationId) {
        return floorRepository.findByParkingLocationIdOrderByFloorNumberAsc(locationId).stream()
                .map(this::mapToFloorResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ParkingFloorResponse createFloor(ParkingFloorRequest request) {
        ParkingLocation location = getLocation(request.getLocationId());

        ParkingFloor floor = ParkingFloor.builder()
                .floorNumber(request.getFloorNumber())
                .floorName(request.getFloorName().trim())
                .parkingLocation(location)
                .build();

        ParkingFloor saved = floorRepository.save(floor);
        return mapToFloorResponse(saved);
    }

    @Override
    @Transactional
    public ParkingFloorResponse updateFloor(Long floorId, ParkingFloorRequest request) {
        ParkingFloor floor = floorRepository.findById(floorId)
                .orElseThrow(() -> new ResourceNotFoundException("Floor not found with id: " + floorId));

        floor.setFloorNumber(request.getFloorNumber());
        floor.setFloorName(request.getFloorName().trim());

        ParkingFloor updated = floorRepository.save(floor);
        return mapToFloorResponse(updated);
    }

    @Override
    @Transactional
    public void deleteFloor(Long floorId) {
        ParkingFloor floor = floorRepository.findById(floorId)
                .orElseThrow(() -> new ResourceNotFoundException("Floor not found with id: " + floorId));
        floorRepository.delete(floor);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ParkingSlotResponse> getSlotsByFloor(Long floorId) {
        return slotRepository.findByFloorId(floorId).stream()
                .map(this::mapToSlotResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ParkingSlotResponse createSlot(ParkingSlotRequest request) {
        ParkingFloor floor = floorRepository.findById(request.getFloorId())
                .orElseThrow(() -> new ResourceNotFoundException("Floor not found with id: " + request.getFloorId()));

        ParkingSlot slot = ParkingSlot.builder()
                .slotNumber(request.getSlotNumber().toUpperCase().trim())
                .slotType(request.getSlotType())
                .status(request.getStatus() != null ? request.getStatus() : SlotStatus.AVAILABLE)
                .floor(floor)
                .build();

        ParkingSlot saved = slotRepository.save(slot);
        return mapToSlotResponse(saved);
    }

    @Override
    @Transactional
    public ParkingSlotResponse updateSlot(Long slotId, ParkingSlotRequest request) {
        ParkingSlot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Slot not found with id: " + slotId));

        slot.setSlotNumber(request.getSlotNumber().toUpperCase().trim());
        slot.setSlotType(request.getSlotType());
        if (request.getStatus() != null) {
            slot.setStatus(request.getStatus());
        }

        ParkingSlot updated = slotRepository.save(slot);
        return mapToSlotResponse(updated);
    }

    @Override
    @Transactional
    public void deleteSlot(Long slotId) {
        ParkingSlot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Slot not found with id: " + slotId));
        slotRepository.delete(slot);
    }

    @Override
    @Transactional
    public ParkingSlotResponse toggleSlotMaintenance(Long slotId, boolean maintenance) {
        ParkingSlot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Slot not found with id: " + slotId));

        slot.setStatus(maintenance ? SlotStatus.MAINTENANCE : SlotStatus.AVAILABLE);
        ParkingSlot updated = slotRepository.save(slot);
        return mapToSlotResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public SlotAvailabilityResponse getSlotAvailability(Long locationId, LocalDateTime startTime, LocalDateTime endTime, VehicleType vehicleType) {
        ParkingLocation location = getLocation(locationId);

        List<ParkingFloor> floors = floorRepository.findByParkingLocationIdOrderByFloorNumberAsc(locationId);
        List<BookingStatus> activeBookingStatuses = List.of(BookingStatus.RESERVED, BookingStatus.CHECKED_IN, BookingStatus.PARKED);

        // Fetch all overlapping bookings for this entire location within the requested time interval
        List<Booking> overlappingBookings = (startTime != null && endTime != null)
                ? bookingRepository.findOverlappingBookingsForLocation(locationId, startTime, endTime, activeBookingStatuses)
                : Collections.emptyList();

        Set<Long> busySlotIds = overlappingBookings.stream()
                .map(b -> b.getParkingSlot().getId())
                .collect(Collectors.toSet());

        int totalCapacity = 0;
        int totalAvailableForTime = 0;
        List<FloorAvailabilityResponse> floorResponses = new ArrayList<>();

        for (ParkingFloor floor : floors) {
            List<ParkingSlot> slots = slotRepository.findByFloorId(floor.getId());
            List<ParkingSlotResponse> slotResponses = new ArrayList<>();
            int floorAvailable = 0;

            for (ParkingSlot slot : slots) {
                totalCapacity++;
                boolean isBusy = busySlotIds.contains(slot.getId());
                boolean isMaintenance = slot.getStatus() == SlotStatus.MAINTENANCE;
                boolean isAvailable = !isBusy && !isMaintenance;
                boolean isCompatible = isSlotCompatibleWithVehicle(slot.getSlotType(), vehicleType);

                if (isAvailable && isCompatible) {
                    floorAvailable++;
                    totalAvailableForTime++;
                }

                ParkingSlotResponse slotResp = ParkingSlotResponse.builder()
                        .id(slot.getId())
                        .slotNumber(slot.getSlotNumber())
                        .slotType(slot.getSlotType())
                        .status(isMaintenance ? SlotStatus.MAINTENANCE : (isBusy ? SlotStatus.OCCUPIED : SlotStatus.AVAILABLE))
                        .floorId(floor.getId())
                        .floorName(floor.getFloorName())
                        .floorNumber(floor.getFloorNumber())
                        .isCompatible(isCompatible)
                        .isAvailableForTime(isAvailable && isCompatible)
                        .build();

                slotResponses.add(slotResp);
            }

            FloorAvailabilityResponse floorResp = FloorAvailabilityResponse.builder()
                    .floorId(floor.getId())
                    .floorNumber(floor.getFloorNumber())
                    .floorName(floor.getFloorName())
                    .totalSlots(slots.size())
                    .availableSlots(floorAvailable)
                    .slots(slotResponses)
                    .build();

            floorResponses.add(floorResp);
        }

        return SlotAvailabilityResponse.builder()
                .locationId(location.getId())
                .locationName(location.getName())
                .locationAddress(location.getAddress() + ", " + location.getArea() + ", " + location.getCity())
                .status(location.getStatus())
                .requestedStartTime(startTime)
                .requestedEndTime(endTime)
                .totalCapacity(totalCapacity)
                .totalAvailableForTime(totalAvailableForTime)
                .floors(floorResponses)
                .build();
    }

    private boolean isSlotCompatibleWithVehicle(SlotType slotType, VehicleType vehicleType) {
        if (vehicleType == null || slotType == null) {
            return true;
        }
        if (slotType == SlotType.DISABLED) {
            return false; // Reserved exclusively for disabled permits unless configured
        }
        return switch (vehicleType) {
            case BIKE -> slotType == SlotType.BIKE;
            case CAR -> slotType == SlotType.CAR;
            case SUV -> slotType == SlotType.SUV || slotType == SlotType.CAR;
            case EV -> slotType == SlotType.EV || slotType == SlotType.CAR;
        };
    }

    private ParkingLocation getLocation(Long locationId) {
        return locationRepository.findById(locationId)
                .orElseThrow(() -> new ResourceNotFoundException("Parking location not found with id: " + locationId));
    }

    private ParkingLocationResponse mapToLocationResponse(ParkingLocation loc) {
        List<ParkingSlot> allSlots = slotRepository.findByLocationId(loc.getId());
        int totalSlots = allSlots.size();
        int availableSlots = (int) allSlots.stream().filter(s -> s.getStatus() == SlotStatus.AVAILABLE).count();

        // Get starting price for Car
        BigDecimal startPrice = pricingRuleRepository.findByVehicleTypeAndActiveTrue(VehicleType.CAR)
                .map(PricingRule::getBasePrice)
                .orElse(BigDecimal.valueOf(40));

        return ParkingLocationResponse.builder()
                .id(loc.getId())
                .name(loc.getName())
                .description(loc.getDescription())
                .address(loc.getAddress())
                .area(loc.getArea())
                .city(loc.getCity())
                .state(loc.getState())
                .pincode(loc.getPincode())
                .latitude(loc.getLatitude())
                .longitude(loc.getLongitude())
                .openingTime(loc.getOpeningTime())
                .closingTime(loc.getClosingTime())
                .status(loc.getStatus())
                .imageUrl(loc.getImageUrl())
                .totalFloors(loc.getFloors() != null ? loc.getFloors().size() : 0)
                .totalSlots(totalSlots)
                .availableSlots(availableSlots)
                .startingPrice(startPrice)
                .build();
    }

    private ParkingFloorResponse mapToFloorResponse(ParkingFloor floor) {
        List<ParkingSlotResponse> slotList = slotRepository.findByFloorId(floor.getId()).stream()
                .map(this::mapToSlotResponse)
                .collect(Collectors.toList());

        int available = (int) slotList.stream().filter(s -> s.getStatus() == SlotStatus.AVAILABLE).count();

        return ParkingFloorResponse.builder()
                .id(floor.getId())
                .floorNumber(floor.getFloorNumber())
                .floorName(floor.getFloorName())
                .locationId(floor.getParkingLocation().getId())
                .locationName(floor.getParkingLocation().getName())
                .totalSlots(slotList.size())
                .availableSlots(available)
                .slots(slotList)
                .build();
    }

    private ParkingSlotResponse mapToSlotResponse(ParkingSlot slot) {
        return ParkingSlotResponse.builder()
                .id(slot.getId())
                .slotNumber(slot.getSlotNumber())
                .slotType(slot.getSlotType())
                .status(slot.getStatus())
                .floorId(slot.getFloor().getId())
                .floorName(slot.getFloor().getFloorName())
                .floorNumber(slot.getFloor().getFloorNumber())
                .isCompatible(true)
                .isAvailableForTime(slot.getStatus() == SlotStatus.AVAILABLE)
                .build();
    }
}
