package com.pryme.loan.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List; // <-- Add this

public record ApplicationDto(
        Long id,
        String loanType,
        String bankName,
        BigDecimal amount,
        String status,
        LocalDateTime createdAt,
        List<LoanDocumentDto> documents // <--- NEW: Tells React which files exist!
) {}