package com.pryme.loan.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RewardCalculationResponse {
    private String cardName;
    private double totalPoints;
    private double totalAnnualSavings; // The final currency value
}