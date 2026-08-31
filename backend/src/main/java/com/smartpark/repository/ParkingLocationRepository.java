package com.smartpark.repository;

import com.smartpark.entity.ParkingLocation;
import com.smartpark.enums.LocationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParkingLocationRepository extends JpaRepository<ParkingLocation, Long> {
    List<ParkingLocation> findByStatus(LocationStatus status);
    List<ParkingLocation> findByCityIgnoreCaseAndStatus(String city, LocationStatus status);
    List<ParkingLocation> findByAdminId(Long adminId);
    long countByStatus(LocationStatus status);
}
