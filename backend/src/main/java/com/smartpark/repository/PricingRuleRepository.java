package com.smartpark.repository;

import com.smartpark.entity.PricingRule;
import com.smartpark.enums.VehicleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PricingRuleRepository extends JpaRepository<PricingRule, Long> {
    Optional<PricingRule> findByVehicleTypeAndActiveTrue(VehicleType vehicleType);
    Optional<PricingRule> findByVehicleType(VehicleType vehicleType);
}
