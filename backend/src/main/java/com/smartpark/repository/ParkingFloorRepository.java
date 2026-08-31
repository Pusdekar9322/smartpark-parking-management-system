package com.smartpark.repository;

import com.smartpark.entity.ParkingFloor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParkingFloorRepository extends JpaRepository<ParkingFloor, Long> {
    List<ParkingFloor> findByParkingLocationIdOrderByFloorNumberAsc(Long locationId);
}
