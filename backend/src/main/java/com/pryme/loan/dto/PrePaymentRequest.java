package com.pryme.loan.dto;

import java.math.BigDecimal;

public class PrePaymentRequest {
    private BigDecimal loanAmount;
    private BigDecimal interestRate; // Annual rate in %
    private Integer tenureYears;
    private boolean enable13thEmi;
    private boolean enableStepUp; // 5% increase

    // Getters and Setters
    public BigDecimal getLoanAmount() { return loanAmount; }
    public void setLoanAmount(BigDecimal loanAmount) { this.loanAmount = loanAmount; }
    public BigDecimal getInterestRate() { return interestRate; }
    public void setInterestRate(BigDecimal interestRate) { this.interestRate = interestRate; }
    public Integer getTenureYears() { return tenureYears; }
    public void setTenureYears(Integer tenureYears) { this.tenureYears = tenureYears; }
    public boolean isEnable13thEmi() { return enable13thEmi; }
    public void setEnable13thEmi(boolean enable13thEmi) { this.enable13thEmi = enable13thEmi; }
    public boolean isEnableStepUp() { return enableStepUp; }
    public void setEnableStepUp(boolean enableStepUp) { this.enableStepUp = enableStepUp; }
}