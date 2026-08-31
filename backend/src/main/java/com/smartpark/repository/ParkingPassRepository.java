package com.smartpark.repository;

import com.smartpark.entity.ParkingPass;
import com.smartpark.enums.PassStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParkingPassRepository extends JpaRepository<ParkingPass, Long> {
    List<ParkingPass> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<ParkingPass> findByUserIdAndStatus(Long userId, PassStatus status);
}
