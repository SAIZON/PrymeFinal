package com.pryme.loan.dto;

import lombok.Data;

@Data
public class RewardCalculationRequest {
    private double annualDiningSpend;
    private double annualTravelSpend;
    private double annualOtherSpend;
}