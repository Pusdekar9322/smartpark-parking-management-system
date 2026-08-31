package com.smartpark.config;

import com.smartpark.entity.*;
import com.smartpark.enums.*;
import com.smartpark.repository.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final ParkingLocationRepository locationRepository;
    private final ParkingFloorRepository floorRepository;
    private final ParkingSlotRepository slotRepository;
    private final PricingRuleRepository pricingRuleRepository;
    private final CouponRepository couponRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            logger.info("Database already seeded with demo data.");
            return;
        }

        logger.info("Initializing SmartPark Indian Demo Data...");

        // 1. Seed Users
        User superAdmin = userRepository.save(User.builder()
                .fullName("Rajesh Deshmukh (Super Admin)")
                .email("superadmin@smartpark.in")
                .mobileNumber("+91 9988776655")
                .password(passwordEncoder.encode("Admin@123"))
                .role(Role.ROLE_SUPER_ADMIN)
                .active(true)
                .build());

        User parkingAdmin = userRepository.save(User.builder()
                .fullName("Anil Kulkarni (Pune Admin)")
                .email("admin.pune@smartpark.in")
                .mobileNumber("+91 9822012345")
                .password(passwordEncoder.encode("Admin@123"))
                .role(Role.ROLE_PARKING_ADMIN)
                .active(true)
                .build());

        User customer = userRepository.save(User.builder()
                .fullName("Rahul Sharma")
                .email("customer@smartpark.in")
                .mobileNumber("+91 9876543210")
                .password(passwordEncoder.encode("Customer@123"))
                .role(Role.ROLE_CUSTOMER)
                .active(true)
                .build());

        // 2. Seed Customer Vehicles
        vehicleRepository.save(Vehicle.builder()
                .vehicleNumber("MH 12 AB 1234")
                .vehicleType(VehicleType.CAR)
                .vehicleBrand("Tata")
                .vehicleModel("Nexon EV")
                .color("Teal Blue")
                .user(customer)
                .build());

        vehicleRepository.save(Vehicle.builder()
                .vehicleNumber("MH 12 CD 5678")
                .vehicleType(VehicleType.BIKE)
                .vehicleBrand("Royal Enfield")
                .vehicleModel("Classic 350")
                .color("Stealth Black")
                .user(customer)
                .build());

        vehicleRepository.save(Vehicle.builder()
                .vehicleNumber("MH 14 EF 9012")
                .vehicleType(VehicleType.SUV)
                .vehicleBrand("Mahindra")
                .vehicleModel("XUV700")
                .color("Midnight Black")
                .user(customer)
                .build());

        // 3. Seed Pricing Rules (₹ INR)
        pricingRuleRepository.save(PricingRule.builder()
                .vehicleType(VehicleType.BIKE)
                .baseHours(2)
                .basePrice(BigDecimal.valueOf(20.00))
                .extraHourPrice(BigDecimal.valueOf(10.00))
                .weekendSurcharge(BigDecimal.valueOf(5.00))
                .active(true)
                .build());

        pricingRuleRepository.save(PricingRule.builder()
                .vehicleType(VehicleType.CAR)
                .baseHours(2)
                .basePrice(BigDecimal.valueOf(40.00))
                .extraHourPrice(BigDecimal.valueOf(20.00))
                .weekendSurcharge(BigDecimal.valueOf(10.00))
                .active(true)
                .build());

        pricingRuleRepository.save(PricingRule.builder()
                .vehicleType(VehicleType.SUV)
                .baseHours(2)
                .basePrice(BigDecimal.valueOf(60.00))
                .extraHourPrice(BigDecimal.valueOf(30.00))
                .weekendSurcharge(BigDecimal.valueOf(15.00))
                .active(true)
                .build());

        pricingRuleRepository.save(PricingRule.builder()
                .vehicleType(VehicleType.EV)
                .baseHours(2)
                .basePrice(BigDecimal.valueOf(50.00))
                .extraHourPrice(BigDecimal.valueOf(25.00))
                .weekendSurcharge(BigDecimal.valueOf(10.00))
                .active(true)
                .build());

        // 4. Seed Coupons
        couponRepository.save(Coupon.builder()
                .code("SMART10")
                .description("Get 10% instant discount on parking")
                .discountType(DiscountType.PERCENTAGE)
                .discountValue(BigDecimal.valueOf(10))
                .minimumBookingAmount(BigDecimal.valueOf(40))
                .maximumDiscount(BigDecimal.valueOf(50))
                .startDate(LocalDate.now().minusDays(10))
                .endDate(LocalDate.now().plusMonths(6))
                .usageLimit(1000)
                .active(true)
                .build());

        couponRepository.save(Coupon.builder()
                .code("PUNE50")
                .description("Flat ₹50 OFF on bookings above ₹100")
                .discountType(DiscountType.FIXED)
                .discountValue(BigDecimal.valueOf(50))
                .minimumBookingAmount(BigDecimal.valueOf(100))
                .startDate(LocalDate.now().minusDays(10))
                .endDate(LocalDate.now().plusMonths(6))
                .usageLimit(500)
                .active(true)
                .build());

        couponRepository.save(Coupon.builder()
                .code("WELCOME20")
                .description("Welcome special: 20% discount on first reservation")
                .discountType(DiscountType.PERCENTAGE)
                .discountValue(BigDecimal.valueOf(20))
                .minimumBookingAmount(BigDecimal.valueOf(40))
                .maximumDiscount(BigDecimal.valueOf(80))
                .startDate(LocalDate.now().minusDays(10))
                .endDate(LocalDate.now().plusMonths(6))
                .usageLimit(2000)
                .active(true)
                .build());

        // 5. Seed Pune Parking Locations
        createLocationWithSlots(
                "Phoenix Marketcity Parking",
                "Premium multi-level covered smart parking with high security, CCTV and EV fast chargers.",
                "S No 207, Viman Nagar Road",
                "Viman Nagar",
                "Pune",
                "Maharashtra",
                "411014",
                18.5621,
                73.9168,
                LocalTime.of(8, 0),
                LocalTime.of(23, 30),
                "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80",
                parkingAdmin
        );

        createLocationWithSlots(
                "FC Road Smart Parking Facility",
                "Central shopping & dining parking near Deccan Gymkhana with quick QR entry.",
                "Opposite Fergusson College Main Gate, FC Road",
                "Shivajinagar",
                "Pune",
                "Maharashtra",
                "411005",
                18.5246,
                73.8413,
                LocalTime.of(7, 0),
                LocalTime.of(23, 0),
                "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80",
                parkingAdmin
        );

        createLocationWithSlots(
                "Koregaon Park Plaza Parking",
                "Dedicated automated parking garage in Koregaon Park culinary and arts hub.",
                "Lane 6, North Main Road, Koregaon Park",
                "Koregaon Park",
                "Pune",
                "Maharashtra",
                "411001",
                18.5362,
                73.8940,
                LocalTime.of(6, 0),
                LocalTime.of(23, 59),
                "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=800&q=80",
                parkingAdmin
        );

        createLocationWithSlots(
                "Hinjewadi Tech Park Smart Garage",
                "Spacious multi-floor IT park parking with corporate passes and high speed entry lanes.",
                "Phase 1, Rajiv Gandhi Infotech Park",
                "Hinjewadi",
                "Pune",
                "Maharashtra",
                "411057",
                18.5913,
                73.7389,
                LocalTime.of(6, 0),
                LocalTime.of(23, 59),
                "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
                parkingAdmin
        );

        logger.info("Demo data initialized successfully!");
    }

    private void createLocationWithSlots(String name, String desc, String address, String area,
                                        String city, String state, String pincode,
                                        double lat, double lng, LocalTime open, LocalTime close,
                                        String imageUrl, User admin) {
        ParkingLocation loc = locationRepository.save(ParkingLocation.builder()
                .name(name)
                .description(desc)
                .address(address)
                .area(area)
                .city(city)
                .state(state)
                .pincode(pincode)
                .latitude(lat)
                .longitude(lng)
                .openingTime(open)
                .closingTime(close)
                .status(LocationStatus.ACTIVE)
                .imageUrl(imageUrl)
                .admin(admin)
                .build());

        // Floor 0: Ground Floor
        ParkingFloor f0 = floorRepository.save(ParkingFloor.builder()
                .floorNumber(0)
                .floorName("Ground Floor")
                .parkingLocation(loc)
                .build());

        // Floor 1: First Floor
        ParkingFloor f1 = floorRepository.save(ParkingFloor.builder()
                .floorNumber(1)
                .floorName("First Floor")
                .parkingLocation(loc)
                .build());

        // Floor -1: Basement 1
        ParkingFloor fb = floorRepository.save(ParkingFloor.builder()
                .floorNumber(-1)
                .floorName("Basement 1")
                .parkingLocation(loc)
                .build());

        // Generate Slots for Ground Floor
        generateSlotsForFloor(f0, "G", 6, 8, 2, 2);
        // Generate Slots for First Floor
        generateSlotsForFloor(f1, "F1-", 4, 8, 2, 0);
        // Generate Slots for Basement
        generateSlotsForFloor(fb, "B1-", 4, 6, 2, 2);
    }

    private void generateSlotsForFloor(ParkingFloor floor, String prefix, int bikeCount, int carCount, int suvCount, int evCount) {
        List<ParkingSlot> slots = new ArrayList<>();
        int count = 1;

        // Bikes
        for (int i = 1; i <= bikeCount; i++) {
            slots.add(ParkingSlot.builder()
                    .slotNumber(prefix + "B" + String.format("%02d", count++))
                    .slotType(SlotType.BIKE)
                    .status(SlotStatus.AVAILABLE)
                    .floor(floor)
                    .build());
        }

        // Cars
        for (int i = 1; i <= carCount; i++) {
            slots.add(ParkingSlot.builder()
                    .slotNumber(prefix + "C" + String.format("%02d", count++))
                    .slotType(SlotType.CAR)
                    .status(SlotStatus.AVAILABLE)
                    .floor(floor)
                    .build());
        }

        // SUVs
        for (int i = 1; i <= suvCount; i++) {
            slots.add(ParkingSlot.builder()
                    .slotNumber(prefix + "S" + String.format("%02d", count++))
                    .slotType(SlotType.SUV)
                    .status(SlotStatus.AVAILABLE)
                    .floor(floor)
                    .build());
        }

        // EVs
        for (int i = 1; i <= evCount; i++) {
            slots.add(ParkingSlot.builder()
                    .slotNumber(prefix + "EV" + String.format("%02d", count++))
                    .slotType(SlotType.EV)
                    .status(SlotStatus.AVAILABLE)
                    .floor(floor)
                    .build());
        }

        slotRepository.saveAll(slots);
    }
}
