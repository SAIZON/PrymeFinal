package com.pryme.loan.dto;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class EmiResponse {
    private double monthlyEmi;
    private double totalInterest;
    private double totalPayment;
}