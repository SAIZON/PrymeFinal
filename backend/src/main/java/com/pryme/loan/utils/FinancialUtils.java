package com.pryme.loan.utils;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;

public class FinancialUtils {

    // Standard settings for Indian Financial domain
    public static final int PRECISION = 10;
    public static final int DISPLAY_SCALE = 0; // EMI usually rounded to nearest integer
    public static final RoundingMode ROUNDING = RoundingMode.HALF_UP;
    public static final MathContext MC = new MathContext(PRECISION, ROUNDING);

    public static final BigDecimal HUNDRED = new BigDecimal("100");
    public static final BigDecimal TWELVE = new BigDecimal("12");

    /**
     * Calculates the monthly interest rate from an annual percentage.
     * @param annualRate Annual Interest Rate (e.g., 8.5 for 8.5%)
     * @return Monthly rate fraction (e.g., 0.007083...)
     */
    public static BigDecimal getMonthlyRate(BigDecimal annualRate) {
        if (annualRate == null || annualRate.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        // Rate / 12 / 100
        return annualRate.divide(TWELVE, PRECISION, ROUNDING)
                .divide(HUNDRED, PRECISION, ROUNDING);
    }

    /**
     * Standard EMI Calculation Formula: [P * r * (1+r)^n] / [(1+r)^n - 1]
     */
    public static BigDecimal calculateEmi(BigDecimal principal, BigDecimal annualRate, int months) {
        if (principal == null || months == 0) return BigDecimal.ZERO;

        BigDecimal monthlyRate = getMonthlyRate(annualRate);

        // If interest is 0, just divide principal by months
        if (monthlyRate.compareTo(BigDecimal.ZERO) == 0) {
            return principal.divide(new BigDecimal(months), MC);
        }

        BigDecimal onePlusR = BigDecimal.ONE.add(monthlyRate);
        BigDecimal onePlusRPowN = onePlusR.pow(months, MC);

        BigDecimal numerator = principal.multiply(monthlyRate, MC).multiply(onePlusRPowN, MC);
        BigDecimal denominator = onePlusRPowN.subtract(BigDecimal.ONE, MC);

        return numerator.divide(denominator, MC);
    }

    /**
     * Rounds a generic amount to 2 decimal places (good for Currency display)
     */
    public static BigDecimal roundCurrency(BigDecimal amount) {
        return amount != null ? amount.setScale(2, ROUNDING) : BigDecimal.ZERO;
    }

    /**
     * Rounds EMI to the nearest whole number (standard practice)
     */
    public static BigDecimal roundEmi(BigDecimal amount) {
        return amount != null ? amount.setScale(0, ROUNDING) : BigDecimal.ZERO;
    }
}