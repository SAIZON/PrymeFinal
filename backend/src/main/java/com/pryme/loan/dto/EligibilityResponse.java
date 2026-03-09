package com.pryme.loan.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EligibilityResponse {
    private boolean eligible;
    private double maxLoanAmount;
    private double maxEmiCapacity;
}