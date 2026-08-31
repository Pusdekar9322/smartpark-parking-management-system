package com.smartpark.service.impl;

import com.smartpark.dto.request.ApplyCouponRequest;
import com.smartpark.dto.request.CouponRequest;
import com.smartpark.dto.response.ApplyCouponResponse;
import com.smartpark.dto.response.CouponResponse;
import com.smartpark.entity.Coupon;
import com.smartpark.enums.DiscountType;
import com.smartpark.exception.BadRequestException;
import com.smartpark.exception.ResourceNotFoundException;
import com.smartpark.repository.CouponRepository;
import com.smartpark.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CouponResponse> getAllCoupons() {
        return couponRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CouponResponse> getActiveCoupons() {
        LocalDate today = LocalDate.now();
        return couponRepository.findAll().stream()
                .filter(c -> Boolean.TRUE.equals(c.getActive()) && !today.isBefore(c.getStartDate()) && !today.isAfter(c.getEndDate()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CouponResponse getCouponById(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + id));
        return mapToResponse(coupon);
    }

    @Override
    @Transactional
    public CouponResponse createCoupon(CouponRequest request) {
        String code = request.getCode().toUpperCase().trim();
        if (couponRepository.existsByCodeIgnoreCase(code)) {
            throw new BadRequestException("Coupon code " + code + " already exists.");
        }

        Coupon coupon = Coupon.builder()
                .code(code)
                .description(request.getDescription())
                .discountType(request.getDiscountType())
                .discountValue(request.getDiscountValue())
                .minimumBookingAmount(request.getMinimumBookingAmount() != null ? request.getMinimumBookingAmount() : BigDecimal.ZERO)
                .maximumDiscount(request.getMaximumDiscount())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .usageLimit(request.getUsageLimit())
                .usedCount(0)
                .active(request.getActive() != null ? request.getActive() : true)
                .build();

        Coupon saved = couponRepository.save(coupon);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public CouponResponse updateCoupon(Long id, CouponRequest request) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + id));

        String code = request.getCode().toUpperCase().trim();
        if (!coupon.getCode().equalsIgnoreCase(code) && couponRepository.existsByCodeIgnoreCase(code)) {
            throw new BadRequestException("Coupon code " + code + " already exists.");
        }

        coupon.setCode(code);
        coupon.setDescription(request.getDescription());
        coupon.setDiscountType(request.getDiscountType());
        coupon.setDiscountValue(request.getDiscountValue());
        coupon.setMinimumBookingAmount(request.getMinimumBookingAmount());
        coupon.setMaximumDiscount(request.getMaximumDiscount());
        coupon.setStartDate(request.getStartDate());
        coupon.setEndDate(request.getEndDate());
        coupon.setUsageLimit(request.getUsageLimit());
        if (request.getActive() != null) {
            coupon.setActive(request.getActive());
        }

        Coupon updated = couponRepository.save(coupon);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteCoupon(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + id));
        couponRepository.delete(coupon);
    }

    @Override
    @Transactional(readOnly = true)
    public ApplyCouponResponse applyCoupon(ApplyCouponRequest request) {
        Coupon coupon = couponRepository.findByCodeIgnoreCaseAndActiveTrue(request.getCouponCode().trim())
                .orElseThrow(() -> new BadRequestException("Invalid or inactive coupon code."));

        LocalDate today = LocalDate.now();
        if (today.isBefore(coupon.getStartDate())) {
            throw new BadRequestException("Coupon is not valid yet. Valid from " + coupon.getStartDate());
        }
        if (today.isAfter(coupon.getEndDate())) {
            throw new BadRequestException("Coupon has expired on " + coupon.getEndDate());
        }
        if (coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            throw new BadRequestException("Coupon usage limit has been reached.");
        }
        if (coupon.getMinimumBookingAmount() != null && request.getBookingAmount().compareTo(coupon.getMinimumBookingAmount()) < 0) {
            throw new BadRequestException("Minimum booking amount of ₹" + coupon.getMinimumBookingAmount() + " required to use this coupon.");
        }

        BigDecimal discount;
        if (coupon.getDiscountType() == DiscountType.PERCENTAGE) {
            discount = request.getBookingAmount().multiply(coupon.getDiscountValue().divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
        } else {
            discount = coupon.getDiscountValue();
        }

        if (coupon.getMaximumDiscount() != null && discount.compareTo(coupon.getMaximumDiscount()) > 0) {
            discount = coupon.getMaximumDiscount();
        }

        discount = discount.setScale(2, RoundingMode.HALF_UP);
        BigDecimal finalAmt = request.getBookingAmount().subtract(discount).max(BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP);

        return ApplyCouponResponse.builder()
                .couponCode(coupon.getCode())
                .originalAmount(request.getBookingAmount())
                .discountAmount(discount)
                .finalAmount(finalAmt)
                .message("Coupon " + coupon.getCode() + " applied successfully! Saved ₹" + discount)
                .build();
    }

    private CouponResponse mapToResponse(Coupon c) {
        return CouponResponse.builder()
                .id(c.getId())
                .code(c.getCode())
                .description(c.getDescription())
                .discountType(c.getDiscountType())
                .discountValue(c.getDiscountValue())
                .minimumBookingAmount(c.getMinimumBookingAmount())
                .maximumDiscount(c.getMaximumDiscount())
                .startDate(c.getStartDate())
                .endDate(c.getEndDate())
                .usageLimit(c.getUsageLimit())
                .usedCount(c.getUsedCount())
                .active(c.getActive())
                .build();
    }
}
