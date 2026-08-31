package com.smartpark.entity;

import com.smartpark.enums.LocationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "parking_locations", indexes = {
    @Index(name = "idx_location_city", columnList = "city"),
    @Index(name = "idx_location_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParkingLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 255)
    private String address;

    @Column(nullable = false, length = 100)
    private String area;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(nullable = false, length = 10)
    private String pincode;

    @Column
    private Double latitude;

    @Column
    private Double longitude;

    @Column(name = "opening_time", nullable = false)
    private LocalTime openingTime;

    @Column(name = "closing_time", nullable = false)
    private LocalTime closingTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private LocationStatus status = LocationStatus.ACTIVE;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    private User admin;

    @OneToMany(mappedBy = "parkingLocation", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ParkingFloor> floors = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = LocationStatus.ACTIVE;
        }
        if (this.openingTime == null) {
            this.openingTime = LocalTime.of(6, 0);
        }
        if (this.closingTime == null) {
            this.closingTime = LocalTime.of(23, 59);
        }
    }
}
