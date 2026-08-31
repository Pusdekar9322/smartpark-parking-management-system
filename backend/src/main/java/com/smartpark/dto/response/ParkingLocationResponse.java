package com.smartpark.dto.response;

import com.smartpark.enums.LocationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParkingLocationResponse {
    private Long id;
    private String name;
    private String description;
    private String address;
    private String area;
    private String city;
    private String state;
    private String pincode;
    private Double latitude;
    private Double longitude;
    private LocalTime openingTime;
    private LocalTime closingTime;
    private LocationStatus status;
    private String imageUrl;
    private Integer totalFloors;
    private Integer totalSlots;
    private Integer availableSlots;
    private BigDecimal startingPrice;
}
