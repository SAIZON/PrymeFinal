package com.pryme.loan.dto;

import java.math.BigDecimal;

public record RecommendationRequest(
        String productType,      // e.g., "PERSONAL", "HOME", "BUSINESS"
        BigDecimal monthlyIncome,
        int cibilScore,
        BigDecimal requestedAmount
) {}