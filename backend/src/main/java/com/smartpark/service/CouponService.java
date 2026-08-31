package com.smartpark.service;

import com.smartpark.dto.request.ApplyCouponRequest;
import com.smartpark.dto.request.CouponRequest;
import com.smartpark.dto.response.ApplyCouponResponse;
import com.smartpark.dto.response.CouponResponse;

import java.util.List;

public interface CouponService {
    List<CouponResponse> getAllCoupons();
    List<CouponResponse> getActiveCoupons();
    CouponResponse getCouponById(Long id);
    CouponResponse createCoupon(CouponRequest request);
    CouponResponse updateCoupon(Long id, CouponRequest request);
    void deleteCoupon(Long id);
    ApplyCouponResponse applyCoupon(ApplyCouponRequest request);
}
