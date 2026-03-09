package com.pryme.loan.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record LoanDocumentDto(
        UUID id,
        String name,
        String category, // e.g., KYC, INCOME
        String status,   // e.g., VERIFIED, PENDING
        LocalDateTime uploadedAt
) {}