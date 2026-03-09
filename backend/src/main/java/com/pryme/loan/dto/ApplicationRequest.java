package com.pryme.loan.dto;

import java.math.BigDecimal;

public record ApplicationRequest(
        String loanType,
        BigDecimal amount,
        Integer tenureMonths,
        Long productId // Optional: ID of the selected bank product
) {}