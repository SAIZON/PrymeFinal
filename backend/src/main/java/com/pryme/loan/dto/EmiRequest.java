package com.pryme.loan.dto;

import lombok.Data;

@Data
public class EmiRequest {
    private double principal;
    private double annualRate;
    private int tenureYears;
}