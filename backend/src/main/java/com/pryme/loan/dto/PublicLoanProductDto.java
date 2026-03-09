package com.pryme.loan.dto;

import java.math.BigDecimal;
import java.util.List;

public record PublicLoanProductDto(
        Long id,
        String bankName,
        String bankLogoUrl,
        String loanType,       // e.g. "Personal Loan", "Home Loan"
        String interestRate,   // e.g. "10.5%"
        String processingFee,  // e.g. "1%"
        String maxLoanAmount,  // e.g. "50 Lakhs"
        String tenure,         // e.g. "5 Years"
        List<String> features
) {}