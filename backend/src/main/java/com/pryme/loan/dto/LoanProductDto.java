package com.pryme.loan.dto;

public record LoanProductDto(
        String type,
        String interestRate,
        String processingFee,
        String maxAmount,
        String tenure,
        String features
) {}