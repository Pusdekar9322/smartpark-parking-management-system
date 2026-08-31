package com.smartpark.service;

import com.smartpark.dto.request.CalculateFeeRequest;
import com.smartpark.dto.request.PricingRuleRequest;
import com.smartpark.dto.response.CalculateFeeResponse;
import com.smartpark.dto.response.PricingRuleResponse;
import com.smartpark.enums.VehicleType;

import java.util.List;

public interface PricingService {
    List<PricingRuleResponse> getAllPricingRules();
    PricingRuleResponse getPricingRuleByVehicleType(VehicleType vehicleType);
    PricingRuleResponse createOrUpdatePricingRule(PricingRuleRequest request);
    CalculateFeeResponse calculateFee(CalculateFeeRequest request);
}
