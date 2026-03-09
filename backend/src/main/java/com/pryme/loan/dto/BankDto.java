package com.pryme.loan.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record BankDto(
        @NotBlank(message = "Bank name is required")
        String name,

        String logoUrl,

        @NotNull
        Boolean active,

        // Used when updating interest rate directly
        @DecimalMin(value = "0.0", message = "Interest rate cannot be negative")
        BigDecimal baseInterestRate
) {}