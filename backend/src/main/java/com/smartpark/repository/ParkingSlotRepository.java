package com.smartpark.repository;

import com.smartpark.entity.ParkingSlot;
import com.smartpark.enums.SlotStatus;
import com.smartpark.enums.SlotType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParkingSlotRepository extends JpaRepository<ParkingSlot, Long> {
    List<ParkingSlot> findByFloorId(Long floorId);
    List<ParkingSlot> findByFloorIdAndStatus(Long floorId, SlotStatus status);
    
    @Query("SELECT s FROM ParkingSlot s WHERE s.floor.parkingLocation.id = :locationId")
    List<ParkingSlot> findByLocationId(@Param("locationId") Long locationId);

    @Query("SELECT s FROM ParkingSlot s WHERE s.floor.parkingLocation.id = :locationId AND s.slotType = :slotType")
    List<ParkingSlot> findByLocationIdAndSlotType(@Param("locationId") Long locationId, @Param("slotType") SlotType slotType);

    long countByStatus(SlotStatus status);

    @Query("SELECT COUNT(s) FROM ParkingSlot s WHERE s.floor.parkingLocation.id = :locationId")
    long countByLocationId(@Param("locationId") Long locationId);

    @Query("SELECT COUNT(s) FROM ParkingSlot s WHERE s.floor.parkingLocation.id = :locationId AND s.status = :status")
    long countByLocationIdAndStatus(@Param("locationId") Long locationId, @Param("status") SlotStatus status);
}
