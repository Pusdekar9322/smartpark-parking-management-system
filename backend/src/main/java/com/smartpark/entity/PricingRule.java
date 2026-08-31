package com.smartpark.entity;

import com.smartpark.enums.VehicleType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "pricing_rules", indexes = {
    @Index(name = "idx_pricing_vehicle_type", columnList = "vehicle_type")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PricingRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type", nullable = false, length = 20)
    private VehicleType vehicleType;

    @Column(name = "base_hours", nullable = false)
    @Builder.Default
    private Integer baseHours = 2;

    @Column(name = "base_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal basePrice;

    @Column(name = "extra_hour_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal extraHourPrice;

    @Column(name = "weekend_surcharge", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal weekendSurcharge = BigDecimal.ZERO;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;
}
