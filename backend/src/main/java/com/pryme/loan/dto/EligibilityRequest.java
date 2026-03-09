package com.pryme.loan.dto;

import lombok.Data;

@Data
public class EligibilityRequest {
    private double monthlyIncome;
    private String occupation; // "salaried", "self-employed", "professional"
    private double existingEmis;
}