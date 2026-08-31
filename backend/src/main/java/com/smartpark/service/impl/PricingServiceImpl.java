package com.smartpark.service.impl;

import com.smartpark.dto.request.CalculateFeeRequest;
import com.smartpark.dto.request.PricingRuleRequest;
import com.smartpark.dto.response.CalculateFeeResponse;
import com.smartpark.dto.response.PricingRuleResponse;
import com.smartpark.entity.Coupon;
import com.smartpark.entity.PricingRule;
import com.smartpark.enums.DiscountType;
import com.smartpark.enums.VehicleType;
import com.smartpark.exception.BadRequestException;
import com.smartpark.exception.ResourceNotFoundException;
import com.smartpark.repository.CouponRepository;
import com.smartpark.repository.PricingRuleRepository;
import com.smartpark.service.PricingService;
import com.smartpark.util.FeeCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PricingServiceImpl implements PricingService {

    private final PricingRuleRepository pricingRuleRepository;
    private final CouponRepository couponRepository;
    private final FeeCalculator feeCalculator;

    @Value("${app.tax.gst-enabled:true}")
    private boolean gstEnabled;

    @Value("${app.tax.cgst-rate:9.0}")
    private double cgstRate;

    @Value("${app.tax.sgst-rate:9.0}")
    private double sgstRate;

    @Override
    @Transactional(readOnly = true)
    public List<PricingRuleResponse> getAllPricingRules() {
        return pricingRuleRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PricingRuleResponse getPricingRuleByVehicleType(VehicleType vehicleType) {
        PricingRule rule = pricingRuleRepository.findByVehicleTypeAndActiveTrue(vehicleType)
                .orElseThrow(() -> new ResourceNotFoundException("Active pricing rule not found for vehicle type: " + vehicleType));
        return mapToResponse(rule);
    }

    @Override
    @Transactional
    public PricingRuleResponse createOrUpdatePricingRule(PricingRuleRequest request) {
        PricingRule rule = pricingRuleRepository.findByVehicleType(request.getVehicleType())
                .orElse(PricingRule.builder().vehicleType(request.getVehicleType()).build());

        rule.setBaseHours(request.getBaseHours());
        rule.setBasePrice(request.getBasePrice());
        rule.setExtraHourPrice(request.getExtraHourPrice());
        rule.setWeekendSurcharge(request.getWeekendSurcharge() != null ? request.getWeekendSurcharge() : BigDecimal.ZERO);
        rule.setActive(request.getActive() != null ? request.getActive() : true);

        PricingRule saved = pricingRuleRepository.save(rule);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public CalculateFeeResponse calculateFee(CalculateFeeRequest request) {
        if (request.getEndTime().isBefore(request.getStartTime()) || request.getEndTime().isEqual(request.getStartTime())) {
            throw new BadRequestException("End time must be strictly after start time.");
        }

        PricingRule rule = pricingRuleRepository.findByVehicleTypeAndActiveTrue(request.getVehicleType())
                .orElseThrow(() -> new ResourceNotFoundException("Pricing rule not configured for vehicle type: " + request.getVehicleType()));

        FeeCalculator.FeeBreakdown breakdown = feeCalculator.calculateFee(rule, request.getStartTime(), request.getEndTime());

        BigDecimal gross = breakdown.grossAmount;
        BigDecimal discount = BigDecimal.ZERO;

        if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
            discount = computeCouponDiscount(request.getCouponCode().trim(), gross);
        }

        BigDecimal netBeforeTax = gross.subtract(discount).max(BigDecimal.ZERO);

        BigDecimal cgst = BigDecimal.ZERO;
        BigDecimal sgst = BigDecimal.ZERO;

        if (gstEnabled) {
            cgst = netBeforeTax.multiply(BigDecimal.valueOf(cgstRate / 100.0)).setScale(2, RoundingMode.HALF_UP);
            sgst = netBeforeTax.multiply(BigDecimal.valueOf(sgstRate / 100.0)).setScale(2, RoundingMode.HALF_UP);
        }

        BigDecimal total = netBeforeTax.add(cgst).add(sgst).setScale(2, RoundingMode.HALF_UP);

        return CalculateFeeResponse.builder()
                .durationHours(breakdown.durationHours)
                .billableHours(breakdown.billableHours)
                .basePrice(breakdown.basePrice)
                .extraHourCharges(breakdown.extraHourCharges)
                .weekendSurcharge(breakdown.weekendSurcharge)
                .grossAmount(gross)
                .discountAmount(discount)
                .cgstAmount(cgst)
                .sgstAmount(sgst)
                .totalAmount(total)
                .isWeekend(breakdown.isWeekend)
                .build();
    }

    private BigDecimal computeCouponDiscount(String couponCode, BigDecimal grossAmount) {
        return couponRepository.findByCodeIgnoreCaseAndActiveTrue(couponCode)
                .map(coupon -> {
                    LocalDate today = LocalDate.now();
                    if (today.isBefore(coupon.getStartDate()) || today.isAfter(coupon.getEndDate())) {
                        return BigDecimal.ZERO;
                    }
                    if (coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit()) {
                        return BigDecimal.ZERO;
                    }
                    if (coupon.getMinimumBookingAmount() != null && grossAmount.compareTo(coupon.getMinimumBookingAmount()) < 0) {
                        return BigDecimal.ZERO;
                    }

                    BigDecimal calculatedDiscount;
                    if (coupon.getDiscountType() == DiscountType.PERCENTAGE) {
                        calculatedDiscount = grossAmount.multiply(coupon.getDiscountValue().divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
                    } else {
                        calculatedDiscount = coupon.getDiscountValue();
                    }

                    if (coupon.getMaximumDiscount() != null && calculatedDiscount.compareTo(coupon.getMaximumDiscount()) > 0) {
                        calculatedDiscount = coupon.getMaximumDiscount();
                    }

                    return calculatedDiscount.setScale(2, RoundingMode.HALF_UP);
                })
                .orElse(BigDecimal.ZERO);
    }

    private PricingRuleResponse mapToResponse(PricingRule rule) {
        return PricingRuleResponse.builder()
                .id(rule.getId())
                .vehicleType(rule.getVehicleType())
                .baseHours(rule.getBaseHours())
                .basePrice(rule.getBasePrice())
                .extraHourPrice(rule.getExtraHourPrice())
                .weekendSurcharge(rule.getWeekendSurcharge())
                .active(rule.getActive())
                .build();
    }
}
