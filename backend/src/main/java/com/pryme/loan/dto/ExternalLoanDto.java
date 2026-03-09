package com.pryme.loan.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record ExternalLoanDto(
        UUID id,
        String bankName,
        String loanType,
        BigDecimal outstandingAmount,
        BigDecimal emiAmount
) {}