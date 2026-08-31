package com.smartpark.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.smartpark.enums.SlotStatus;
import com.smartpark.enums.SlotType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "parking_slots", indexes = {
    @Index(name = "idx_slot_floor", columnList = "floor_id"),
    @Index(name = "idx_slot_status", columnList = "status"),
    @Index(name = "idx_slot_type", columnList = "slot_type")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParkingSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "slot_number", nullable = false, length = 30)
    private String slotNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "slot_type", nullable = false, length = 20)
    private SlotType slotType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private SlotStatus status = SlotStatus.AVAILABLE;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "floor_id", nullable = false)
    private ParkingFloor floor;

    @Version
    @Column(name = "version")
    private Long version;
}
