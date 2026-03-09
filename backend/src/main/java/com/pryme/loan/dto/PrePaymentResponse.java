package com.pryme.loan.dto;

import java.math.BigDecimal;

public class PrePaymentResponse {
    private BigDecimal regularEmi;
    private BigDecimal regularTotalInterest;

    // Optimized Results
    private BigDecimal newTotalInterest;
    private BigDecimal interestSaved;
    private int originalMonths;
    private int newMonths;
    private int monthsSaved;

    // Detailed Breakdown
    private BigDecimal yearlyExtraPayment; // For 13th EMI display
    private BigDecimal firstYearEmi;
    private BigDecimal lastYearEmi;

    public PrePaymentResponse() {}

    // Getters and Setters...
    // (Generate standard getters/setters here)
    public BigDecimal getRegularEmi() { return regularEmi; }
    public void setRegularEmi(BigDecimal regularEmi) { this.regularEmi = regularEmi; }
    public BigDecimal getRegularTotalInterest() { return regularTotalInterest; }
    public void setRegularTotalInterest(BigDecimal regularTotalInterest) { this.regularTotalInterest = regularTotalInterest; }
    public BigDecimal getNewTotalInterest() { return newTotalInterest; }
    public void setNewTotalInterest(BigDecimal newTotalInterest) { this.newTotalInterest = newTotalInterest; }
    public BigDecimal getInterestSaved() { return interestSaved; }
    public void setInterestSaved(BigDecimal interestSaved) { this.interestSaved = interestSaved; }
    public int getOriginalMonths() { return originalMonths; }
    public void setOriginalMonths(int originalMonths) { this.originalMonths = originalMonths; }
    public int getNewMonths() { return newMonths; }
    public void setNewMonths(int newMonths) { this.newMonths = newMonths; }
    public int getMonthsSaved() { return monthsSaved; }
    public void setMonthsSaved(int monthsSaved) { this.monthsSaved = monthsSaved; }
    public BigDecimal getYearlyExtraPayment() { return yearlyExtraPayment; }
    public void setYearlyExtraPayment(BigDecimal yearlyExtraPayment) { this.yearlyExtraPayment = yearlyExtraPayment; }
    public BigDecimal getFirstYearEmi() { return firstYearEmi; }
    public void setFirstYearEmi(BigDecimal firstYearEmi) { this.firstYearEmi = firstYearEmi; }
    public BigDecimal getLastYearEmi() { return lastYearEmi; }
    public void setLastYearEmi(BigDecimal lastYearEmi) { this.lastYearEmi = lastYearEmi; }
}